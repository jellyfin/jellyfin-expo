/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { Audio, Video } from 'expo-av';
import { observer } from 'mobx-react';

import { useStores } from '../hooks/useStores';

const VideoPlayer = observer(() => {
	const { rootStore } = useStores();

	const player = useRef(null);

	useEffect(() => {
		Audio.setAudioModeAsync({
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
			playsInSilentModeIOS: true
		});
	}, []);

	return (
		<Video
			ref={player}
			source={{ uri: rootStore.mediaStore.uri }}
			positionMillis={rootStore.mediaStore.positionMillis}
			volume={1.0}
			usePoster
			posterSource={{ uri: rootStore.mediaStore.posterUri }}
			resizeMode='contain'
			useNativeControls
			shouldPlay
			onReadyForDisplay={() => {
				player.current?.presentFullscreenPlayer()
					.catch(console.debug);
			}}
			onFullscreenUpdate={({ fullscreenUpdate }) => {
				if (fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS) {
					rootStore.mediaStore.reset();
					player.current?.unloadAsync()
						.catch(console.debug);
				}
			}}
			onError={e => {
				console.error(e);
				Alert.alert(e);
			}}
		/>
	);
});

export default VideoPlayer;
