/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ListItem } from 'react-native-elements';
import PropTypes from 'prop-types';
import React from 'react';
import { Switch } from 'react-native';

const SwitchListItem = ({ item, index }) => (
	<ListItem
		testID='switch-list-item'
		topDivider={index === 0}
		bottomDivider
	>
		<ListItem.Content>
			<ListItem.Title
				testID='title'
			>
				{item.title}
			</ListItem.Title>
			{(
				item.subtitle &&
				<ListItem.Subtitle
					testID='subtitle'
				>
					{item.subtitle}
				</ListItem.Subtitle>
			)}
		</ListItem.Content>
		<Switch
			testID='switch'
			disabled={item.disabled}
			value={item.value}
			onValueChange={item.onValueChange}
		/>
	</ListItem>
);

SwitchListItem.propTypes = {
	item: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired
};

export default SwitchListItem;
