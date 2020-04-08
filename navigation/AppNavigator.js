/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AddServerScreen from '../screens/AddServerScreen';
import ServerLoadingScreen from '../screens/ServerLoadingScreen';

export default createAppContainer(createSwitchNavigator({
    ServerLoading: ServerLoadingScreen,
    AddServer: AddServerScreen,
    Main: MainTabNavigator
}, {
    initialRouteName: 'ServerLoading'
}));
