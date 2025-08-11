import { Image } from 'expo-image'
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View>
      <Image source={require("@/assets/images/react-logo.png")} style={{ width: 100, height: 100 }} />
      <Text>Hello everyone how are you all</Text>
    </View>
  );
}

