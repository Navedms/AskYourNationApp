import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import useAuth from '../auth/useAuth';

export default function MainScreen() {
  const { user } = useAuth();
  console.log(user);

  return (
    <View>
      <Text>MainScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
