import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import InputField from '../../components/InputField';
import { SafeAreaView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth } from '../../config/firebase';
import { saveUserRole } from '../../services/UserService';

const { width, height } = Dimensions.get('window');

const SignUpScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { role } = route.params as { role: 'realtor' | 'buyer' };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!role) {
      Alert.alert('Error', 'No role selected. Please go back and choose a role.');
      return;
    }

    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await saveUserRole(user.uid, role);
      dispatch(login({ email: user.email || '', role }));

      Alert.alert('Success', `Signed up as ${role}`);

      // Route both roles to PropertyList
      (navigation as any).navigate('PropertyList');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Signup Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <Text style={styles.appTitle}>PropertyHub</Text>
            <Text style={styles.appSubtitle}>Create your account</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.heading}>Sign Up as {role === 'realtor' ? 'Realtor' : 'Buyer'}</Text>
            <Text style={styles.tagline}>Get started with PropertyHub</Text>

            <View style={styles.inputContainer}>
              <InputField
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
              />

              <InputField
                label="Password"
                placeholder="Create a password"
                isPassword
                value={password}
                onChangeText={setPassword}
              />

              <InputField
                label="Confirm Password"
                placeholder="Re-enter your password"
                isPassword
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>Creating your account...</Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.signUpButton}
                onPress={handleSignup}
                activeOpacity={0.8}
              >
                <Text style={styles.signUpButtonText}>Create Account</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.backToSignInContainer}
              onPress={() => (navigation as any).goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backToSignInText}>
                Already have an account? <Text style={styles.linkText}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    fontWeight: '400',
  },
  inputContainer: {
    marginBottom: 25,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  signUpButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backToSignInContainer: {
    alignItems: 'center',
  },
  backToSignInText: {
    textAlign: 'center',
    color: '#667eea',
    fontWeight: '500',
    fontSize: 16,
  },
  linkText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});



















