import { StyleSheet, View, Text, Pressable } from "react-native";
import Settings from "./Settings";
import { Link } from 'expo-router';
import GearIcon from "./GearIcon";

const Header = () => {
    return (
        <View style={styles.navbar}>
          <View style={styles.containerLeft}>
            <Text style={styles.title}>News</Text>
          </View>
          <View style={styles.containerRight}>
          <Link href="/settings" asChild>
            <Pressable>
                <GearIcon />
            </Pressable>
            </Link>
            <Settings />
          </View>
        </View>
      );
}

const styles = StyleSheet.create({
  navbar: {
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