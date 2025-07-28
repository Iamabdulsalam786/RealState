import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const ChooseRoleScreen = () => {
  const navigation = useNavigation();

  const handleSelectRole = (role: 'realtor' | 'buyer') => {
    (navigation as any).navigate('SignUp', { role });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.backgroundGradient}>
          <View style={styles.gradientOverlay} />
        </View>

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icon name="home" size={60} color="#fff" />
          </View>
          <Text style={styles.appTitle}>PropertyHub</Text>
          <Text style={styles.appSubtitle}>Choose Your Role</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.heading}>How will you use PropertyHub?</Text>
          <Text style={styles.tagline}>Select your role to get started</Text>

          <View style={styles.roleContainer}>
            <TouchableOpacity 
              style={styles.roleCard}
              onPress={() => handleSelectRole('realtor')}
              activeOpacity={0.8}
            >
              <View style={styles.roleIconContainer}>
                <Icon name="business" size={50} color="#FF6B6B" />
              </View>
              <Text style={styles.roleTitle}>I'm a Realtor</Text>
              <Text style={styles.roleDescription}>
                Create and manage property listings. Reach potential buyers and grow your business.
              </Text>
              <View style={styles.roleFeatures}>
                <View style={styles.featureItem}>
                  <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.featureText}>Create property listings</Text>
                </View>
                <View style={styles.featureItem}>
                  <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.featureText}>Manage your properties</Text>
                </View>
                <View style={styles.featureItem}>
                  <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.featureText}>Connect with buyers</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.roleCard}
              onPress={() => handleSelectRole('buyer')}
              activeOpacity={0.8}
            >
              <View style={styles.roleIconContainer}>
                <Icon name="person" size={50} color="#4ECDC4" />
              </View>
              <Text style={styles.roleTitle}>I'm a Buyer</Text>
              <Text style={styles.roleDescription}>
                Browse properties, filter by your preferences, and find your dream home.
              </Text>
              <View style={styles.roleFeatures}>
                <View style={styles.featureItem}>
                  <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.featureText}>Browse all properties</Text>
                </View>
                <View style={styles.featureItem}>
                  <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.featureText}>Filter by price & size</Text>
                </View>
                <View style={styles.featureItem}>
                  <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.featureText}>Save favorites</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backToSignInContainer}
            onPress={() => (navigation as any).navigate('SignIn')}
            activeOpacity={0.7}
          >
            <Text style={styles.backToSignInText}>
              Already have an account? <Text style={styles.linkText}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ChooseRoleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  safeArea: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#667eea',
  },
  gradientOverlay: {
    flex: 1,
    backgroundColor: 'rgba(118, 75, 162, 0.3)',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '300',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#fff',
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  roleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  roleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  roleIconContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  roleDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    lineHeight: 20,
  },
  roleFeatures: {
    marginTop: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  backToSignInContainer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  backToSignInText: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    fontSize: 16,
  },
  linkText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    color: '#fff',
  },
});
