import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { fetchMyProperties, deleteProperty, togglePropertyAvailability } from '../redux/slices/propertySlice';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import PropertyCard from '../components/PropertyCard';
import { RootState } from '../redux/store';
import { Property } from '../types/property';

const RealtorDashboard = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { myProperties, loading } = useSelector((state: RootState) => state.property);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.email) {
      loadMyProperties();
    }
  }, [user]);

  const loadMyProperties = async () => {
    if (user?.email) {
      try {
        await dispatch(fetchMyProperties(user.email) as any);
      } catch (error) {
        console.error('Error loading properties:', error);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMyProperties();
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
    // Navigate to property details screen
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
      showActions={true}
      onEdit={handleEditProperty}
      onDelete={handleDeleteProperty}
      onToggleAvailability={handleToggleAvailability}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="home-outline" size={80} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Properties Yet</Text>
      <Text style={styles.emptyStateText}>
        Start by adding your first property listing to attract potential buyers.
      </Text>
      <TouchableOpacity
        style={styles.addFirstPropertyButton}
        onPress={() => (navigation as any).navigate('AddProperty')}
      >
        <Icon name="add" size={20} color="#fff" />
        <Text style={styles.addFirstPropertyText}>Add Your First Property</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>{user?.email}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="log-out-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{myProperties.length}</Text>
            <Text style={styles.statLabel}>Total Properties</Text>
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
      </View>

      <View style={styles.content}>
        <View style={styles.contentHeader}>
          <Text style={styles.sectionTitle}>My Properties</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => (navigation as any).navigate('AddProperty')}
          >
            <Icon name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add Property</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={myProperties}
          renderItem={renderProperty}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

export default RealtorDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#667eea',
    paddingTop: 60,
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
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
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
  content: {
    flex: 1,
    paddingTop: 20,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
