import React, {useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RssNew = () => {

  useEffect(() => {
    getFeedData();
  }, [])

  const getFeedData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("rss-feeds");
      alert(jsonValue)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  return (
    <Text>RssNew</Text>
  )
}

export default RssNew