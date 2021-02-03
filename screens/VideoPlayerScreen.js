/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useEffect, useRef } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Audio, Video } from 'expo-av';
import { observer } from 'mobx-react';

import { useStores } from '../hooks/useStores';
import Colors from '../constants/Colors';
import { getIconName } from '../utils/Icons';

const VideoPlayerScreen = observer(() => {
	const { rootStore } = useStores();
	const navigation = useNavigation();

	const player = useRef(null);

	console.debug('PLAY ELEMENT VIDEO =>', rootStore.mediaStore.type, rootStore.mediaStore.uri, rootStore.mediaStore.posterUri);

	useEffect(() => {
		Audio.setAudioModeAsync({
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
			playsInSilentModeIOS: true
		});
	}, []);

	return (
		<SafeAreaView
			style={{
				...styles.container,
				backgroundColor: Colors.black
			}}
		>
			<Button
				containerStyle={{
					flexDirection: 'column'
				}}
				buttonStyle={{
					alignSelf: 'flex-start',
					color: Colors.white
				}}
				type='clear'
				icon={{
					name: getIconName('close'),
					type: 'ionicon',
					size: 26
				}}
				onPress={() => {
					player.current?.unloadAsync();
					rootStore.mediaStore.isActive = false;
					navigation.goBack();
				}}
			/>
			<Video
				ref={player}
				style={styles.container}
				source={{ uri: rootStore.mediaStore.uri }}
				positionMillis={rootStore.mediaStore.positionMillis}
				usePoster
				posterSource={{ uri: rootStore.mediaStore.posterUri }}
				resizeMode='contain'
				useNativeControls
				shouldPlay
				onError={e => Alert.alert(e)}
			/>
		</SafeAreaView>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default VideoPlayerScreen;
