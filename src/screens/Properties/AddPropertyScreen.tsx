import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { createProperty } from '../../redux/slices/propertySlice';
import InputField from '../../components/InputField';
import Icon from 'react-native-vector-icons/Ionicons';



const AddPropertyScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading } = useSelector((state: RootState) => state.property);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    area: '',
    rooms: '',
    location: '',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=300&fit=crop', // Placeholder image
    propertyType: 'apartment' as const,
    parking: false,
    furnished: false,
    petsAllowed: false,
    amenities: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    } else if (isNaN(Number(formData.area)) || Number(formData.area) <= 0) {
      newErrors.area = 'Area must be a positive number';
    }

    if (!formData.rooms.trim()) {
      newErrors.rooms = 'Number of rooms is required';
    } else if (isNaN(Number(formData.rooms)) || Number(formData.rooms) <= 0) {
      newErrors.rooms = 'Number of rooms must be a positive number';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    if (!user?.email) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      const propertyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        area: Number(formData.area),
        rooms: Number(formData.rooms),
        location: formData.location.trim(),
        imageUrl: formData.imageUrl,
        propertyType: formData.propertyType,
        parking: formData.parking,
        furnished: formData.furnished,
        petsAllowed: formData.petsAllowed,
        amenities: formData.amenities,
      };

      await dispatch(createProperty({
        propertyData,
        realtorId: user.email,
        realtorEmail: user.email,
      }) as any);

      Alert.alert('Success', 'Property created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error creating property:', error);
      Alert.alert('Error', 'Failed to create property. Please try again.');
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const renderAmenityButton = (amenity: string, icon: string) => (
    <TouchableOpacity
      key={amenity}
      style={[
        styles.amenityButton,
        formData.amenities.includes(amenity) && styles.amenityButtonActive,
      ]}
      onPress={() => toggleAmenity(amenity)}
    >
      <Icon
        name={icon as any}
        size={20}
        color={formData.amenities.includes(amenity) ? '#fff' : '#667eea'}
      />
      <Text
        style={[
          styles.amenityText,
          formData.amenities.includes(amenity) && styles.amenityTextActive,
        ]}
      >
        {amenity}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Add New Property</Text>
            <Text style={styles.subtitle}>Create a listing to attract potential buyers</Text>
          </View>

          <View style={styles.form}>
            <InputField
              label="Property Title"
              placeholder="Enter property title"
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              error={errors.title}
            />

            <InputField
              label="Description"
              placeholder="Describe your property"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              error={errors.description}
              multiline
              numberOfLines={4}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="Price ($/month)"
                  placeholder="1500"
                  value={formData.price}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
                  error={errors.price}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfWidth}>
                <InputField
                  label="Area (sq ft)"
                  placeholder="1200"
                  value={formData.area}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, area: text }))}
                  error={errors.area}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="Number of Rooms"
                  placeholder="3"
                  value={formData.rooms}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, rooms: text }))}
                  error={errors.rooms}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfWidth}>
                <InputField
                  label="Location"
                  placeholder="City, State"
                  value={formData.location}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                  error={errors.location}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Property Type</Text>
              <View style={styles.propertyTypeContainer}>
                {['apartment', 'house', 'condo', 'studio'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.propertyTypeButton,
                      formData.propertyType === type && styles.propertyTypeButtonActive,
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, propertyType: type as any }))}
                  >
                    <Text
                      style={[
                        styles.propertyTypeText,
                        formData.propertyType === type && styles.propertyTypeTextActive,
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featuresContainer}>
                <TouchableOpacity
                  style={[
                    styles.featureButton,
                    formData.parking && styles.featureButtonActive,
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, parking: !prev.parking }))}
                >
                  <Icon
                    name="car"
                    size={20}
                    color={formData.parking ? '#fff' : '#667eea'}
                  />
                  <Text
                    style={[
                      styles.featureText,
                      formData.parking && styles.featureTextActive,
                    ]}
                  >
                    Parking
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.featureButton,
                    formData.furnished && styles.featureButtonActive,
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, furnished: !prev.furnished }))}
                >
                  <Icon
                    name="home"
                    size={20}
                    color={formData.furnished ? '#fff' : '#667eea'}
                  />
                  <Text
                    style={[
                      styles.featureText,
                      formData.furnished && styles.featureTextActive,
                    ]}
                  >
                    Furnished
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.featureButton,
                    formData.petsAllowed && styles.featureButtonActive,
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, petsAllowed: !prev.petsAllowed }))}
                >
                  <Icon
                    name="paw"
                    size={20}
                    color={formData.petsAllowed ? '#fff' : '#667eea'}
                  />
                  <Text
                    style={[
                      styles.featureText,
                      formData.petsAllowed && styles.featureTextActive,
                    ]}
                  >
                    Pets Allowed
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesContainer}>
                {renderAmenityButton('WiFi', 'wifi')}
                {renderAmenityButton('Air Conditioning', 'snow')}
                {renderAmenityButton('Gym', 'fitness')}
                {renderAmenityButton('Pool', 'water')}
                {renderAmenityButton('Balcony', 'home')}
                {renderAmenityButton('Security', 'shield-checkmark')}
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Icon name="add" size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>Create Property</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddPropertyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  propertyTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  propertyTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#667eea',
    backgroundColor: '#fff',
  },
  propertyTypeButtonActive: {
    backgroundColor: '#667eea',
  },
  propertyTypeText: {
    color: '#667eea',
    fontWeight: '500',
  },
  propertyTypeTextActive: {
    color: '#fff',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#667eea',
    backgroundColor: '#fff',
  },
  featureButtonActive: {
    backgroundColor: '#667eea',
  },
  featureText: {
    marginLeft: 8,
    color: '#667eea',
    fontWeight: '500',
  },
  featureTextActive: {
    color: '#fff',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#667eea',
    backgroundColor: '#fff',
  },
  amenityButtonActive: {
    backgroundColor: '#667eea',
  },
  amenityText: {
    marginLeft: 6,
    color: '#667eea',
    fontSize: 12,
    fontWeight: '500',
  },
  amenityTextActive: {
    color: '#fff',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 30,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
