/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * 
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://jestjs.io/"}
 */

import { NavigationContainer } from '@react-navigation/native';
import { act, render } from '@testing-library/react-native';
import React from 'react';

import { useStores } from '../../hooks/useStores';
import DownloadModel from '../../models/DownloadModel';
import DownloadStore, { useDownloadStore } from '../../stores/DownloadStore';
import DownloadScreen from '../DownloadScreen';
import { renderHook } from '@testing-library/react';

const mockSetOptions = jest.fn();
jest.mock('@react-navigation/native', () => {
	const actualNav = jest.requireActual('@react-navigation/native');
	return {
		...actualNav,
		useNavigation: () => ({
			setOptions: mockSetOptions
		})
	};
});

DOWNLOAD_1 = new DownloadModel(
	'item-id',
	'server-id',
	'https://example.com/',
	'api-key',
	'title',
	'file name.mkv',
	'https://example.com/download'
)

DOWNLOAD_2 = new DownloadModel(
	'item-id-2',
	'server-id',
	'https://test2.example.com/',
	'api-key',
	'other title',
	'other file name.mkv',
	'https://test2.example.com/download'
)

const mockDownloadStore = {
	downloads: new Map([[DOWNLOAD_1.key, DOWNLOAD_1], [DOWNLOAD_2.key, DOWNLOAD_2]]),
	add: (v) => act(() => {mockDownloadStore.downloads = new Map([...mockDownloadStore.downloads, [v.key, v]])})
}

jest.mock('../../hooks/useStores');
useStores.mockImplementation(() => ({
	rootStore: {},
	downloadStore: mockDownloadStore
}));

describe('DownloadScreen', () => {
	it('should render correctly', () => {
		const v = render(
			<NavigationContainer>
				<DownloadScreen />
			</NavigationContainer>
		);

		expect(v.toJSON()).toMatchSnapshot();
		expect(mockSetOptions).toHaveBeenCalled();
	});
});
