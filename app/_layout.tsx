import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
      <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name="welcome"/>
        <Stack.Screen name="login"/>
        <Stack.Screen name="register"/>
        <Stack.Screen name="home"/>
        
        
      </Stack>
    
  );
};

export default _layout;