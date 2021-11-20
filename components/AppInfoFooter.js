/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text, ThemeContext } from 'react-native-elements';

import Screens from '../constants/Screens';
import { getAppName } from '../utils/Device';

const AppInfoFooter = () => {
	const navigation = useNavigation();
	const { t } = useTranslation();
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
				{`${Constants.nativeAppVersion} (${Constants.nativeBuildVersion})`}
			</Text>
			<Text testID='expo-version' style={textStyle}>
				{t('settings.expoVersion', { version: Constants.expoVersion })}
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
