/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://jestjs.io/"}
 */
import { renderHook } from '@testing-library/react';

import { act } from '@testing-library/react-native';

import MediaTypes from '../../constants/MediaTypes';
import { useMediaStore } from '../MediaStore';

describe('MediaStore', () => {
	it('should initialize with default values', () => {
		const store = renderHook(() => useMediaStore((state) => state));

		expect(store.result.current.type).toBeNull();
		expect(store.result.current.uri).toBeNull();
		expect(store.result.current.backdropUri).toBeNull();

		expect(store.result.current.positionTicks).toBe(0);
		expect(store.result.current.getPositionMillis()).toBe(0);

		expect(store.result.current.isFinished).toBe(false);
		expect(store.result.current.isLocalFile).toBe(false);
		expect(store.result.current.isPlaying).toBe(false);
		expect(store.result.current.shouldPlayPause).toBe(false);
		expect(store.result.current.shouldStop).toBe(false);
	});

	it('should reset to the default values', () => {
		const store = renderHook(() => useMediaStore((state) => state));

		act(() => {
			store.result.current.set({
				type: MediaTypes.Video,
				uri: 'https://foobar',
				isFinished: true,
				isLocalFile: true,
				isPlaying: true,
				positionTicks: 3423000,
				backdropUri: 'https://foobar',
				shouldPlayPause: true,
				shouldStop: true
			});
		});

		expect(store.result.current.type).toBe(MediaTypes.Video);
		expect(store.result.current.uri).toBe('https://foobar');
		expect(store.result.current.backdropUri).toBe('https://foobar');

		expect(store.result.current.positionTicks).toBe(3423000);
		expect(store.result.current.getPositionMillis()).toBe(342.3);

		expect(store.result.current.isFinished).toBe(true);
		expect(store.result.current.isLocalFile).toBe(true);
		expect(store.result.current.isPlaying).toBe(true);
		expect(store.result.current.shouldPlayPause).toBe(true);
		expect(store.result.current.shouldStop).toBe(true);

		act(() => {
			store.result.current.reset();
		});

		expect(store.result.current.type).toBeNull();
		expect(store.result.current.uri).toBeNull();
		expect(store.result.current.backdropUri).toBeNull();

		expect(store.result.current.positionTicks).toBe(0);
		expect(store.result.current.getPositionMillis()).toBe(0);

		expect(store.result.current.isFinished).toBe(false);
		expect(store.result.current.isLocalFile).toBe(false);
		expect(store.result.current.isPlaying).toBe(false);
		expect(store.result.current.shouldPlayPause).toBe(false);
		expect(store.result.current.shouldStop).toBe(false);
	});
});
