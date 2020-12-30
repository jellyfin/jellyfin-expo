/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useContext, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { Input, ThemeContext } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { action } from 'mobx';
import { observer } from 'mobx-react';

import { useStores } from '../hooks/useStores';
import { getIconName } from '../utils/Icons';
import { parseUrl, validateServer } from '../utils/ServerValidator';

const sanitizeHost = (url = '') => url.trim();

const ServerInput = observer(({ onSuccess, ...props }) => {
	const [ host, setHost ] = useState('');
	const [ isValidating, setIsValidating ] = useState(false);
	const [ isValid, setIsValid ] = useState(true);
	const [ validationMessage, setValidationMessage ] = useState('');

	const { rootStore } = useStores();
	const navigation = useNavigation();
	const { t } = useTranslation();
	const { theme } = useContext(ThemeContext);

	const onAddServer = action(async () => {
		console.log('add server', host);
		if (host) {
			setIsValidating(true);
			setIsValid(true);
			setValidationMessage('');

			// Parse the entered url
			let url;
			try {
				url = parseUrl(host);
				console.log('parsed url', url);
			} catch (err) {
				console.info(err);
				setIsValidating(false);
				setIsValid(false);
				setValidationMessage(t('addServer.validation.invalid'));
				return;
			}

			// Validate the server is available
			const validation = await validateServer({ url });
			console.log(`Server is ${validation.isValid ? '' : 'not '}valid`);
			if (!validation.isValid) {
				const message = validation.message || 'invalid';
				setIsValidating(false);
				setIsValid(validation.isValid);
				setValidationMessage(t([`addServer.validation.${message}`, 'addServer.validation.invalid']));
				return;
			}

			// Save the server details
			rootStore.serverStore.addServer({ url });
			rootStore.settingStore.activeServer = rootStore.serverStore.servers.length - 1;
			// Call the success callback if present
			if (onSuccess) {
				onSuccess();
			}
			// Navigate to the main screen
			navigation.replace(
				'Main',
				{
					screen: 'Home',
					params: {
						screen: 'HomeScreen',
						params: { activeServer: rootStore.settingStore.activeServer }
					}
				}
			);
		} else {
			setIsValid(false);
			setValidationMessage(t('addServer.validation.empty'));
		}
	});

	return (
		<Input
			inputContainerStyle={styles.inputContainerStyle}
			leftIcon={{
				name: getIconName('globe'),
				type: 'ionicon'
			}}
			leftIconContainerStyle={styles.leftIconContainerStyle}
			labelStyle={{
				color: theme.colors.grey4
			}}
			placeholderTextColor={theme.colors.grey3}
			rightIcon={isValidating ? <ActivityIndicator /> : null}
			selectionColor={theme.colors.primary}
			autoCapitalize='none'
			autoCorrect={false}
			autoCompleteType='off'
			autoFocus={true}
			keyboardType={Platform.OS === 'ios' ? 'url' : 'default'}
			returnKeyType='go'
			textContentType='URL'
			editable={!isValidating}
			value={host}
			errorMessage={isValid ? null : validationMessage}
			onChangeText={text => setHost(sanitizeHost(text))}
			onSubmitEditing={() => onAddServer()}
			{...props}
		/>
	);
});

const styles = StyleSheet.create({
	inputContainerStyle: {
		marginTop: 8,
		marginBottom: 12,
		backgroundColor: '#292929',
		borderBottomWidth: 0
	},
	leftIconContainerStyle: {
		marginLeft: 12
	}
});

export default ServerInput;
