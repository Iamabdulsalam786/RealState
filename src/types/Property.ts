export interface Property {
  size: number;
  id: string;
  title: string;
  description: string;
  price: number;
  area: number;
  rooms: number;
  imageUrl: string;
  location: string;
  realtorId: string;
  realtorEmail: string;
  createdAt: Date;
  updatedAt: Date;
  isAvailable: boolean;
  amenities: string[];
  propertyType: 'apartment' | 'house' | 'condo' | 'studio';
  parking: boolean;
  furnished: boolean;
  petsAllowed: boolean;
}

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  minRooms?: number;
  maxRooms?: number;
  propertyType?: Property['propertyType'];
  parking?: boolean;
  furnished?: boolean;
  petsAllowed?: boolean;
}

export interface CreatePropertyData {
  title: string;
  description: string;
  price: number;
  area: number;
  rooms: number;
  imageUrl: string;
  location: string;
  amenities: string[];
  propertyType: Property['propertyType'];
  parking: boolean;
  furnished: boolean;
  petsAllowed: boolean;
}

export interface UpdatePropertyData extends Partial<CreatePropertyData> {
  id: string;
}