/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { render } from '@testing-library/react-native';
import React from 'react';

import { useStores } from '../../hooks/useStores';
import { getAppName, getDeviceProfile, getSafeDeviceName } from '../../utils/Device';
import NativeShellWebView from '../NativeShellWebView';

jest.mock('../../hooks/useStores');
useStores.mockImplementation(() => ({
	rootStore: {
		serverStore: {
			servers: [{
				info: {
					Version: '10.8.0'
				}
			}]
		},
		settingStore: {
			activeServer: 0
		}
	}
}));

jest.mock('../../utils/Device');
getAppName.mockImplementation(() => 'Jellyfin Mobile');
getDeviceProfile.mockImplementation(() => ({}));
getSafeDeviceName.mockImplementation(() => 'Test Device');

describe('NativeShellWebView', () => {
	it('should render correctly', () => {
		const { toJSON } = render(
			<NativeShellWebView />
		);

		expect(toJSON()).toMatchSnapshot();
	});
});
