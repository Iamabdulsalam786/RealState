import firestore from '@react-native-firebase/firestore';
import { Property, CreatePropertyData, UpdatePropertyData, PropertyFilters } from '../types/property';

export const createProperty = async (propertyData: CreatePropertyData, realtorId: string, realtorEmail: string): Promise<string> => {
  const property = {
    ...propertyData,
    realtorId,
    realtorEmail,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
    isAvailable: true,
  };

  const docRef = await firestore().collection('properties').add(property);
  return docRef.id;
};

export const getProperties = async (filters?: PropertyFilters): Promise<Property[]> => {
  let query = firestore().collection('properties').where('isAvailable', '==', true);

  if (filters) {
    if (filters.minPrice !== undefined) {
      query = query.where('price', '>=', filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      query = query.where('price', '<=', filters.maxPrice);
    }
    if (filters.minArea !== undefined) {
      query = query.where('area', '>=', filters.minArea);
    }
    if (filters.maxArea !== undefined) {
      query = query.where('area', '<=', filters.maxArea);
    }
    if (filters.minRooms !== undefined) {
      query = query.where('rooms', '>=', filters.minRooms);
    }
    if (filters.maxRooms !== undefined) {
      query = query.where('rooms', '<=', filters.maxRooms);
    }
    if (filters.propertyType) {
      query = query.where('propertyType', '==', filters.propertyType);
    }
    if (filters.parking !== undefined) {
      query = query.where('parking', '==', filters.parking);
    }
    if (filters.furnished !== undefined) {
      query = query.where('furnished', '==', filters.furnished);
    }
    if (filters.petsAllowed !== undefined) {
      query = query.where('petsAllowed', '==', filters.petsAllowed);
    }
  }

  const snapshot = await query.orderBy('createdAt', 'desc').get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Property[];
};

export const getPropertiesByRealtor = async (realtorId: string): Promise<Property[]> => {
  const snapshot = await firestore()
    .collection('properties')
    .where('realtorId', '==', realtorId)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Property[];
};

export const getPropertyById = async (propertyId: string): Promise<Property | null> => {
  const doc = await firestore().collection('properties').doc(propertyId).get();
  
  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data()?.createdAt?.toDate() || new Date(),
    updatedAt: doc.data()?.updatedAt?.toDate() || new Date(),
  } as Property;
};

export const updateProperty = async (propertyId: string, updateData: UpdatePropertyData): Promise<void> => {
  const updatePayload = {
    ...updateData,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  };

  await firestore().collection('properties').doc(propertyId).update(updatePayload);
};

export const deleteProperty = async (propertyId: string): Promise<void> => {
  await firestore().collection('properties').doc(propertyId).delete();
};

export const togglePropertyAvailability = async (propertyId: string, isAvailable: boolean): Promise<void> => {
  await firestore().collection('properties').doc(propertyId).update({
    isAvailable,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
};

// Search properties by text (title, description, location)
export const searchProperties = async (searchTerm: string): Promise<Property[]> => {
  const snapshot = await firestore()
    .collection('properties')
    .where('isAvailable', '==', true)
    .orderBy('createdAt', 'desc')
    .get();

  const properties = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Property[];

  // Filter by search term (case-insensitive)
  const searchLower = searchTerm.toLowerCase();
  return properties.filter(property => 
    property.title.toLowerCase().includes(searchLower) ||
    property.description.toLowerCase().includes(searchLower) ||
    property.location.toLowerCase().includes(searchLower)
  );
};
