/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { render } from '@testing-library/react-native';
import React from 'react';

import DevSettingsScreen from '../DevSettingsScreen';

describe('DevSettingsScreen', () => {
	it('should render correctly', () => {
		const { toJSON } = render(
			<DevSettingsScreen />
		);

		expect(toJSON()).toMatchSnapshot();
	});
});
