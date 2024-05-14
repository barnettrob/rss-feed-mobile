import { useRef, useState } from "react";
import { 
  Button,
  Pressable, 
  Text, 
  TextInput, 
  SafeAreaView, 
  StyleSheet, 
  View } from "react-native";
import { useColorScheme } from '@/hooks/useColorScheme';
import { useForm, Controller } from 'react-hook-form';
import AntDesign from '@expo/vector-icons/AntDesign';

const SettingsFormNew = () => {
  const [inputNum, setInputNum] = useState([1]);
  const [submittedData, setSubmittedData] = useState([]);
  const inputsLength = inputNum.length;
  const inputRef = useRef(new Array(inputsLength));
  const { control, handleSubmit, formState: { errors } } = useForm();
  const theme = useColorScheme();

  const handleAddInput = () => {
    setInputNum(inputNum => [...inputNum, inputNum.length + 1]);
  }

  const handleDeleteInput = (i: number) => {
    setInputNum(origInput => {
      return origInput.filter(input => input !== i);
    })
  } 

  const onSubmit = (data: any) => {
    // Simulate form submission
    console.log('Submitted Data:', data);
    setSubmittedData(data);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={[
          theme === 'dark' ? styles.titleDark : styles.titleLight,
        ]}>
          Enter RSS feeds for your news:
        </Text>
        {inputNum.map((_, i: number) => (
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
                  defaultValue=""
                  value={submittedData[i]}
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
        ))}
        <Pressable style={[
          theme === 'dark' ? styles.buttonDark : styles.buttonLight,
        ]} onPress={handleAddInput}>
          <Text style={[
          theme === 'dark' ? styles.buttonTextDark : styles.buttonTextLight,
        ]}>Add RSS</Text>
        </Pressable>
        <Button
          title='Save Urls'
          onPress={handleSubmit(onSubmit)}
        />
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
});

export default SettingsFormNew;