import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import TrackPlayer, {
  PlaybackState,
  RepeatMode,
  State,
  Track,
  usePlaybackState,
} from 'react-native-track-player';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {playListData} from '../constants';

export default function ControlCenter() {
  const [playbackModeIndex, setPlaybackModeIndex] = React.useState(0);
  const playbackModes = ['all', 'track', 'shuffle'];
  const {state}: PlaybackState | {state: undefined} = usePlaybackState();

  // next function
  const skipToNext = async () => {
    if (playbackModeIndex > 1) {
      const nextIndex = Math.floor(Math.random() * playListData.length);
      await TrackPlayer.skip(nextIndex);
      return;
    }

    await TrackPlayer.skipToNext();
  };

  // previous function
  const skipToPrevious = async () => {
    if (playbackModeIndex > 1) {
      const previousIndex = Math.floor(Math.random() * playListData.length);
      await TrackPlayer.skip(previousIndex);
      return;
    }

    await TrackPlayer.skipToPrevious();
  };

  const togglePlayBack = async (state: State | undefined) => {
    const currentTrack = await TrackPlayer.getActiveTrackIndex();

    if (currentTrack === null) return;

    state === State.Paused || state === State.Ready
      ? await TrackPlayer.play()
      : await TrackPlayer.pause();
  };

  const togglePlaybackMode = async () => {
    const nextIndex = (playbackModeIndex + 1) % playbackModes.length;
    console.log('nextIndex :>> ', nextIndex);
    setPlaybackModeIndex(nextIndex);

    const nextMode = playbackModes[nextIndex];

    if (nextMode === 'shuffle') {
      await TrackPlayer.setRepeatMode(RepeatMode.Queue);
    } else
      await TrackPlayer.setRepeatMode(
        nextMode === 'track' ? RepeatMode.Track : RepeatMode.Queue,
      );
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={togglePlaybackMode}>
        <MaterialIcons
          style={styles.icon}
          name={
            playbackModeIndex == 0
              ? 'repeat'
              : playbackModeIndex === 1
              ? 'repeat-one'
              : 'shuffle'
          }
          size={32}
        />
      </Pressable>

      <Pressable onPress={skipToPrevious}>
        <MaterialIcons style={styles.icon} name={'skip-previous'} size={32} />
      </Pressable>

      <Pressable onPress={() => togglePlayBack(state)}>
        <MaterialIcons
          style={styles.icon}
          name={state === State.Playing ? 'pause' : 'play-arrow'}
          size={75}
        />
      </Pressable>

      <Pressable onPress={skipToNext}>
        <MaterialIcons style={styles.icon} name={'skip-next'} size={32} />
      </Pressable>

      <Pressable onPress={() => {}}>
        <MaterialCommunityIcons
          style={styles.icon}
          name={'playlist-music-outline'}
          size={32}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    color: '#FFFFFF',
  },
  playButton: {
    marginHorizontal: 24,
  },
});
