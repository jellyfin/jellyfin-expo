/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Button, Icon, ListItem, colors } from 'react-native-elements';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { getIconName } from '../utils/Icons';

const ServerListItem = ({item, index, activeServer, onDelete, onPress}) => {
  const { t } = useTranslation();

  let title;
  let subtitle;
  if (item.info) {
    title = item.info.ServerName;
    subtitle = t('settings.version', { version: item.info.Version });
  } else {
    title = item.url.host;
    subtitle = t('settings.version', { version: t('common.unknown') });
  }
  subtitle += `\n${item.urlString}`;

  return (
    <ListItem
      title={title}
      titleStyle={styles.title}
      subtitle={subtitle}
      leftElement={(
        index === activeServer ? (
          <Icon
            name={getIconName('checkmark')}
            type='ionicon'
            size={24}
            containerStyle={styles.leftElement}
          />
        ) : (
          <View style={styles.leftElement} />
        )
      )}
      rightElement={(
        <Button
          type='clear'
          icon={{
            name: getIconName('trash'),
            type: 'ionicon',
            iconStyle: styles.deleteButton
          }}
          onPress={() => onDelete(index)}
        />
      )}
      topDivider={index === 0}
      bottomDivider
      onPress={() => onPress(index)}
    />
  );
};

ServerListItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  activeServer: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 2
  },
  leftElement: {
    width: 12
  },
  deleteButton: {
    color: Platform.OS === 'ios' ? colors.platform.ios.error : colors.platform.android.error
  }
});

export default ServerListItem;
