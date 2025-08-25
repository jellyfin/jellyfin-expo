/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, useWindowDimensions } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuickStartUrl } from '../constants/Links';
import { Screens } from '../constants/Screens';
import { isCompact } from '../utils/Device';
import { openBrowser } from '../utils/WebBrowser';

const ServerHelpScreen = () => {
	const navigation = useNavigation();
	const { t } = useTranslation();
	const window = useWindowDimensions();

	return (
		<SafeAreaView
			style={styles.screen}
			edges={[ 'right', 'bottom', 'left' ]}
		>
			{isCompact(window) ? null : <Image
				style={styles.icon}
				source={require('@jellyfin/ux-ios/icon-transparent.png')}
				fadeDuration={0} // we need to adjust Android devices (https://facebook.github.io/react-native/docs/image#fadeduration) fadeDuration prop to `0` as it's default value is `300`
			/>}

			<Text h2 style={styles.heading}>
				{t('serverHelp.heading')}
			</Text>

			<Text style={styles.text}>
				{t('serverHelp.description')}
			</Text>

			<Button
				style={styles.learnMoreButton}
				title={t('serverHelp.learnMore')}
				type='clear'
				onPress={() => {
					openBrowser(QuickStartUrl);
				}}
			/>

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
	icon: {
		height: 120,
		width: 120,
		alignSelf: 'center',
		resizeMode: 'contain',
		marginVertical: 20
	},
	heading: {
		textAlign: 'center',
		marginBottom: 20
	},
	text: {
		flexGrow: 1,
		marginHorizontal: 20,
		textAlign: 'center',
		lineHeight: 24
	},
	learnMoreButton: {
		marginHorizontal: 40,
		marginVertical: 20
	}
});

ServerHelpScreen.displayName = Screens.ServerHelpScreen;

export default ServerHelpScreen;
