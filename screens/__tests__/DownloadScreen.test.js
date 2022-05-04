/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import React from 'react';

import { useStores } from '../../hooks/useStores';
import DownloadModel from '../../models/DownloadModel';
import DownloadStore from '../../stores/DownloadStore';
import DownloadScreen from '../DownloadScreen';

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

const mockDownloadStore = new DownloadStore();
jest.mock('../../hooks/useStores');
useStores.mockImplementation(() => ({
	rootStore: {
		downloadStore: mockDownloadStore
	}
}));

describe('DownloadScreen', () => {
	it('should render correctly', () => {
		mockDownloadStore.add(new DownloadModel(
			'item-id',
			'server-id',
			'https://example.com/',
			'api-key',
			'title',
			'file name.mkv',
			'https://example.com/download'
		));
		mockDownloadStore.add(new DownloadModel(
			'item-id-2',
			'server-id',
			'https://test2.example.com/',
			'api-key',
			'other title',
			'other file name.mkv',
			'https://test2.example.com/download'
		));

		const { toJSON } = render(
			<NavigationContainer>
				<DownloadScreen />
			</NavigationContainer>
		);

		expect(toJSON()).toMatchSnapshot();
		expect(mockSetOptions).toHaveBeenCalled();
	});
});
