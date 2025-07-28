import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import ChooseRoleScreen from '../screens/Auth/ChooseRoleScreen';
import AddPropertyScreen from '../screens/Properties/AddPropertyScreen';
import PropertyListScreen from '../screens/Properties/PropertyListScreen';
import EditPropertyScreen from '../screens/Properties/EditPropertyScreen';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const user = useSelector((state: RootState) => state.auth.user);


  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={user ? 'PropertyList' : 'SignIn'}
      >
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChooseRole"
          component={ChooseRoleScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddProperty"
          component={AddPropertyScreen}
          options={{ headerShown: true, title: 'Add Property' }}
        />
         <Stack.Screen
          name="EditProperty"
          component={EditPropertyScreen}
          options={{ headerShown: true, title: 'Edit Property' }}
        />

        <Stack.Screen
          name="PropertyList"
          component={PropertyListScreen}
          options={{ headerShown: true, title: 'Properties' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
