/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import PropTypes from 'prop-types';

const ButtonListItem = ({item, index}) => (
	<ListItem
		topDivider={index === 0}
		bottomDivider
	>
		<ListItem.Content>
			<Button
				{...item}
				type='clear'
				buttonStyle={{ ...styles.button, ...item.buttonStyle }}
				titleStyle={{ ...styles.title, ...item.titleStyle }}
			/>
		</ListItem.Content>
	</ListItem>
);

ButtonListItem.propTypes = {
	item: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired
};

const styles = StyleSheet.create({
	button: {
		justifyContent: 'flex-start',
		padding: 0
	}
});

export default ButtonListItem;
