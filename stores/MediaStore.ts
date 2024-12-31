/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ticksToMs } from '../utils/Time';

type State = {
	/** The media type being played */
	type?: string,

	/** URI of the current media file */
	uri?: string,

	/** URI of the backdrop image of the current media item */
	backdropUri?: string,

	/** Current playback position (in ticks) */
	positionTicks: number,

	/** Has media playback finished */
	isFinished: boolean,

	/** Is the media in a local file (i.e. not streaming) */
	isLocalFile: boolean,

	/** Is the media currently playing */
	isPlaying: boolean,

	/** The player should toggle the play/pause state */
	shouldPlayPause: boolean,

	/** The player should stop playback */
	shouldStop: boolean,
}

type Actions = {
	set: (v: Partial<State>) => void,

	/** Current position in milliseconds */
	getPositionMillis: () => number,

	/** Resets the store to a default state */
	reset: () => void
}

export type MediaStore = State & Actions

const initialState: State = {
	type: null,
	uri: null,
	backdropUri: null,
	isFinished: false,
	isLocalFile: false,
	isPlaying: false,
	positionTicks: 0,
	shouldPlayPause: false,
	shouldStop: false
};

const persistKeys = Object.keys(initialState);

export const useMediaStore = create<State & Actions>()(
	persist(
		(_set, _get) => ({
			...initialState,
			set: (state) => { _set({ ...state }); },
			getPositionMillis: () => ticksToMs(_get().positionTicks),
			reset: () => {
				_set({ ...initialState });
			}
		}), {
			name: 'MediaStore',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => Object.fromEntries(
				Object.entries(state).filter(([ key ]) => persistKeys.includes(key))
			)
		}
	)
);
