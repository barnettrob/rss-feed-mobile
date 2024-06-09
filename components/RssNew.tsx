import React, {useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { XMLParser } from "fast-xml-parser";

interface Feed {
  url: string;
}

const RssNew = () => {
  const [feed, setFeed] = useState<Array<Feed>>([]);

  useEffect(() => {
    getFeedData();
  }, [])

  const getFeedData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("rss-feeds");
      const jsonObject = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (typeof jsonObject === "object" && 'rss' in jsonObject) {
        setFeed(jsonObject.rss);
        
      }
      return jsonObject;
    } catch (e) {
      // error reading value
    }
  };

  const fetchFeed = (rss: any) => {
    const parser = new XMLParser();

    const url = fetch(rss)
      .then((result) => result.text())
      .then((data) => {
        const feedData = parser.parse(data);
        return feedData.rss.channel["item"];
      })
      .then(function (d) {
        return d;
      });

    return url;
  }

  alert(JSON.stringify(feed))

  return (
    <Text>RssNew</Text>
  )
}

export default RssNew