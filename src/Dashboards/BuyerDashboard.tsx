import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

const BuyerDashboard = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      (navigation as any).navigate('SignIn');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome, Buyer!</Text>
      <Button
        title="Browse Properties"
        onPress={() => (navigation as any).navigate('PropertyList')}
      />
      <View style={styles.buttonSpacer} />
      <Button
        title="Logout"
        onPress={handleLogout}
        color="#FF3B30"
      />
    </View>
  );
};

export default BuyerDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  buttonSpacer: { height: 20 },
});
