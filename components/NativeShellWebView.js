/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import compareVersions from 'compare-versions';
import Constants from 'expo-constants';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import React, { useState } from 'react';
import { BackHandler, Platform } from 'react-native';

import MediaTypes from '../constants/MediaTypes';
import { useStores } from '../hooks/useStores';
import DownloadModel from '../models/DownloadModel';
import { getAppName, getDeviceProfile, getSafeDeviceName } from '../utils/Device';
import StaticScriptLoader from '../utils/StaticScriptLoader';
import { openBrowser } from '../utils/WebBrowser';

import RefreshWebView from './RefreshWebView';

const NativeShellWebView = (props) => {
	const { rootStore, downloadStore, serverStore, mediaStore, settingStore } = useStores();
	const [ isRefreshing, setIsRefreshing ] = useState(false);

	const server = serverStore.servers[settingStore.activeServer];
	const isPluginSupported = !!server.info?.Version && compareVersions.compare(server.info.Version, '10.7', '>=');

	const injectedJavaScript = `
window.ExpoAppInfo = {
	appName: '${getAppName()}',
	appVersion: '${Constants.nativeAppVersion}',
	deviceId: '${rootStore.deviceId}',
	deviceName: '${getSafeDeviceName().replace(/'/g, '\\\'')}'
};

window.ExpoAppSettings = {
	isPluginSupported: ${isPluginSupported},
	isNativeVideoPlayerEnabled: ${settingStore.isNativeVideoPlayerEnabled},
	isExperimentalNativeAudioPlayerEnabled: ${settingStore.isExperimentalNativeAudioPlayerEnabled},
	isExperimentalDownloadsEnabled: ${settingStore.isExperimentalDownloadsEnabled}
};

window.ExpoVideoProfile = ${JSON.stringify(getDeviceProfile({ enableFmp4: settingStore.isFmp4Enabled }))};

function postExpoEvent(event, data) {
	window.ReactNativeWebView.postMessage(JSON.stringify({
		event: event,
		data: data
	}));
}

${StaticScriptLoader.scripts.NativeAudioPlayer}
${StaticScriptLoader.scripts.NativeVideoPlayer}

${StaticScriptLoader.scripts.NativeShell}

${StaticScriptLoader.scripts.ExpoRouterShim}

window.onerror = console.error;

true;
`;

	const onRefresh = () => {
		// Disable pull to refresh when in fullscreen
		if (rootStore.isFullscreen) return;

		// Stop media playback in native players
		mediaStore.shouldStop = true;

		setIsRefreshing(true);
		ref.current?.reload();
		setIsRefreshing(false);
	};

	const onMessage = ({ nativeEvent: state }) => {
		try {
			const { event, data } = JSON.parse(state.data);
			switch (event) {
				case 'AppHost.exit':
					BackHandler.exitApp();
					break;
				case 'enableFullscreen':
					rootStore.set({isFullscreen: true});
					break;
				case 'disableFullscreen':
					rootStore.set({isFullscreen: false});
					break;
				case 'downloadFile':
					console.log('Download item', data);
					/* eslint-disable no-case-declarations */
					const url = new URL(data.item.url);
					const apiKey = url.searchParams.get('api_key');
					/* eslint-enable no-case-declarations */
					downloadStore.add(new DownloadModel(
						data.item.itemId,
						data.item.serverId,
						server.urlString,
						apiKey,
						data.item.title,
						data.item.filename,
						data.item.url
					));
					break;
				case 'openUrl':
					console.log('Opening browser for external url', data.url);
					openBrowser(data.url);
					break;
				case 'updateMediaSession':
					// Keep the screen awake when music is playing
					if (settingStore.isScreenLockEnabled) {
						activateKeepAwake();
					}
					break;
				case 'hideMediaSession':
					// When music session stops disable keep awake
					if (settingStore.isScreenLockEnabled) {
						deactivateKeepAwake();
					}
					break;
				case 'ExpoAudioPlayer.play':
				case 'ExpoVideoPlayer.play':
					mediaStore.type = event === 'ExpoAudioPlayer.play' ? MediaTypes.Audio : MediaTypes.Video;
					mediaStore.uri = data.url;
					mediaStore.backdropUri = data.backdropUrl;
					mediaStore.isFinished = false;
					mediaStore.positionTicks = data.playerStartPositionTicks;
					break;
				case 'ExpoAudioPlayer.playPause':
				case 'ExpoVideoPlayer.playPause':
					mediaStore.shouldPlayPause = true;
					break;
				case 'ExpoAudioPlayer.stop':
				case 'ExpoVideoPlayer.stop':
					mediaStore.shouldStop = true;
					break;
				case 'console.debug':
					// console.debug('[Browser Console]', data);
					break;
				case 'console.error':
					console.error('[Browser Console]', data);
					break;
				case 'console.info':
					// console.info('[Browser Console]', data);
					break;
				case 'console.log':
					// console.log('[Browser Console]', data);
					break;
				case 'console.warn':
					console.warn('[Browser Console]', data);
					break;
				default:
					console.debug('[HomeScreen.onMessage]', event, data);
			}
		} catch (ex) {
			console.warn('Exception handling message', state.data);
		}
	};

	return (
		<RefreshWebView
			// ref={ref}
			// Allow any origin blocking can break various things like book playback
			originWhitelist={[ '*' ]}
			source={{ uri: server.urlString }}
			// Inject javascript for NativeShell
			// This method is preferred, but only supported on iOS currently
			injectedJavaScriptBeforeContentLoaded={Platform.OS === 'ios' ? injectedJavaScript : null}
			// Fallback for non-iOS
			injectedJavaScript={Platform.OS !== 'ios' ? injectedJavaScript : null}
			onMessage={onMessage}
			isRefreshing={isRefreshing}
			onRefresh={onRefresh}
			// Pass through additional props
			{...props}
			// Make scrolling feel faster
			decelerationRate='normal'
			// Media playback options to fix video player
			allowsInlineMediaPlayback={true}
			mediaPlaybackRequiresUserAction={false}
			// Use WKWebView on iOS
			useWebKit={true}
			showsVerticalScrollIndicator={false}
			showsHorizontalScrollIndicator={false}
		/>
	);
}

export default React.forwardRef(NativeShellWebView);
