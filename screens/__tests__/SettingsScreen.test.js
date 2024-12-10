/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import React from 'react';
import { Platform } from 'react-native';
import { ThemeProvider } from 'react-native-elements';

import '../../i18n';
import { useStores } from '../../hooks/useStores';
import SettingsScreen from '../SettingsScreen';

// Mock Platform to allow testing platform specific code
jest.mock('react-native/Libraries/Utilities/Platform');
// Button fails to render in some cases so it needs mocked
jest.mock('react-native-elements/dist/buttons/Button', () => 'Button');

jest.mock('../../hooks/useStores');
useStores.mockImplementation(() => ({
	rootStore: {
		settingStore: {}
	},
	serverStore: {
		fetchInfo: jest.fn(),
		servers: []
	}
}));

describe('SettingsScreen', () => {
	it('should render correctly', () => {
		Platform.Version = '13';

		const { toJSON } = render(
			<ThemeProvider>
				<NavigationContainer>
					<SettingsScreen />
				</NavigationContainer>
			</ThemeProvider>
		);

		expect(toJSON()).toMatchSnapshot();
	});
});
