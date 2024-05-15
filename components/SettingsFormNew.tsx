import { useEffect, useRef, useState } from "react";
import { 
  Pressable, 
  Text, 
  TextInput, 
  SafeAreaView, 
  StyleSheet, 
  View } from "react-native";
import { useColorScheme } from '@/hooks/useColorScheme';
import { useForm, Controller } from 'react-hook-form';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsFormNew = () => {
  const [inputNum, setInputNum] = useState([1]);
  const [submittedData, setSubmittedData] = useState([]);
  const [feedDataStorage, setFeedDataStorage] = useState({});
  const inputsLength = inputNum.length;
  const inputRef = useRef(new Array(inputsLength));
  const { control, handleSubmit, formState: { errors } } = useForm();
  const theme = useColorScheme();

  const handleAddInput = () => {
    setInputNum(inputNum => [...inputNum, inputNum.length + 1]);
  }

  const handleDeleteInput = (i: number) => {
    console.log("i", i)
    setInputNum(origInput => {
      return origInput.filter(input => input !== i);
    })
  } 

  const onSubmit = async (data: any) => {
    // Simulate form submission
    await saveFeedData(data);
  };

  const saveFeedData = async (rssFeeds: any) => {
    try {
      const jsonValue = JSON.stringify(rssFeeds);
      await AsyncStorage.setItem("rssFeeds", jsonValue);
      setFeedDataStorage(rssFeeds);
      alert("Feeds Saved!")
    } catch (e) {
      alert("There was a problem saving your RSS Feeds");
    }
  };

  const getFeedData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("rssFeeds");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    (async () => {
      // Set Feed urls to state.
      await getFeedData().then((result) => {
        if (result !== null) {
          setFeedDataStorage(result);
        }
      });
    })
  }, []);

  let form: any = <></>
  if (Object.keys(feedDataStorage).length > 0) {
    form = Object.keys(feedDataStorage).map((feed: any, i: number) =>(
      <View key={i+1} style={styles.inputWrapper}>
        <Controller
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              style={[
                theme === 'dark' ? styles.inputDark : styles.inputLight,
              ]}
              placeholder="Rss Feed Url"
              ref={(element) => inputRef.current[i+1] = element}
              defaultValue={feed[`feed_url_${i+1}`]}
              value={feed[`feed_url_${i+1}`]}
            />
          )}
          name={`feed_url_${i+1}`}
          rules={{ required: 'You must enter a valid url' }}
        />
        <Pressable onPress={() => handleDeleteInput(i+1)} data-inputnum={i+1}>
          <AntDesign name="delete" size={24} color={theme === 'dark' ? "white" : "black"} />
        </Pressable>
        {errors.name && <Text style={styles.errorText}>{"errors.name.message"}</Text>}        
      </View>
    ))
  }
  else {
    form = inputNum.map((_, i: number) => (
      <View key={i+1} style={styles.inputWrapper}>
        <Controller
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              style={[
                theme === 'dark' ? styles.inputDark : styles.inputLight,
              ]}
              placeholder="Rss Feed Url"
              ref={(element) => inputRef.current[i+1] = element}
              defaultValue={submittedData[i+1]}
              value={submittedData[i+1]}
            />
          )}
          name={`feed_url_${i+1}`}
          rules={{ required: 'You must enter a valid url' }}
        />
        <Pressable onPress={() => handleDeleteInput(i+1)} data-inputnum={i+1}>
          <AntDesign name="delete" size={24} color={theme === 'dark' ? "white" : "black"} />
        </Pressable>
        {errors.name && <Text style={styles.errorText}>{"errors.name.message"}</Text>}
      </View>
    ))
  }
  console.log("feedDataStorage", feedDataStorage)
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={[
          theme === 'dark' ? styles.titleDark : styles.titleLight,
        ]}>
          Enter RSS feeds for your news:
        </Text>
        {form}
        <Pressable style={[
          theme === 'dark' ? styles.buttonDark : styles.buttonLight,
          ]} onPress={handleAddInput}>
          <Text style={[
          theme === 'dark' ? styles.buttonTextDark : styles.buttonTextLight,
        ]}>Add RSS</Text>
        </Pressable>
        <Pressable style={[
          theme === 'dark' ? styles.buttonSaveDark : styles.buttonSaveLight
          ]} 
          onPress={handleSubmit(onSubmit)}>
            <Text style={[
              theme === 'dark' ? styles.buttonSaveTextDark : styles.buttonSaveTextLight,
              ]}>Save Urls</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
  settingsWrapper: {
    padding: 20,
    color:  '#fff',
  },
  container: {
    padding: 16,
  },
  titleDark: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#FFF",
  },
  titleLight: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#000",
  },
  inputWrapper: {
    flex: 1,
    flexDirection:'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
  },
  inputDark: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    color: "#FFF",
    width: '90%',
  },
  inputLight: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    color: "#000",
    width: '90%',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  buttonLight: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    borderColor: '#000',
    borderWidth: 1,
    elevation: 3,
    backgroundColor: 'transparent',
  },
  buttonDark: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    borderColor: '#FFF',
    borderWidth: 1,
    elevation: 3,
    backgroundColor: '#000',
  },
  buttonTextDark: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#FFF',
  },
  buttonTextLight: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#000',
  },
  buttonSaveDark: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    elevation: 3,
    backgroundColor: '#FFF',
  },
  buttonSaveTextDark: {
    color: '#000',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
  buttonSaveLight: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    elevation: 3,
    backgroundColor: '#000',
  },
  buttonSaveTextLight: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  }
});

export default SettingsFormNew;