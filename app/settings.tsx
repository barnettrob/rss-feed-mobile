import { StyleSheet, SafeAreaView, ScrollView } from "react-native";
import SettingsFormNew from "@/components/SettingsFormNew";

const settings = () => {
  return (
    <SafeAreaView>
      <ScrollView style={styles.wrapper}>
      <SettingsFormNew />
    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 30,
  }
});

export default settings;