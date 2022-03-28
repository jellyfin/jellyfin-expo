/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import React from 'react';

import '../../i18n';
import AddServerScreen from '../AddServerScreen';

describe('AddServerScreen', () => {
	it('should render correctly', () => {
		const { toJSON } = render(
			<NavigationContainer>
				<AddServerScreen />
			</NavigationContainer>
		);

		expect(toJSON()).toMatchSnapshot();
	});
});
