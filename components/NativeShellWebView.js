/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import compareVersions from 'compare-versions';
import Constants from 'expo-constants';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { BackHandler, Platform } from 'react-native';

import MediaTypes from '../constants/MediaTypes';
import { useStores } from '../hooks/useStores';
import { getAppName, getDeviceProfile, getSafeDeviceName } from '../utils/Device';
import StaticScriptLoader from '../utils/StaticScriptLoader';
import { openBrowser } from '../utils/WebBrowser';

import RefreshWebView from './RefreshWebView';

const NativeShellWebView = observer(
	function NativeShellWebView(props, ref) {
		const { rootStore } = useStores();
		const [ isRefreshing, setIsRefreshing ] = useState(false);

		const server = rootStore.serverStore.servers[rootStore.settingStore.activeServer];
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
	isNativeVideoPlayerEnabled: ${rootStore.settingStore.isNativeVideoPlayerEnabled},
	isExperimentalDownloadsEnabled: ${rootStore.settingStore.isExperimentalDownloadsEnabled}
};

window.ExpoVideoProfile = ${JSON.stringify(getDeviceProfile({ enableFmp4: rootStore.settingStore.isFmp4Enabled }))};

function postExpoEvent(event, data) {
	window.ReactNativeWebView.postMessage(JSON.stringify({
		event: event,
		data: data
	}));
}

${StaticScriptLoader.scripts.NativeVideoPlayer}

${StaticScriptLoader.scripts.NativeShell}

${StaticScriptLoader.scripts.ExpoRouterShim}

window.onerror = console.error;

true;
`;

		const onRefresh = () => {
			// Disable pull to refresh when in fullscreen
			if (rootStore.isFullscreen) return;
			setIsRefreshing(true);
			ref.current?.reload();
			setIsRefreshing(false);
		};

		const onMessage = action(({ nativeEvent: state }) => {
			try {
				const { event, data } = JSON.parse(state.data);
				switch (event) {
					case 'AppHost.exit':
						BackHandler.exitApp();
						break;
					case 'enableFullscreen':
						rootStore.isFullscreen = true;
						break;
					case 'disableFullscreen':
						rootStore.isFullscreen = false;
						break;
					case 'downloadFile':
						console.log('Download item', data);
						const url = new URL(data.item.url); // eslint-disable-line no-case-declarations
						// console.log('url', url.searchParams.get('api_key'));
						rootStore.downloadStore.add({
							...data.item,
							apiKey: url.searchParams.get('api_key')
						});
						break;
					case 'openUrl':
						console.log('Opening browser for external url', data.url);
						openBrowser(data.url);
						break;
					case 'updateMediaSession':
						// Keep the screen awake when music is playing
						if (rootStore.settingStore.isScreenLockEnabled) {
							activateKeepAwake();
						}
						break;
					case 'hideMediaSession':
						// When music session stops disable keep awake
						if (rootStore.settingStore.isScreenLockEnabled) {
							deactivateKeepAwake();
						}
						break;
					case 'ExpoVideoPlayer.play':
						rootStore.mediaStore.type = MediaTypes.Video;
						rootStore.mediaStore.uri = data.url;
						rootStore.mediaStore.posterUri = data.backdropUrl;
						rootStore.mediaStore.positionTicks = data.playerStartPositionTicks;
						break;
					case 'ExpoVideoPlayer.playPause':
						rootStore.mediaStore.shouldPlayPause = true;
						break;
					case 'ExpoVideoPlayer.stop':
						rootStore.mediaStore.shouldStop = true;
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
		});

		return (
			<RefreshWebView
				ref={ref}
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
	}, { forwardRef: true }
);

export default NativeShellWebView;
