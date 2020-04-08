/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import 'react-native';
import React from 'react';
import App from '../App';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';

describe('App snapshot', () => {
    jest.useFakeTimers();
    beforeEach(() => {
        NavigationTestUtils.resetInternalState();
    });

    it('renders the loading screen', async () => {
        const tree = renderer.create(<App />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders the root without loading screen', async () => {
        const tree = renderer.create(<App skipLoadingScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
