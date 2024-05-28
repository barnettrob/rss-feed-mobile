import { FormEvent, useEffect, useRef, useState } from "react";
import { 
  Pressable, 
  Text, 
  TextInput, 
  SafeAreaView, 
  StyleSheet, 
  View } from "react-native";
import { Formik, FieldArray } from 'formik';
import * as yup from "yup";
import { useColorScheme } from '@/hooks/useColorScheme';
import { useForm } from 'react-hook-form';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsFormNew = () => {
  const [inputNum, setInputNum] = useState([1]);
  const [submittedData, setSubmittedData] = useState([]);
  const [feedDataStorage, setFeedDataStorage] = useState({});
  const inputsLength = inputNum.length;
  const inputRef = useRef(new Array(inputsLength));
  const { control, register, handleSubmit, formState: { errors } } = useForm();
  const theme = useColorScheme();

  // create a validation schema using Yup
  const validationSchema = yup.object().shape({
    rss: yup.array().of(
      yup.object().shape({
        url: yup.string().url('Enter a valid url').required('Url is required for each Rss Feed'),
      })
    ),
  });

  const formikInitialValues = {
    rss: [
      {
        url: '',
      },
    ],
  };
  

  const handleFormSubmit = (values: any) => {
    // Handle form submission logic here
    alert(JSON.stringify(values));
  };


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

  //console.log("feedDataStorage", feedDataStorage)
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={[
          theme === 'dark' ? styles.titleDark : styles.titleLight,
        ]}>
          Enter RSS feeds for your news:
        </Text>
        <Formik
          initialValues={formikInitialValues}
          onSubmit={(values) => alert(JSON.stringify(values, null, 2))} 
          validationSchema={validationSchema}
          enableReinitialize>
          {({ values, handleSubmit, handleChange, errors }) => (
            <>
              <FieldArray name="rss">
                {({ insert, remove, push }) => (
                  <View>
                    {values.rss.length > 0 &&
                      values.rss.map((feed, index) => (
                        <View key={index} style={styles.inputWrapper}>
                          <TextInput
                            style={[
                              theme === 'dark' ? styles.inputDark : styles.inputLight,
                            ]}
                            name={`rss.${index}.url`}
                            placeholder="RSS Feed Url"
                            onChangeText={handleChange(
                              `rss.${index}.url`
                            )}
                          />
                          <Pressable onPress={() => remove(index)}>
                            <AntDesign name="delete" size={24} color={theme === 'dark' ? "white" : "black"} />
                          </Pressable>
                          {'rss' in errors && typeof errors.rss !== "undefined" && typeof errors.rss[index] !== "undefined" && feed.url !== "" && <Text style={styles.error}>{errors.rss[index].url}</Text>}
                        </View>
                      ))}
                    <Pressable style={[
                      theme === 'dark' ? styles.buttonDark : styles.buttonLight,
                      ]} onPress={() => push({ url: '' })}>
                      <Text style={[
                        theme === 'dark' ? styles.buttonTextDark : styles.buttonTextLight,
                        ]}>Add RSS Feed</Text>
                    </Pressable>  
                  </View>
                )}
              </FieldArray>
              <Pressable style={[
                  theme === 'dark' ? styles.buttonSaveDark : styles.buttonSaveLight,
                ]} onPress={handleSubmit}>
                <Text style={[
                    theme === 'dark' ? styles.buttonTextLight : styles.buttonTextDark,
                  ]}>Save Rss Feeds
                </Text>
              </Pressable>  

              <Text>{JSON.stringify(values, null, 2)}</Text>
            </>
          )}
        </Formik>     
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
  },
  error: {
    color: 'red',
    marginTop: 8,
  }
});

export default SettingsFormNew;