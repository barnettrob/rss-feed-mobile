import { useState } from "react";
import { Text, TextInput, SafeAreaView, StyleSheet, View } from "react-native";
import { useColorScheme } from '@/hooks/useColorScheme';
import { useForm, Controller } from 'react-hook-form';

const SettingsFormNew = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [submittedData, setSubmittedData] = useState(null);
  const onSubmit = (data: any) => {
    // Simulate form submission
    console.log('Submitted Data:', data);
    setSubmittedData(data);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
      <Controller
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              style={styles.input}
              placeholder="Rss Feed Url"
            />
          )}
          name="feed_url"
          rules={{ required: 'You must enter your name' }}
        />
        {errors.name && <Text style={styles.errorText}>{"errors.name.message"}</Text>}

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  settingsWrapper: {
    padding: 20,
    color:  useColorScheme() === 'dark' ? '#fff' : '#000',
  },
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default SettingsFormNew;