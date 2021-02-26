/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useContext } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { ThemeContext } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useStores } from '../hooks/useStores';
import ServerInput from '../components/ServerInput';

const AddServerScreen = () => {
	const { t } = useTranslation();
	const { rootStore } = useStores();
	const { theme } = useContext(ThemeContext);

	return (
		<KeyboardAvoidingView
			style={{
				...styles.screen,
				backgroundColor: theme.colors.background
			}}
			behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
		>
			<SafeAreaView
				style={styles.container}
				edges={[ 'right', 'bottom', 'left' ]}
			>
				<View style={styles.logoContainer}>
					<Image
						style={styles.logoImage}
						source={
							rootStore.settingStore.theme.dark ?
								require('../assets/images/logowhite.png') :
								require('../assets/images/logoblack.png')
						}
						fadeDuration={0} // we need to adjust Android devices (https://facebook.github.io/react-native/docs/image#fadeduration) fadeDuration prop to `0` as it's default value is `300`
					/>
				</View>
				<ServerInput
					label={t('addServer.address')}
					placeholder='https://jellyfin.org'
				/>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1
	},
	container: {
		flex: 1,
		justifyContent: 'space-evenly'
	},
	logoContainer: {
		alignSelf: 'center',
		paddingVertical: 10,
		height: '40%',
		maxHeight: 151,
		maxWidth: '90%'
	},
	logoImage: {
		flex: 1,
		resizeMode: 'contain',
		maxWidth: '100%'
	}
});

export default AddServerScreen;
