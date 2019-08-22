import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import Colors from '../constants/Colors'
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: Colors.backgroundColor
  },
  headerTintColor: Colors.headerTintColor
}

const HomeStack = createStackNavigator({
  Home: HomeScreen,
}, {
  defaultNavigationOptions
});

HomeStack.navigationOptions = ({ navigation }) => {
  const tabBarVisible = (navigation.state && navigation.state.routes[0].params) ?
    navigation.state.routes[0].params.tabBarVisible : true;

  return {
    tabBarLabel: 'Home',
    // eslint-disable-next-line react/display-name
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name={
          Platform.OS === 'ios'
            ? 'ios-tv'
            : 'md-tv'
        }
      />
    ),
    tabBarVisible
  };
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
}, {
  defaultNavigationOptions
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  // eslint-disable-next-line react/display-name
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-cog'
          : 'md-cog'
      }
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  SettingsStack,
}, {
  tabBarOptions: {
    activeTintColor: Colors.tabIconSelected,
    inactiveTintColor: Colors.tabIconDefault,
    style: {
      backgroundColor: Colors.backgroundColor
    },
    // Force toolbar label to be under the icon
    adaptive: false
  }
});
