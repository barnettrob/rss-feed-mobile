import { useCallback, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import Header from "@/components/Header";
import Rss from "@/components/Rss";

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  
  return (
    <SafeAreaView>
      <Header />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Rss />
      </ScrollView>
    </SafeAreaView>
  );
}
