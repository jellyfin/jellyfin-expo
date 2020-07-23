/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import ServerInput from '../components/ServerInput';
import Colors from '../constants/Colors';

const AddServerScreen = () => {
	const { t } = useTranslation();
	const headerHeight = useHeaderHeight();

	return (
		<KeyboardAvoidingView
			style={styles.screen}
			behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
		>
			<SafeAreaView
				style={{...styles.container, paddingBottom: headerHeight}}
				edges={['right', 'bottom', 'left']}
			>
				<View style={styles.logoContainer}>
					<Image
						style={styles.logoImage}
						source={require('../assets/images/logowhite.png')}
						fadeDuration={0} // we need to adjust Android devices (https://facebook.github.io/react-native/docs/image#fadeduration) fadeDuration prop to `0` as it's default value is `300`
					/>
				</View>
				<ServerInput
					label={t('addServer.address')}
					placeholder='https://jellyfin.org'
					t={t}
				/>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: Colors.backgroundColor
	},
	container: {
		flex: 1,
		justifyContent: 'space-evenly'
	},
	logoContainer: {
		alignItems: 'center'
	},
	logoImage: {
		marginVertical: 10,
		width: 481,
		height: 151,
		maxWidth: '90%',
		resizeMode: 'contain'
	}
});

export default AddServerScreen;
