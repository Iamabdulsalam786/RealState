import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, TextInputProps } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

type InputFieldProps = {
  label?: string;
  placeholder?: string;
  isPassword?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: TextInputProps['keyboardType'];
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  isPassword = false,
  value,
  onChangeText,
  error,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
}) => {
  const [secure, setSecure] = useState(isPassword);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        error && styles.inputContainerError,
        multiline && styles.inputContainerMultiline
      ]}>
        <TextInput 
          style={[
            styles.input,
            multiline && styles.inputMultiline
          ]}
          placeholder={placeholder}
          placeholderTextColor="#888"
          secureTextEntry={secure}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Feather
              name={secure ? 'eye-off' : 'eye'}
              size={20}
              color="#666"
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
    wrapper: {
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#333',
      marginLeft: 5,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 12,
      backgroundColor: '#fff',
      paddingHorizontal: 15,
      minHeight: 50,
    },
    inputContainerError: {
      borderColor: '#FF3B30',
    },
    inputContainerMultiline: {
      alignItems: 'flex-start',
      paddingTop: 12,
      paddingBottom: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: '#333',
    },
    inputMultiline: {
      textAlignVertical: 'top',
      minHeight: 80,
    },
    icon: {
      marginLeft: 10,
    },
    errorText: {
      color: '#FF3B30',
      fontSize: 12,
      marginTop: 4,
      marginLeft: 5,
    },
  });