import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, {
  PlaybackState,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';

export default function SongSlider() {
  const {position, duration} = useProgress();
  const {state}: PlaybackState | {state: undefined} = usePlaybackState();

  const seekPosition = async (state: State | undefined, position: number) => {
    const currentTrack = await TrackPlayer.getActiveTrackIndex();

    if (currentTrack === null) return;

    state === State.Paused || state === State.Ready || state === State.Playing
      ? await TrackPlayer.seekTo(position)
      : await TrackPlayer.seekTo(position);
  };

  return (
    <View style={{width: '100%'}}>
      <Slider
        value={position}
        minimumValue={0}
        maximumValue={duration}
        thumbTintColor="#FFF"
        maximumTrackTintColor="#FFF"
        style={styles.sliderContainer}
        tapToSeek
        onValueChange={(value: number) => {
          seekPosition(state, value);
        }}
      />
      <View style={styles.timeContainer}>
        <Text style={styles.time}>
          {new Date(position * 1000).toISOString().substring(15, 19)}
        </Text>
        <Text style={styles.time}>
          {new Date((duration - position) * 1000)
            .toISOString()
            .substring(15, 19)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    marginTop: 16,
    marginHorizontal: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    color: '#fff',
  },
});
