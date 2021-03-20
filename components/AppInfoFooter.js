/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, ThemeContext } from 'react-native-elements';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';

import { getAppName } from '../utils/Device';

const AppInfoFooter = () => {
	const { t } = useTranslation();
	const { theme } = useContext(ThemeContext);

	const textStyle = {
		...styles.text,
		color: theme.colors.grey1
	};

	return (
		<View style={styles.container}>
			<Text testID='app-name' style={textStyle}>
				{`${getAppName()}`}
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
