/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* Fetch and AbortController Mocks */
import { enableFetchMocks } from 'jest-fetch-mock';
import { AbortController } from 'node-abort-controller';

// DOMException is not polyfilled in released version of jest-fetch-mock
// refs: https://github.com/jefflau/jest-fetch-mock/pull/160
if (typeof DOMException === 'undefined') {
	global.DOMException = require('domexception');
}

global.AbortController = AbortController;

enableFetchMocks();

/* React Navigation Mocks */
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
	const Reanimated = require('react-native-reanimated/mock');

	// The mock for `call` immediately calls the callback which is incorrect
	// So we override it with a no-op
	Reanimated.default.call = () => { /* no-op */ };

	return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Workaround for process failing: https://github.com/react-navigation/react-navigation/issues/9568
jest.mock('@react-navigation/native/lib/commonjs/useLinking.native', () => ({
	default: () => ({ getInitialState: { then: jest.fn() } }),
	__esModule: true
}));
