/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import MediaTypes from '../../constants/MediaTypes';
import MediaStore from '../MediaStore';

describe('MediaStore', () => {
	it('should initialize with default values', () => {
		const store = new MediaStore();

		expect(store.type).toBeUndefined();
		expect(store.uri).toBeUndefined();
		expect(store.isPlaying).toBe(false);
		expect(store.positionTicks).toBe(0);
		expect(store.positionMillis).toBe(0);
		expect(store.posterUri).toBeUndefined();
		expect(store.shouldPlayPause).toBe(false);
		expect(store.shouldStop).toBe(false);
	});

	it('should reset to the default values', () => {
		const store = new MediaStore();
		store.type = MediaTypes.Video;
		store.uri = 'https://foobar';
		store.isPlaying = true;
		store.positionTicks = 3423000;
		store.posterUri = 'https://foobar';
		store.shouldPlayPause = true;
		store.shouldStop = true;

		expect(store.type).toBe(MediaTypes.Video);
		expect(store.uri).toBe('https://foobar');
		expect(store.isPlaying).toBe(true);
		expect(store.positionTicks).toBe(3423000);
		expect(store.positionMillis).toBe(342.3);
		expect(store.posterUri).toBe('https://foobar');
		expect(store.shouldPlayPause).toBe(true);
		expect(store.shouldStop).toBe(true);

		store.reset();
		expect(store.type).toBeNull();
		expect(store.uri).toBeNull();
		expect(store.isPlaying).toBe(false);
		expect(store.positionTicks).toBe(0);
		expect(store.positionMillis).toBe(0);
		expect(store.posterUri).toBeNull();
		expect(store.shouldPlayPause).toBe(false);
		expect(store.shouldStop).toBe(false);
	});
});
