/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import Constants from 'expo-constants';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

import { useStores } from '../hooks/useStores';
import { getAppName, getSafeDeviceName } from '../utils/Device';
import NativeShell from '../utils/NativeShell';
import { openBrowser } from '../utils/WebBrowser';
import RefreshWebView from './RefreshWebView';

const injectedJavaScript = `
window.ExpoAppInfo = {
  appName: '${getAppName()}',
  appVersion: '${Constants.nativeAppVersion}',
  deviceId: '${Constants.deviceId}',
  deviceName: '${getSafeDeviceName().replace(/'/g, '\\\'')}'
};

${NativeShell}

true;
`;

const NativeShellWebView = observer((props) => {
	const { rootStore } = useStores();
	const navigation = useNavigation();
	const [isRefreshing, setIsRefreshing] = useState(false);
	const webview = useRef(null);

	const server = rootStore.serverStore.servers[rootStore.settingStore.activeServer];

	useEffect(() => {
		navigation.addListener('tabPress', e => {
			if (navigation.isFocused()) {
				// Prevent default behavior
				e.preventDefault();
				// Call the web router to navigate home
				webview.current?.injectJavaScript('window.Emby && window.Emby.Page && typeof window.Emby.Page.goHome === "function" && window.Emby.Page.goHome();');
			}
		});
	}, []);

	const onRefresh = () => {
		// Disable pull to refresh when in fullscreen
		if (rootStore.isFullscreen) return;
		setIsRefreshing(true);
		webview.current?.reload();
		setIsRefreshing(false);
	};

	const onMessage = action(({ nativeEvent: state }) => {
		try {
			const { event, data } = JSON.parse(state.data);
			switch (event) {
				case 'enableFullscreen':
					rootStore.isFullscreen = true;
					break;
				case 'disableFullscreen':
					rootStore.isFullscreen = false;
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
			ref={webview}
			source={{ uri: server.urlString }}
			// Inject javascript for NativeShell
			injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
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
		/>
	);
});

export default NativeShellWebView;
