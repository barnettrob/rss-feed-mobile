import React, {useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { XMLParser } from "fast-xml-parser";

const RssNew = () => {
  const [feed, setFeed] = useState({});

  useEffect(() => {
    getFeedData();
  }, [])

  const getFeedData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("rss-feeds");
      const jsonObject = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (typeof jsonObject === "object" && 'rss' in jsonObject) {
        if (Array.isArray(jsonObject.rss)) {
          jsonObject.rss.map((feed: any, index: number) => {
            const url = 'url' in feed ? feed.url : '';
            fetchFeed(url)?.then((data: any) => {
              feed[index] = data
              setFeed({...feed})
            })
          })
        }
      }
      return jsonObject;
    } catch (e) {
      // error reading value
    }
  };

  const fetchFeed = (rss: string) => {
    if (rss === "") {
      return;
    }
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


  if (typeof feed === "object" && Object.keys(feed).length > 0) {
    alert(JSON.stringify(feed));
  }

  return (
    <Text>RssNew</Text>
  )
}

export default RssNew