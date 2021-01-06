import React from 'react';
import {View, StyleSheet, ActivityIndicator, Text} from 'react-native';
import  Colors  from '../../constants/Colors';


const Loader = props => {
    return (
        <View style={styles.centered}>
            <ActivityIndicator {...props} size='large'color={Colors.primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default Loader;