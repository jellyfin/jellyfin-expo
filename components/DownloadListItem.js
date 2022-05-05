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

const DownloadListItem = ({ item, index, onSelect, onPlay, isEditMode = false, isSelected = false }) => (
	<ListItem
		topDivider={index === 0}
		bottomDivider
	>
		{isEditMode &&
			<ListItem.CheckBox
				testID='select-checkbox'
				onPress={() => onSelect(item)}
				checked={isSelected}
			/>
		}
		<ListItem.Content>
			<ListItem.Title testID='title'>
				{item.title}
			</ListItem.Title>
			<ListItem.Subtitle testID='subtitle'>
				{item.localFilename}
			</ListItem.Subtitle>
		</ListItem.Content>
		{item.isComplete ?
			<Button
				testID='play-button'
				type='clear'
				icon={{
					name: getIconName('play'),
					type: 'ionicon'
				}}
				disabled={isEditMode}
				onPress={() => onPlay(item)}
			/> :
			<ActivityIndicator testID='loading-indicator' />
		}
	</ListItem>
);

DownloadListItem.propTypes = {
	item: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired,
	onSelect: PropTypes.func.isRequired,
	onPlay: PropTypes.func.isRequired,
	isEditMode: PropTypes.bool,
	isSelected: PropTypes.bool
};

export default DownloadListItem;
