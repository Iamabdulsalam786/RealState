import React from 'react';
import { StyleSheet, Text, TouchableOpacity, GestureResponderEvent } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  backgroundColor?: string;
  textColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  backgroundColor = 'green',
  textColor = 'white',
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
















// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React from 'react'

// const Button = () => {
//   return (
//     <View>
//       <TouchableOpacity style={styles.Signupbtn}>
//       <Text style={styles.SignupText}>Sign Up</Text> 
//         </TouchableOpacity>
//     </View>
//   )
// }

// export default Button

// const styles = StyleSheet.create({
//     Signupbtn:{
//         height:50,
//         backgroundColor:'green',
//         borderRadius:60,
//         justifyContent:'center',
//         alignItems:'center',
//         marginVertical:10,
//         marginHorizontal:20,
//         shadowColor:'white',
//         color:'white',
// },
// SignupText:{
//     color:'white',
//     fontSize:18,
//     fontWeight:'bold',
// }
// })