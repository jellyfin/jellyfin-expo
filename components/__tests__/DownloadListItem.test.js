/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import DownloadModel from '../../models/DownloadModel';
import DownloadListItem from '../DownloadListItem';

const TEST_MODEL = new DownloadModel(
	'item-id',
	'server-id',
	'https://example.com/',
	'api-key',
	'title',
	'file name.mkv',
	'https://example.com/download'
);

describe('DownloadListItem', () => {
	it('should render correctly', () => {
		const { getByTestId, queryByTestId } = render(
			<DownloadListItem
				item={TEST_MODEL}
				index={0}
				onSelect={() => { /* no-op */ }}
				onPlay={() => { /* no-op */ }}
			/>
		);

		expect(queryByTestId('select-checkbox')).toBeNull();

		expect(getByTestId('title')).toHaveTextContent('title');
		expect(getByTestId('subtitle')).toHaveTextContent('file name.mp4');

		expect(queryByTestId('play-button')).toBeNull();
		expect(queryByTestId('loading-indicator')).not.toBeNull();
	});

	it('should display the play button and handle presses', () => {
		const onPlay = jest.fn();

		TEST_MODEL.isComplete = true;

		const { getByTestId, queryByTestId } = render(
			<DownloadListItem
				item={TEST_MODEL}
				index={0}
				onSelect={() => { /* no-op */ }}
				onPlay={onPlay}
			/>
		);

		expect(queryByTestId('select-checkbox')).toBeNull();

		expect(getByTestId('title')).toHaveTextContent('title');
		expect(getByTestId('subtitle')).toHaveTextContent('file name.mp4');

		expect(queryByTestId('play-button')).not.toBeNull();
		expect(queryByTestId('loading-indicator')).toBeNull();

		expect(onPlay).not.toHaveBeenCalled();
		fireEvent.press(getByTestId('play-button'));
		expect(onPlay).toHaveBeenCalled();
	});

	it('should display the select checkbox and handle presses', () => {
		const onSelect = jest.fn();

		const { getByTestId, queryByTestId } = render(
			<DownloadListItem
				item={TEST_MODEL}
				index={0}
				onSelect={onSelect}
				onPlay={() => { /* no-op */ }}
				isEditMode={true}
			/>
		);

		expect(queryByTestId('select-checkbox')).not.toBeNull();

		expect(getByTestId('title')).toHaveTextContent('title');
		expect(getByTestId('subtitle')).toHaveTextContent('file name.mp4');

		expect(queryByTestId('play-button')).not.toBeNull();
		expect(queryByTestId('loading-indicator')).toBeNull();

		expect(onSelect).not.toHaveBeenCalled();
		fireEvent.press(getByTestId('select-checkbox'));
		expect(onSelect).toHaveBeenCalled();
	});
});
