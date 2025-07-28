import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { fetchProperties, fetchMyProperties, searchProperties, deleteProperty, togglePropertyAvailability } from '../../redux/slices/propertySlice';
import PropertyCard from '../../components/PropertyCard';
import { Property } from '../../types/property';
import Icon from 'react-native-vector-icons/Ionicons';
import { logout } from '../../redux/slices/authSlice';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import FilterBar from '../../components/FilterBar';

const PropertyListScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { properties, myProperties, loading, lastFetched } = useSelector((state: RootState) => state.property);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({ area: '', rooms: '', price: '', minPrice: '', maxPrice: '', minSize: '', maxSize: '' }); //
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);//
  const [isFiltering, setIsFiltering] = useState(false); ///
  const [showMyProperties, setShowMyProperties] = useState(true);


  const isRealtor = user?.role === 'realtor';
  const displayProperties = isRealtor ? myProperties : properties;

  useEffect(() => {
    loadProperties();
  }, [user]);

  const loadProperties = async () => {
    if (!user?.email) return;

    try {
      if (isRealtor) {
        await dispatch(fetchMyProperties(user.email) as any);
      } else {
        await dispatch(fetchProperties() as any);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      Alert.alert('Error', 'Failed to load properties');
    }
  };

  const applyFilters = () => {
    if (!isRealtor) {
      const filtered = properties.filter((prop) => {
        const minPriceMatch = filters.minPrice ? prop.price >= parseInt(filters.minPrice) : true;
        const maxPriceMatch = filters.maxPrice ? prop.price <= parseInt(filters.maxPrice) : true;
        const minSizeMatch = filters.minSize ? prop.size >= parseInt(filters.minSize) : true;
        const maxSizeMatch = filters.maxSize ? prop.size <= parseInt(filters.maxSize) : true;
  
        return minPriceMatch && maxPriceMatch && minSizeMatch && maxSizeMatch;
      });
  
      setFilteredProperties(filtered);
      setIsFiltering(true);
    }
  };
  




  const onRefresh = async () => {
    setRefreshing(true);
    await loadProperties();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      (navigation as any).navigate('SignIn');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handlePropertyPress = (property: Property) => {
    (navigation as any).navigate('PropertyDetails', { property });
  };

  const handleEditProperty = (property: Property) => {
    (navigation as any).navigate('EditProperty', { property });
  };

  const handleDeleteProperty = (property: Property) => {
    Alert.alert(
      'Delete Property',
      `Are you sure you want to delete "${property.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteProperty(property.id) as any);
              Alert.alert('Success', 'Property deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete property');
            }
          },
        },
      ]
    );
  };

  const handleToggleAvailability = async (property: Property) => {
    try {
      await dispatch(togglePropertyAvailability({ 
        propertyId: property.id, 
        isAvailable: !property.isAvailable 
      }) as any);
      Alert.alert('Success', `Property ${property.isAvailable ? 'hidden' : 'made visible'} successfully`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update property availability');
    }
  };

  const renderProperty = ({ item }: { item: Property }) => (
    <PropertyCard
      property={item}
      onPress={handlePropertyPress}
      showActions={isRealtor}
      onEdit={isRealtor ? handleEditProperty : undefined}
      onDelete={isRealtor ? handleDeleteProperty : undefined}
      onToggleAvailability={isRealtor ? handleToggleAvailability : undefined}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="home-outline" size={80} color="#ccc" />
      <Text style={styles.emptyStateTitle}>
        {isRealtor ? 'No Properties Yet' : 'No Properties Available'}
      </Text>
      <Text style={styles.emptyStateText}>
        {isRealtor 
          ? 'Start by adding your first property listing to attract potential buyers.'
          : 'Check back later for new property listings.'
        }
      </Text>
      {isRealtor && (
        <TouchableOpacity
          style={styles.addFirstPropertyButton}
          onPress={() => (navigation as any).navigate('AddProperty')}
        >
          <Icon name="add" size={20} color="#fff" />
          <Text style={styles.addFirstPropertyText}>Add Your First Property</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.welcomeText}>
            Welcome, {isRealtor ? 'Realtor' : 'Buyer'}!
          </Text>
          <Text style={styles.subtitleText}>
            {isRealtor ? 'Manage your properties' : 'Find your dream home'}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {isRealtor && (
        <View style={styles.realtorStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{myProperties.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {myProperties.filter(p => p.isAvailable).length}
            </Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {myProperties.filter(p => !p.isAvailable).length}
            </Text>
            <Text style={styles.statLabel}>Hidden</Text>
          </View>
        </View>
      )}

      <View style={styles.actionBar}>
        <Text style={styles.sectionTitle}>
          {isRealtor ? 'My Properties' : 'Available Properties'}
        </Text>
        {isRealtor && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => (navigation as any).navigate('AddProperty')}
          >
            <Icon name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add Property</Text>
          </TouchableOpacity>
        )}
      </View>
      {!isRealtor && (
  <FilterBar
    filters={filters}
    onChange={setFilters}
    onApply={applyFilters}
    onClear={() => {
      setFilters({ area: '', rooms: '', price: '' });
      setIsFiltering(false);
    }}
  />
)}
    </View>
  );

  if (loading && !lastFetched) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading properties...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={isFiltering ? filteredProperties : displayProperties}
        // data={displayProperties}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default PropertyListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#667eea',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitleText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  realtorStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  addFirstPropertyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addFirstPropertyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});




