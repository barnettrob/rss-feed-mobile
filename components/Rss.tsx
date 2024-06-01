import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Linking,
  View,
  Text,
} from "react-native";
import { XMLParser } from "fast-xml-parser";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'html-entities';
//import { useColorScheme } from '@/hooks/useColorScheme';

class Rss extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      news1: [],
      news2: [],
      news3: [],
      news4: [],
      news5: [],
      savedFeeds: {},
      feedCount: {},
    };
  }

  componentDidMount() {
    const feeds = this.getFeedData().then((result) => {
      if (result !== null) {
        this.setState({ savedFeeds: result });
        const rssFeeds = this.state.savedFeeds;
        for (let feed in rssFeeds) {
          this.fetchFeed(rssFeeds[feed]).then((data) => {
            if (rssFeeds[Object.keys(rssFeeds)[0]] == rssFeeds[feed]) {
              this.setState({
                news1: data,
              });
            } else if (rssFeeds[Object.keys(rssFeeds)[1]] == rssFeeds[feed]) {
              this.setState({
                news2: data,
              });
            } else if (rssFeeds[Object.keys(rssFeeds)[2]] == rssFeeds[feed]) {
              this.setState({
                news3: data,
              });
            } else if (rssFeeds[Object.keys(rssFeeds)[3]] == rssFeeds[feed]) {
              this.setState({
                news4: data,
              });
            } else if (rssFeeds[Object.keys(rssFeeds)[4]] == rssFeeds[feed]) {
              this.setState({
                news5: data,
              });
            }
          });
        }
      }
    });

    // feed count.
    const feedCount = this.getFeedCount().then((result) => {
      if (result !== null && Object.keys(result).length !== 0) {
        this.setState({ feedCount: result });
      }
    });
  }

  getFeedData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("rss-feeds");
      alert(jsonValue)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  getFeedCount = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("feedCount");

      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  todayDayShort(date: any) {
    Date.shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return Date.shortDays[date.getDay()];
  }

  todayMonthShort(date) {
    Date.shortMonths = [
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

    return Date.shortMonths[date.getMonth()];
  }

  fetchFeed(rss: any) {
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

  formatDate(date: any) {
    var d = new Date(date);
    var hh = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var dd = "AM";
    var h = hh;
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

    var pattern = new RegExp("0?" + hh + ":" + m + ":" + s);

    var replacement = h + ":" + m;
    /* if you want to add seconds
    replacement += ":"+s;  */
    replacement += " " + dd;

    return date.replace(pattern, replacement);
  }

  pubDateSort(a: any, b: any) {
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

  render() {
    const countOptions = [10, 15, 20, 25, 30];
    let count = 10;
    if (Object.keys(this.state.feedCount).length !== 0) {
      count = Number(this.state.feedCount);
      // make sure it's one of the available values from above, otherwise set back to 10.
      if (!countOptions.includes(count)) {
        count = 10;
      }
    }

    // Limit each feed to value stored in feedCount state.
    const feed1 = this.state.news1.slice(0, count);
    const feed2 = this.state.news2.slice(0, count);
    const feed3 = this.state.news3.slice(0, count);
    const feed4 = this.state.news4.slice(0, count);
    const feed5 = this.state.news5.slice(0, count);

    // Combine the feeds into one array.
    let feedsCombined = [];
    feedsCombined.push(...feed1, ...feed2, ...feed3, ...feed4, ...feed5);

    // Sort by pubDate.
    feedsCombined = feedsCombined.sort(this.pubDateSort);
    
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
    const todayFormatted = `${this.todayDayShort(
      today
    )}, ${day} ${this.todayMonthShort(today)} ${year}`;

    let newsItems: any = [];
    feedsCombined.forEach((el, key) => {
      const pubDateArray = el.pubDate !== "undefined" ? el.pubDate.split(" ") : [];

      if (
        `${pubDateArray[0]} ${pubDateArray[1]} ${pubDateArray[2]} ${pubDateArray[3]}` ===
        todayFormatted
      ) {
        const date = new Date(el.pubDate);
        const localDate = this.formatDate(date.toString());

        newsItems.push({
          pubDate: localDate.replace(" GMT-0400 (EDT)", ""),
          link: el.link,
          title: el.title,
        });
      }
    });

    return newsItems.map(function (item: any, i: number) {
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

export default Rss;
