/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Button, ListItem } from 'react-native-elements';

import { getIconName } from '../utils/Icons';

const DownloadListItem = ({ item, index, onShare }) => (
	<ListItem
		topDivider={index === 0}
		bottomDivider
	>
		<ListItem.Content>
			<ListItem.Title>{item.title}</ListItem.Title>
		</ListItem.Content>
		{item.isComplete ?
			<Button
				type='clear'
				icon={{
					name: getIconName('share-outline'),
					type: 'ionicon'
				}}
				onPress={() => onShare(item)}
			/> : <ActivityIndicator />
		}
	</ListItem>
);

DownloadListItem.propTypes = {
	item: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired,
	onShare: PropTypes.func.isRequired
};

export default DownloadListItem;
