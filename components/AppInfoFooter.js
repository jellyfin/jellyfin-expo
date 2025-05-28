/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useNavigation } from '@react-navigation/native';
import { nativeApplicationVersion, nativeBuildVersion } from 'expo-application';
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, ThemeContext } from 'react-native-elements';

import Screens from '../constants/Screens';
import { getAppName } from '../utils/Device';

const AppInfoFooter = () => {
	const navigation = useNavigation();
	const { theme } = useContext(ThemeContext);

	const textStyle = {
		...styles.text,
		color: theme.colors.grey1
	};

	return (
		<View style={styles.container}>
			<Text
				testID='app-name'
				style={textStyle}
				onLongPress={() => {
					navigation.navigate(Screens.DevSettingsScreen);
				}}
			>
				{getAppName()}
			</Text>
			<Text testID='app-version' style={textStyle}>
				{`${nativeApplicationVersion} (${nativeBuildVersion})`}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 15
	},
	text: {
		fontSize: 15
	}
});

export default AppInfoFooter;
