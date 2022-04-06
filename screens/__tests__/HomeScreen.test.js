/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../../i18n';
import { useStores } from '../../hooks/useStores';
import HomeScreen from '../HomeScreen';

jest.mock('@react-navigation/native', () => {
	const actualNav = jest.requireActual('@react-navigation/native');
	return {
		...actualNav,
		useFocusEffect: jest.fn()
	};
});

jest.mock('../../components/NativeShellWebView', () => 'NativeShellWebView');

jest.mock('../../hooks/useStores');
useStores.mockImplementation(() => ({
	rootStore: {
		mediaStore: {},
		serverStore: {
			servers: [
				{
					urlString: 'https://example.com'
				}
			]
		},
		settingStore: {
			activeServer: 0
		}
	}
}));

describe('HomeScreen', () => {
	it('should render correctly', () => {
		const { toJSON } = render(
			<SafeAreaProvider>
				<ThemeProvider>
					<NavigationContainer>
						<HomeScreen />
					</NavigationContainer>
				</ThemeProvider>
			</SafeAreaProvider>
		);

		expect(toJSON()).toMatchSnapshot();
	});

	it('should render null when no servers are present', () => {
		useStores.mockImplementationOnce(() => ({
			rootStore: {
				mediaStore: {},
				serverStore: {},
				settingStore: {}
			}
		}));

		const { toJSON } = render(
			<SafeAreaProvider>
				<ThemeProvider>
					<NavigationContainer>
						<HomeScreen />
					</NavigationContainer>
				</ThemeProvider>
			</SafeAreaProvider>
		);

		expect(toJSON()).toMatchSnapshot();
	});

	it('should render ErrorView when invalid server exists', () => {
		useStores.mockImplementationOnce(() => ({
			rootStore: {
				mediaStore: {},
				serverStore: {
					servers: [{}]
				},
				settingStore: {
					activeServer: 0
				}
			}
		}));

		const { toJSON } = render(
			<SafeAreaProvider>
				<ThemeProvider>
					<NavigationContainer>
						<HomeScreen />
					</NavigationContainer>
				</ThemeProvider>
			</SafeAreaProvider>
		);

		expect(toJSON()).toMatchSnapshot();
	});
});
