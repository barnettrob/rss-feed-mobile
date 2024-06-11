import { StyleSheet, View, Text } from "react-native";
import { useColorScheme } from '@/hooks/useColorScheme';
import Settings from "./Settings";

const Header = () => {
  const theme = useColorScheme();
    return (
        <View style={[
          theme === 'dark' ? styles.navbarDark : styles.navbarLight,
        ]}>
          <View style={styles.containerLeft}>
            <Text style={styles.title}>News</Text>
          </View>
          <View style={styles.containerRight}>
            <Settings />
          </View>
        </View>
      );
}

const styles = StyleSheet.create({
  navbarDark: {
    backgroundColor: "#000",
    padding: 10,
    flexDirection: "row",
  },
  navbarLight: {
    backgroundColor: "#47aa93",
    padding: 10,
    flexDirection: "row",
  },
  containerLeft: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  containerRight: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 5
  },
  navConfig: {},
});

export default Header;