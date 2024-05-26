import { FormEvent, useEffect, useRef, useState } from "react";
import { 
  Button,
  Pressable, 
  Text, 
  TextInput, 
  SafeAreaView, 
  StyleSheet, 
  View } from "react-native";
import { Formik, Field, FieldArray, Form, ErrorMessage } from 'formik';
import * as yup from "yup";
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
  const { control, register, handleSubmit, formState: { errors } } = useForm();
  const theme = useColorScheme();

  // create a validation schema using Yup
  const validationSchema = yup.object().shape({
    rss: yup.string().url('Enter a valid url').required('Url is required'),
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
          onSubmit={async (values) => {
            await new Promise((r) => setTimeout(r, 500));
            alert(JSON.stringify(values, null, 2));
          }}
          validationSchema={validationSchema}
          //onSubmit={handleFormSubmit}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <View>         
              {inputNum.map((_, i: number) => (
                <View key={i} style={styles.inputWrapper}>
                  <TextInput
                    style={[
                      theme === 'dark' ? styles.inputDark : styles.inputLight,
                    ]}
                    placeholder="RSS Feed URL"
                    onChangeText={handleChange('rss')}
                    value={values.rss}
                  />
                  {errors.rss && <Text style={styles.error}>{errors.rss}</Text>}
                  <Pressable onPress={() => handleDeleteInput(i+1)} data-inputnum={i+1}>
                    <AntDesign name="delete" size={24} color={theme === 'dark' ? "white" : "black"} />
                  </Pressable>
                </View>
              ))}

              <Button title="Submit" onPress={e => handleSubmit(e as unknown as FormEvent<HTMLFormElement>)} />
            </View>
          )}
        </Formik>

        <Pressable style={[
          theme === 'dark' ? styles.buttonDark : styles.buttonLight,
          ]} onPress={handleAddInput}>
          <Text style={[
          theme === 'dark' ? styles.buttonTextDark : styles.buttonTextLight,
        ]}>Add RSS</Text>
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
  },
  error: {
    color: 'red',
    marginTop: 8,
  }
});

export default SettingsFormNew;