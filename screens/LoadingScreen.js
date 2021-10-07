/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

import Colors from '../constants/Colors';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.blackish
	},
	splash: {
		flex: 1,
		resizeMode: 'contain',
		width: undefined,
		height: undefined
	}
});

function LoadingScreen() {
	return (
		<View style={styles.container}>
			<Image
				style={styles.splash}
				source={require('../assets/images/splash.png')}
				onLoad={() => SplashScreen.hideAsync().catch(console.debug)}
				fadeDuration={0} // we need to adjust Android devices (https://facebook.github.io/react-native/docs/image#fadeduration) fadeDuration prop to `0` as it's default value is `300`
			/>
			<ActivityIndicator />
		</View>
	);
}

export default LoadingScreen;
