import React from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import TrackPlayer, {
  Event,
  Track,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {playListData} from '../constants';
import SongInfo from '../components/SongInfo';
import SongSlider from '../components/SongSlider';
import ControlCenter from '../components/ControlCenter';

const {width} = Dimensions.get('window');
const ITEM_WIDTH = width - 64;

const events = [Event.PlaybackActiveTrackChanged];

export default function MusicPlayer() {
  const [track, setTrack] = React.useState<Track | null>();

  const currentIndex = React.useRef(0);
  const scrollX = React.useRef<any>(new Animated.Value(0)).current;
  const slidesRef = React.useRef<FlatList<Track> | null>(null);

  useTrackPlayerEvents(events, async event => {
    switch (event.type) {
      case Event.PlaybackActiveTrackChanged:
        // console.log('playingTrack :>> ', playingTrack);
        // console.log('event.index :>> ', event.index);
        const playingTrack = await TrackPlayer.getTrack(
          event.index ? event.index : 0,
        );

        slidesRef.current &&
          slidesRef.current.scrollToIndex({
            animated: true,
            index: event.index ? event.index : 0,
          });
        setTrack(playingTrack);
        break;
    }
  });

  const onMomentumScrollEnd = async (event: any) => {
    const {contentOffset, layoutMeasurement} = event.nativeEvent;
    const _currentIndex = Math.round(contentOffset.x / layoutMeasurement.width);

    // Assuming each item in the FlatList corresponds to a track
    await TrackPlayer.skip(_currentIndex);
  };

  const onScrollEndDrag = (event: any) => {
    const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;

    // Calculate the index of the last visible item based on the scroll position
    const lastIndex = Math.floor(contentOffset.x / layoutMeasurement.width);
    // const totalItems = playListData.length;
    const totalItems = Math.ceil(contentSize.width / layoutMeasurement.width);

    // If the last visible item is the last item in the list, scroll back to the first item
    if (lastIndex === totalItems - 1) {
      slidesRef.current &&
        slidesRef.current.scrollToIndex({animated: true, index: 0});
    }
  };

  const renderArtWork = (item: Track) => {
    return (
      <Animated.View style={styles.listArtWrapper}>
        <View style={styles.albumContainer}>
          <Image
            style={styles.albumArtImg}
            source={{uri: item?.artwork?.toString()}}
          />
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <Animated.FlatList
          horizontal
          pagingEnabled
          data={playListData}
          renderItem={({item, index}) => renderArtWork(item)}
          keyExtractor={song => song.id.toString()}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={200}
          onScrollEndDrag={onScrollEndDrag}
          ref={slidesRef}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
        />
      </View>

      <View style={{}}>
        <SongInfo track={track} />
        <SongSlider />
        <ControlCenter />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#001d23',
    paddingHorizontal: 32,
  },
  listArtWrapper: {
    width: ITEM_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'blue',
  },
  albumContainer: {
    width: ITEM_WIDTH * 0.8,
    height: ITEM_WIDTH * 0.8,
  },
  albumArtImg: {
    height: '100%',
    borderRadius: 4,
  },
});
