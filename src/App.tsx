import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {addTrack, setupPlayer} from '../musicPlayerService';
import MusicPlayer from './screens/MusicPlayer';

function App(): JSX.Element {
  const [isPlayerRready, setIsPlayerReady] = React.useState<boolean>(false);

  React.useEffect(() => {
    setup();
  }, []);

  const setup = async () => {
    let isSetup = await setupPlayer();

    if (isSetup) await addTrack();

    setIsPlayerReady(isSetup);
  };

  if (!isPlayerRready) {
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <MusicPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
