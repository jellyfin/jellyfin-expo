/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';

const ButtonListItem = ({item}) => (
  <Button {...item} buttonStyle={{ ...styles.button, ...item.buttonStyle }} />
);

ButtonListItem.propTypes = {
  item: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  button: {
    margin: 15
  }
});

export default ButtonListItem;
