/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import Constants from 'expo-constants';

import { useStores } from '../hooks/useStores';
import NativeShellWebView from '../components/NativeShellWebView';
import OfflineErrorView from '../components/OfflineErrorView';
import Colors from '../constants/Colors';

const HomeScreen = observer(() => {
	const { rootStore } = useStores();
	const navigation = useNavigation();

	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Show/hide the bottom tab bar
		navigation.setOptions({
			tabBarVisible: !rootStore.isFullscreen
		});
	}, [rootStore.isFullscreen]);

	// When not in fullscreen, the top adjustment is handled by the spacer View for iOS
	const safeAreaEdges = ['right', 'bottom', 'left'];
	if (Platform.OS !== 'ios' || rootStore.isFullscreen) {
		safeAreaEdges.push('top');
	}
	// Hide webview until loaded
	const webviewStyle = (isError || isLoading) ? styles.loading : styles.container;

	if (!rootStore.serverStore.servers || rootStore.serverStore.servers.length === 0) {
		return null;
	}
	const server = rootStore.serverStore.servers[rootStore.settingStore.activeServer];

	return (
		<SafeAreaView style={styles.container} edges={safeAreaEdges} >
			{Platform.OS === 'ios' && !rootStore.isFullscreen && (
				<View style={styles.statusBarSpacer} />
			)}
			{server && server.urlString && (
				<NativeShellWebView
					style={webviewStyle}
					refreshControlProps={{
						// iOS colors
						tintColor: Colors.tabText,
						backgroundColor: Colors.headerBackgroundColor,
						// Android colors
						colors: [Colors.primaryBlue, Colors.primaryPurple],
						progressBackgroundColor: Colors.backgroundColor
					}}
					// Error screen is displayed if loading fails
					renderError={() => <OfflineErrorView onRetry={() => this.onRefresh()} />}
					// Loading screen is displayed when refreshing
					renderLoading={() => <View style={styles.container} />}
					// Update state on loading error
					onError={({ nativeEvent: state }) => {
						console.warn('Error', state);
						setIsError(true);
					}}
					// Update state when loading is complete
					onLoad={() => {
						setIsError(false);
						setIsLoading(false);
					}}
				/>
			)}
		</SafeAreaView>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor
	},
	loading: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
		opacity: 0
	},
	statusBarSpacer: {
		backgroundColor: Colors.headerBackgroundColor,
		height: Constants.statusBarHeight
	}
});

export default HomeScreen;
