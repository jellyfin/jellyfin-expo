/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { act, render } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from 'react-native-elements';

import ThemeSwitcher from '../ThemeSwitcher';

// NOTE: This test just verifies the component renders, because the
// functionality would be very difficult to test properly
describe('ThemeSwitcher', () => {
	it('should render', () => {
		const { toJSON, unmount } = render(
			<ThemeProvider>
				<ThemeSwitcher />
			</ThemeProvider>
		);

		expect(toJSON()).toMatchSnapshot();
		act(unmount);
	});
});
