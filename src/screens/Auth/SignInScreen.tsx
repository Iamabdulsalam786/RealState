import { StyleSheet, Text, View, Alert, Dimensions, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import InputField from '../../components/InputField';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import { getUserRole } from '../../services/UserService';

const { width, height } = Dimensions.get('window');

const SignInScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const role = await getUserRole(user.uid);
      if (!role) {
        Alert.alert('Error', 'No role found. Please contact support.');
        return;
      }

      // Ensure role is either 'realtor' or 'buyer'
      if (role !== 'realtor' && role !== 'buyer') {
        Alert.alert('Error', 'Invalid user role.');
        return;
      }

      dispatch(login({ email: user.email || '', role }));
      Alert.alert('Success', `Signed in as ${role}`);

      // Route both roles to PropertyList
      (navigation as any).navigate('PropertyList');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Sign In Error', error.message);
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
            <Text style={styles.appSubtitle}>Find Your Dream Home</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.heading}>Sign In</Text>
            <Text style={styles.tagline}>Welcome back! Please sign in to continue.</Text>

            <View style={styles.inputContainer}>
              <InputField
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
              />

              <InputField
                label="Password"
                placeholder="Enter your password"
                isPassword
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity 
              style={styles.signInButton}
              onPress={handleSignIn}
              activeOpacity={0.8}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.createAccountContainer}
              onPress={() => (navigation as any).navigate('ChooseRole')}
              activeOpacity={0.7}
            >
              <Text style={styles.createAccountText}>
                Don't have an account? <Text style={styles.linkText}>Create one</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default SignInScreen;

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
  signInButton: {
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
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  createAccountContainer: {
    alignItems: 'center',
  },
  createAccountText: {
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
  











