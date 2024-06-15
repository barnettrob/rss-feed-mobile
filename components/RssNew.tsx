import React, {useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { XMLParser } from "fast-xml-parser";
import { decode } from 'html-entities';

const RssNew = () => {
  const [feed, setFeed] = useState({});
  const [combinedFeed, setCombinedFeed] = useState([]);

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
              // alert(JSON.stringify(data))
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

  const todayDayShort = (date: Date) => {
    const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return shortDays[date.getDay()];
  }

  const todayMonthShort = (date: Date) => {
    const shortMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return shortMonths[date.getMonth()];
  }

  const formatDate = (date: string) => {
    const d = new Date(date);
    const hh = d.getHours();
    let m: any = d.getMinutes();
    let s: any = d.getSeconds();
    let dd = "AM";
    let h = hh;
    if (h >= 12) {
      h = hh - 12;
      dd = "PM";
    }
    if (h == 0) {
      h = 12;
    }
    m = m < 10 ? "0" + m : m;

    s = s < 10 ? "0" + s : s;

    /* if you want 2 digit hours:
    h = h<10?"0"+h:h; */

    const pattern = new RegExp("0?" + hh + ":" + m + ":" + s);

    let replacement = h + ":" + m;
    /* if you want to add seconds
    replacement += ":"+s;  */
    replacement += " " + dd;

    return date.replace(pattern, replacement);
  }

  const pubDateSort = (a: any, b: any) => {
    // Use toUpperCase() to ignore character casing
    const pubDateA = a.pubDate.toUpperCase();
    const pubDateB = b.pubDate.toUpperCase();
  
    let comparison = 0;
    if (pubDateA > pubDateB) {
      comparison = 1;
    } else if (pubDateA < pubDateB) {
      comparison = -1;
    }
    //invert return value by multiplying by -1
    return comparison * -1;
  }

  let feedsCombined: any[] = [];
  
  if (typeof feed === "object" && Object.keys(feed).length > 0) {
    let i = 0;
    for (const rss in feed) {
      const iString = i.toString();
      feedsCombined.push(...feed[rss]);
      i++;
    }
  }

  // Check if feeds array is empty and show message if it is.
  if (feedsCombined === undefined || feedsCombined.length === 0) {
    return (
      <Text style={styles.empty}>Add rss feeds to Config or scroll up to refresh list.</Text>
    )
  }

  let today = new Date();
  // Get 01 - 09 for dates between those dates instead of 1 - 9.
  // This will match 2 digit format we get back from rss feeds.
  const day = ('0' + today.getDate()).slice(-2);
  const year = today.getFullYear();
  const todayFormatted = `${todayDayShort(
    today
  )}, ${day} ${todayMonthShort(today)} ${year}`;
   
  let newsItems: any = [];
  if (feedsCombined.length > 0) {
    feedsCombined
    .map((el, index) => {
      if (typeof el === "object") {
        const pubDateArray = 'pubDate' in el && typeof el.pubDate !== "undefined" ? el.pubDate.split(" ") : [];

        if (
          `${pubDateArray[0]} ${pubDateArray[1]} ${pubDateArray[2]} ${pubDateArray[3]}` ===
          todayFormatted
        ) {
          const date = new Date(el.pubDate);
          const localDate = formatDate(date.toString());
  
          newsItems.push({
            pubDate: localDate.replace(" GMT-0400", ""),
            link: el.link,
            title: el.title,
          });
        }
      }
    })
  }

  //setCombinedFeed(prevStateArray => [...prevStateArray, newsItems]);

  return newsItems
  .sort((a: any, b: any) => a.pubDate > b.pubDate ? 1 : -1)
  .map(function (item: any, i: number) {
    let url = item.link;
    url = url.replace("https://", "");
    url = url.replace("http://", "");
    url = url.split("/");
    const domain = url[0];

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          Linking.openURL(item.link);
        }}
        key={i}
      >
        <View key={i} style={styles.cardDark}>
          <Text style={styles.eyebrow}>{domain}</Text>
          <Text style={styles.title}>{decode(item.title)}</Text>
          <Text style={styles.date}>{item.pubDate}</Text>
        </View>
      </TouchableOpacity>
    );
  });
}

const styles = StyleSheet.create({
  cardDark: {
    borderRadius: 5,
    borderColor: "#4d4d4c",
    borderWidth: 1,
    backgroundColor: "#000",
    margin: 15,
    padding: 20,
  },
  cardLight: {
    borderRadius: 5,
    borderColor: "#94999e",
    borderWidth: 1,
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
  },
  eyebrow: {
    marginBottom: 2,
    fontSize: 15,
    borderRadius: 3,
    padding: 3,
    color: '#fff',//useColorScheme() === 'dark' ? '#fff' : '#000',
  },
  title: {
    fontSize: 18,
    color: '#fff',//useColorScheme() === 'dark' ? '#fff' : '#000',
  },
  date: {
    color: "#7f7f7f",
    marginTop: 5,
  },
  empty: {
    marginTop: 20,
    marginLeft: 5,
    textAlign: "center",
    fontSize: 16
  }
});

export default RssNew