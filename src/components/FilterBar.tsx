import React from 'react';
import { View, TextInput, StyleSheet, Button } from 'react-native';

interface FilterValues {
  minPrice: string;
  maxPrice: string;
  minSize: string;
  maxSize: string;
}

interface FilterBarProps {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
  onApply: () => void;
  onClear: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange, onApply, onClear }) => {
  const handleInputChange = (field: keyof FilterValues, value: string) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Min Price"
        style={styles.input}
        keyboardType="numeric"
        value={filters.minPrice}
        onChangeText={(text) => handleInputChange('minPrice', text)}
      />
      <TextInput
        placeholder="Max Price"
        style={styles.input}
        keyboardType="numeric"
        value={filters.maxPrice}
        onChangeText={(text) => handleInputChange('maxPrice', text)}
      />
      <TextInput
        placeholder="Min Size"
        style={styles.input}
        keyboardType="numeric"
        value={filters.minSize}
        onChangeText={(text) => handleInputChange('minSize', text)}
      />
      <TextInput
        placeholder="Max Size"
        style={styles.input}
        keyboardType="numeric"
        value={filters.maxSize}
        onChangeText={(text) => handleInputChange('maxSize', text)}
      />

      <View style={styles.buttonRow}>
        <Button title="Apply" onPress={onApply} />
        <Button title="Clear" onPress={onClear} color="#888" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});

export default FilterBar;














// import React, { useState } from 'react';
// import { View, TextInput, StyleSheet, Button } from 'react-native';

// interface FilterProps {
//   filters: { minPrice: string; maxPrice: string; minSize: string; maxSize: string };
//   onChange: (filters: { minPrice: string; maxPrice: string; minSize: string; maxSize: string }) => void;
//   onApply: () => void;
//   onClear: () => void;
// }

// const FilterBar: React.FC<FilterProps> = ({ filters, onChange, onApply, onClear }) => {
//   const handleInputChange = (field: keyof typeof filters, value: string) => {
//     onChange({ ...filters, [field]: value });
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Min Price"
//         style={styles.input}
//         keyboardType="numeric"
//         value={filters.minPrice}
//         onChangeText={(text) => handleInputChange('minPrice', text)}
//       />
//       <TextInput
//         placeholder="Max Price"
//         style={styles.input}
//         keyboardType="numeric"
//         value={filters.maxPrice}
//         onChangeText={(text) => handleInputChange('maxPrice', text)}
//       />
//       <TextInput
//         placeholder="Min Size"
//         style={styles.input}
//         keyboardType="numeric"
//         value={filters.minSize}
//         onChangeText={(text) => handleInputChange('minSize', text)}
//       />
//       <TextInput
//         placeholder="Max Size"
//         style={styles.input}
//         keyboardType="numeric"
//         value={filters.maxSize}
//         onChangeText={(text) => handleInputChange('maxSize', text)}
//       />

//       <View style={styles.buttonRow}>
//         <Button title="Apply" onPress={onApply} />
//         <Button title="Clear" onPress={onClear} color="#888" />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//   },
//   input: {
//     backgroundColor: '#f0f0f0',
//     padding: 8,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
// });

// export default FilterBar;


















