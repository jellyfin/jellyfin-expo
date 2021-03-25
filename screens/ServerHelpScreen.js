/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuickStartUrl } from '../constants/Links';
import { openBrowser } from '../utils/WebBrowser';

const ServerHelpScreen = () => {
	const navigation = useNavigation();
	const { t } = useTranslation();

	return (
		<SafeAreaView
			style={styles.screen}
			edges={[ 'right', 'bottom', 'left' ]}
		>
			<Text h2 style={styles.heading}>
				{t('serverHelp.heading')}
			</Text>

			<View style={styles.description}>
				<Text style={styles.text}>
					{t('serverHelp.description')}
				</Text>

				<Button
					title={t('serverHelp.learnMore')}
					type='clear'
					onPress={() => {
						openBrowser(QuickStartUrl);
					}}
				/>
			</View>

			<Button
				title={t('common.ok')}
				onPress={() => {
					navigation.goBack();
				}}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	screen: {
		paddingTop: 20,
		paddingHorizontal: 15,
		flex: 1
	},
	heading: {
		textAlign: 'center'
	},
	description: {
		flexGrow: 1,
		justifyContent: 'space-evenly',
		marginHorizontal: 20
	},
	text: {
		textAlign: 'center',
		lineHeight: 24
	}
});

export default ServerHelpScreen;
