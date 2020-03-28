/**
 * Copyright (c) 2020-present, Skyslit Network Private Limited
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import styles from './assets/style.module.css';
import indexStyles from './assets/index.module.css';

export default () => (
  <div>
    <p className={styles.cssModulesInclusion}>CSS Modules are working!</p>
    <p className={indexStyles.cssModulesInclusion}>
      CSS Modules with index are working!
    </p>
  </div>
);
