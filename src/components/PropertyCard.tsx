import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Property } from '../types/property';

const { width } = Dimensions.get('window');

interface PropertyCardProps {
  property: Property;
  onPress: (property: Property) => void;
  showActions?: boolean;
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
  onToggleAvailability?: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
  showActions = false,
  onEdit,
  onDelete,
  onToggleAvailability,
}) => {
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}/month`;
  };

  const formatArea = (area: number) => {
    return `${area} sq ft`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(property)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: property.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>{formatPrice(property.price)}</Text>
        </View>
        {!property.isAvailable && (
          <View style={styles.unavailableOverlay}>
            <Text style={styles.unavailableText}>Not Available</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {property.title}
          </Text>
          <View style={styles.propertyType}>
            <Text style={styles.propertyTypeText}>
              {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
            </Text>
          </View>
        </View>

        <Text style={styles.location} numberOfLines={1}>
          <Icon name="location" size={14} color="#666" />
          {' '}{property.location}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Icon name="bed" size={16} color="#666" />
            <Text style={styles.detailText}>{property.rooms} rooms</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="resize" size={16} color="#666" />
            <Text style={styles.detailText}>{formatArea(property.area)}</Text>
          </View>
        </View>

        <View style={styles.amenities}>
          {property.parking && (
            <View style={styles.amenityTag}>
              <Icon name="car" size={12} color="#4CAF50" />
              <Text style={styles.amenityText}>Parking</Text>
            </View>
          )}
          {property.furnished && (
            <View style={styles.amenityTag}>
              <Icon name="home" size={12} color="#4CAF50" />
              <Text style={styles.amenityText}>Furnished</Text>
            </View>
          )}
          {property.petsAllowed && (
            <View style={styles.amenityTag}>
              <Icon name="paw" size={12} color="#4CAF50" />
              <Text style={styles.amenityText}>Pets</Text>
            </View>
          )}
        </View>

        {showActions && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => onEdit?.(property)}
            >
              <Icon name="create" size={16} color="#fff" />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.toggleButton]}
              onPress={() => onToggleAvailability?.(property)}
            >
              <Icon 
                name={property.isAvailable ? "eye-off" : "eye"} 
                size={16} 
                color="#fff" 
              />
              <Text style={styles.actionText}>
                {property.isAvailable ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete?.(property)}
            >
              <Icon name="trash" size={16} color="#fff" />
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  priceTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priceText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  propertyType: {
    backgroundColor: '#667eea',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  propertyTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  amenityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  amenityText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  toggleButton: {
    backgroundColor: '#FF9800',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default PropertyCard; 