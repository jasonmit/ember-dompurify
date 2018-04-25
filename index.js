'use strict';

module.exports = {
  name: 'ember-dompurify',

  included() {
    this._super.included.apply(this, arguments);

    this.import('node_modules/dompurify/dist/purify.js', {
      using: [{ transformation: 'amd', as: 'dompurify' }]
    });

    this.import('node_modules/dompurify/dist/purify.js.map', { destDir: 'assets' });
  }
};
