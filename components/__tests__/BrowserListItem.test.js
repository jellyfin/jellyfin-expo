/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import BrowserListItem from '../BrowserListItem';
import { openBrowser } from '../../utils/WebBrowser';

jest.mock('react-native-elements/src/icons/Icon', () => {
	const mockComponent = require('react-native/jest/mockComponent');
	return mockComponent('react-native-elements/src/icons/Icon');
});

jest.mock('../../utils/WebBrowser');

describe('BrowserListItem', () => {
	it('should render correctly and handle presses', () => {
		const { getByTestId } = render(
			<BrowserListItem
				index={0}
				item={{
					name: 'Website',
					url: 'https://jellyfin.org/',
					icon: {
						name: 'ios-globe',
						type: 'ionicon'
					}
				}}
			/>
		);

		expect(getByTestId('icon')).toHaveProp('name', 'ios-globe');
		expect(getByTestId('icon')).toHaveProp('type', 'ionicon');
		expect(getByTestId('title')).toHaveTextContent('Website');

		expect(openBrowser).not.toHaveBeenCalled();
		fireEvent.press(getByTestId('browser-list-item'));
		expect(openBrowser).toHaveBeenCalledWith('https://jellyfin.org/');
	});
});
