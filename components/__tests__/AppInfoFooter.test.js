/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import React from 'react';

import '../../i18n';
import Screens from '../../constants/Screens';
import AppInfoFooter from '../AppInfoFooter';

jest.mock('expo-constants');
jest.mock('expo-device');

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
	const actualNav = jest.requireActual('@react-navigation/native');
	return {
		...actualNav,
		useNavigation: () => ({
			navigate: mockNavigate
		})
	};
});

describe('AppInfoFooter', () => {
	it('should render correctly', () => {
		Constants.expoVersion = '39.0.0';
		Constants.nativeAppVersion = '1.0.0';
		Constants.nativeBuildVersion = '1.0.0.0';
		Device.osName = 'Test OS'; // eslint-disable-line no-import-assign, import/namespace

		const { getByTestId } = render(
			<NavigationContainer>
				<AppInfoFooter />
			</NavigationContainer>
		);

		const appName = getByTestId('app-name');
		expect(appName).toHaveTextContent('Jellyfin Mobile (Test OS)');
		fireEvent(appName, 'onLongPress');
		expect(mockNavigate).toHaveBeenCalledWith(Screens.DevSettingsScreen);
		expect(getByTestId('app-version')).toHaveTextContent('1.0.0 (1.0.0.0)');
		expect(getByTestId('expo-version')).toHaveTextContent('Expo Version: 39.0.0');
	});
});
