import { Platform } from 'react-native';
import { colors } from 'react-native-elements';

import Colors from '../constants/Colors';

export default {
  Button: {
    buttonStyle: {
      backgroundColor: Colors.tintColor
    }
  },
  Icon: {
    iconStyle: {
      color: Colors.textColor
    }
  },
  Input: {
    inputStyle: {
      color: Colors.textColor
    },
    errorStyle: {
      color: Platform.OS === 'ios' ? colors.platform.ios.error : colors.platform.android.error,
      fontSize: 16
    },
    leftIconContainerStyle: {
      marginRight: 8
    },
    rightIconContainerStyle: {
      marginRight: 15
    }
  },
  ListItem: {
    containerStyle: {
      backgroundColor: Colors.backgroundColor
    }
  },
  Text: {
    style: {
      color: Colors.textColor
    }
  }
};