/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { Switch } from 'react-native';
import { ListItem } from 'react-native-elements';
import PropTypes from 'prop-types';

const SwitchListItem = ({item, index}) => (
	<ListItem
		topDivider={index === 0}
		bottomDivider
	>
		<ListItem.Content>
			<ListItem.Title>{item.title}</ListItem.Title>
			{(
				item.subtitle &&
				<ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
			)}
		</ListItem.Content>
		<Switch
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
