/**
 * Copyright (c) 2020-present, Skyslit Network Private Limited
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import JsonInclusion from './JsonInclusion';

describe('JSON inclusion', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<JsonInclusion />, div);
  });
});
