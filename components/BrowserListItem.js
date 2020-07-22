/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { ListItem } from 'react-native-elements';
import PropTypes from 'prop-types';

import { openBrowser } from '../utils/WebBrowser';

const BrowserListItem = ({item, index}) => (
	<ListItem
		title={item.name}
		leftIcon={item.icon}
		topDivider={index === 0}
		bottomDivider
		chevron
		onPress={() => {
			openBrowser(item.url);
		}}
	/>
);

BrowserListItem.propTypes = {
	item: PropTypes.shape({
		name: PropTypes.string.isRequired,
		icon: PropTypes.string.isRequired,
		url: PropTypes.string.isRequired
	}).isRequired,
	index: PropTypes.number.isRequired
};

export default BrowserListItem;
