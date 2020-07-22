/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Colors from '../constants/Colors';
import { getIconName } from '../utils/Icons';

const OfflineErrorView = ({ onRetry }) => {
	const { t } = useTranslation();

	return (
		<View style={styles.container}>
			<Text style={styles.error}>{t('home.offline')}</Text>
			<Button
				buttonStyle={{
					marginLeft: 15,
					marginRight: 15
				}}
				icon={{
					name: getIconName('refresh'),
					type: 'ionicon'
				}}
				title={t('home.retry')}
				onPress={onRetry}
			/>
		</View>);
};

OfflineErrorView.propTypes = {
	onRetry: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor
	},
	error: {
		fontSize: 17,
		paddingBottom: 17,
		textAlign: 'center'
	}
});

export default OfflineErrorView;
