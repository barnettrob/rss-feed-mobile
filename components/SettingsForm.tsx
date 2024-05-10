import React, { Component } from "react";
import { StyleSheet, View, Button, TextInput } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

class SettingsForm extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      rssFeeds: {},
      feedsStorage: {},
      feedCount: {},
    };
  }

  componentDidMount() {
    // load Feed urls to state.
    const feeds = this.getFeedData().then((result) => {
      if (result !== null) {
        this.setState({ feedsStorage: result });
      }
    });
    // load feed count to state.
    const feedCount = this.getFeedCount().then((result) => {
      if (result !== null) {
        this.setState({ feedCount: result });
      }
    });
  }

  is_url(str: string) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }

  saveFeedData = async (rssFeeds: any, feedCount: number) => {
    try {
      const jsonValue = JSON.stringify(rssFeeds);
      const count = JSON.stringify(feedCount);
      await AsyncStorage.setItem("rssFeeds", jsonValue);
      await AsyncStorage.setItem("feedCount", count);
      alert("Feeds Saved!")
    } catch (e) {
      alert("There was a problem saving your RSS Feeds");
    }
  };

  getFeedData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("rssFeeds");
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

  render() {
    this.state.rssFeeds = this.state.feedsStorage;
    let rssInputArray = [];
    for (let i = 0; i < 5; i++) {
      let key =
        typeof Object.keys(this.state.feedsStorage)[i] === "undefined"
          ? 'zero'
          : Object.keys(this.state.feedsStorage)[i];
      rssInputArray.push(
        <TextInput
          key={i}
          style={styles.input}
          placeholder="RSS Feed"
          ref={(input) => {
            this.i = input;
          }}
          defaultValue={key != 'zero' ? this.state.feedsStorage[key] : ''}
          onEndEditing={(e) => {
            // Validate url.  If not valid then clear input field.
            if (e.nativeEvent.text != '' && !this.is_url(e.nativeEvent.text)) {
              alert("Invalid url");
              this.i.clear();
            }
          }}
          onChangeText={(text) => {
            // Save the rss feed to state.
            if (this.is_url(text)) {
              this.state.rssFeeds[i] = text;
            }
          }}
        />
      );
    }

    return (
      <View>
        {rssInputArray}
        <TextInput 
          style={styles.input}
          placeholder="Feed count: value must be 10, 15, 20, 25 or 30"
          defaultValue={Object.keys(this.state.feedCount).length !== 0 ? this.state.feedCount : ''}
          ref={input => { this.textInput = input }}
          onEndEditing={(e) => {
            const countOptions = ['10', '15', '20', '25', '30'];
            // Validate url.  If not valid then clear input field.
            if (e.nativeEvent.text != '' && !countOptions.includes(e.nativeEvent.text)) {
              alert("Must be 10, 15, 20, 25 or 30");
              this.textInput.clear();
            }
            else {
              this.state.feedCount = e.nativeEvent.text;
            }
          }}
          onChangeText={(text) => {
            // Save count.
            const countOptions = ['10', '15', '20', '25', '30'];
            if (countOptions.includes(text)) {
              this.state.feedCount = text;
            }
          }}
        />
        {/* Take a look at https://react-hook-form.com/ */}
        <Button
          title="Save"
          color="#3E8ACD"
          onPress={() => {
            const rssFeeds = this.state.rssFeeds;
            const feedCount = this.state.feedCount;
            this.saveFeedData(rssFeeds, feedCount);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    width: 330,
    marginBottom: 5,
  }
});

export default SettingsForm;