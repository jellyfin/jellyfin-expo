/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Button, Icon, ListItem, colors } from 'react-native-elements';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { getIconName } from '../utils/Icons';

const ServerListItem = ({item, index, activeServer, onDelete, onPress}) => {
	const { t } = useTranslation();

	const title = item?.name;
	const version = item?.info?.Version || t('common.unknown');
	const subtitle = `${t('settings.version', { version })}\n${item.urlString}`;

	return (
		<ListItem
			topDivider={index === 0}
			bottomDivider
			onPress={() => onPress(index)}
		>
			{(
				index === activeServer ? (
					<Icon
						name={getIconName('checkmark')}
						type='ionicon'
						size={24}
						containerStyle={styles.leftElement}
					/>
				) : (
					<View style={styles.leftElement} />
				)
			)}
			<ListItem.Content>
				<ListItem.Title style={styles.title}>{title}</ListItem.Title>
				<ListItem.Subtitle>{subtitle}</ListItem.Subtitle>
			</ListItem.Content>
			<Button
				type='clear'
				icon={{
					name: getIconName('trash'),
					type: 'ionicon',
					iconStyle: styles.deleteButton
				}}
				onPress={() => onDelete(index)}
			/>
		</ListItem>
	);
};

ServerListItem.propTypes = {
	item: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired,
	activeServer: PropTypes.number.isRequired,
	onDelete: PropTypes.func.isRequired,
	onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
	title: {
		marginBottom: 2
	},
	leftElement: {
		width: 12
	},
	deleteButton: {
		color: Platform.OS === 'ios' ? colors.platform.ios.error : colors.platform.android.error
	}
});

export default ServerListItem;
