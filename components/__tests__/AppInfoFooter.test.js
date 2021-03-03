/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import React from 'react';
import { render } from '@testing-library/react-native';

import AppInfoFooter from '../AppInfoFooter';
import '../../i18n';

jest.mock('expo-constants');
jest.mock('expo-device');

describe('AppInfoFooter', () => {
	it('should render correctly', () => {
		Constants.expoVersion = '39.0.0';
		Constants.nativeAppVersion = '1.0.0';
		Constants.nativeBuildVersion = '1.0.0.0';
		Device.osName = 'Test OS'; // eslint-disable-line no-import-assign, import/namespace

		const { getByTestId } = render(<AppInfoFooter />);

		expect(getByTestId('app-name')).toHaveTextContent('Jellyfin Mobile (Test OS)');
		expect(getByTestId('app-version')).toHaveTextContent('1.0.0 (1.0.0.0)');
		expect(getByTestId('expo-version')).toHaveTextContent('Expo Version: 39.0.0');
	});
});
