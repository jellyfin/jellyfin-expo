/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Audio } from 'expo-av';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';

import MediaTypes from '../constants/MediaTypes';
import { useStores } from '../hooks/useStores';
import { msToTicks } from '../utils/Time';

const AudioPlayer = observer(() => {
	const { rootStore } = useStores();

	const [ player, setPlayer ] = useState();

	// Set the audio mode when the audio player is created
	useEffect(() => {
		Audio.setAudioModeAsync({
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
			playsInSilentModeIOS: true
		});

		return () => {
			player?.unloadAsync();
		};
	}, []);

	// Update the player when media type or uri changes
	useEffect(() => {
		const createPlayer = async ({ uri, positionMillis }) => {
			const { sound } = Audio.Sound.createAsync({
				uri
			}, {
				positionMillis,
				shouldPlay: true
			}, ({ isPlaying, positionMillis }) => {
				rootStore.mediaStore.isPlaying = isPlaying;
				rootStore.mediaStore.positionTicks = msToTicks(positionMillis);
			});
			setPlayer(sound);
		};

		if (rootStore.mediaStore.type === MediaTypes.Audio) {
			createPlayer({
				uri: rootStore.mediaStore.uri,
				positionMillis: rootStore.mediaStore.positionMillis
			});
		}
	}, [ rootStore.mediaStore.type, rootStore.mediaStore.uri ]);

	// Update the play/pause state when the store indicates it should
	useEffect(() => {
		if (rootStore.mediaStore.type === MediaTypes.Audio && rootStore.mediaStore.shouldPlayPause) {
			if (rootStore.mediaStore.isPlaying) {
				player?.pauseAsync();
			} else {
				player?.playAsync();
			}
			rootStore.mediaStore.shouldPlayPause = false;
		}
	}, [ rootStore.mediaStore.shouldPlayPause ]);

	// Stop the player when the store indicates it should stop playback
	useEffect(() => {
		if (rootStore.mediaStore.type === MediaTypes.Audio && rootStore.mediaStore.shouldStop) {
			player?.stopAsync();
			player?.unloadAsync();
			rootStore.mediaStore.shouldStop = false;
		}
	}, [ rootStore.mediaStore.shouldStop ]);

	return <></>;
});

export default AudioPlayer;
