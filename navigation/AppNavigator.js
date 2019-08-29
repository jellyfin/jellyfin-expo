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