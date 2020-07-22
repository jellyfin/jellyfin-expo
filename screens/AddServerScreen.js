/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import ServerInput from '../components/ServerInput';
import Colors from '../constants/Colors';

const AddServerScreen = () => {
	const { t } = useTranslation();

	return (
		<View style={styles.container}>
			<View style={styles.logoContainer}>
				<Image
					style={styles.logoImage}
					source={require('../assets/images/logowhite.png')}
					fadeDuration={0} // we need to adjust Android devices (https://facebook.github.io/react-native/docs/image#fadeduration) fadeDuration prop to `0` as it's default value is `300`
				/>
			</View>
			<ServerInput
				containerStyle={styles.serverTextContainer}
				label={t('addServer.address')}
				placeholder='https://jellyfin.org'
				t={t}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	serverTextContainer: {
		flex: 1,
		alignContent: 'flex-start'
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.backgroundColor
	},
	logoContainer: {
		marginTop: 80,
		marginBottom: 48,
		alignItems: 'center',
		justifyContent: 'center'
	},
	logoImage: {
		width: '90%',
		height: undefined,
		maxWidth: 481,
		maxHeight: 151,
		// Aspect ration of the logo
		aspectRatio: 3.18253
	}
});

export default AddServerScreen;
