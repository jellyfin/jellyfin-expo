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
import MediaTypes from '../constants/MediaTypes';

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

	useEffect(() => {
		if (rootStore.mediaStore.type === MediaTypes.Video) {
			player.current?.loadAsync({
				uri: rootStore.mediaStore.uri
			}, {
				positionMillis: rootStore.mediaStore.positionMillis,
				shouldPlay: true
			});
		}
	}, [ rootStore.mediaStore.type, rootStore.mediaStore.uri ]);

	return (
		<Video
			ref={player}
			usePoster
			posterSource={{ uri: rootStore.mediaStore.posterUri }}
			resizeMode='contain'
			useNativeControls
			onReadyForDisplay={() => {
				player.current?.presentFullscreenPlayer()
					.catch(console.debug);
			}}
			onFullscreenUpdate={({ fullscreenUpdate }) => {
				switch (fullscreenUpdate) {
					case Video.FULLSCREEN_UPDATE_PLAYER_WILL_PRESENT:
						rootStore.isFullscreen = true;
						break;
					case Video.FULLSCREEN_UPDATE_PLAYER_DID_DISMISS:
						rootStore.isFullscreen = false;
						rootStore.mediaStore.reset();
						player.current?.unloadAsync()
							.catch(console.debug);
						break;
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
