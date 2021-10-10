'use strict';

const path = require('path');
const funnel = require('broccoli-funnel');
const stringReplace = require('broccoli-string-replace');
const UnwatchedDir = require('broccoli-source').UnwatchedDir;

module.exports = {
  name: require('./package').name,

  included() {
    this._super.included.apply(this, arguments);

    this.import('vendor/purify.js', {
      using: [{ transformation: 'amd', as: 'dompurify' }]
    });
  },

  findModulePath(basedir) {
    try {
      let resolve = require('resolve');

      return path.dirname(resolve.sync('dompurify', { basedir: basedir }));
    } catch (_) {
      try {
        return path.dirname(require.resolve('dompurify'));
      } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
          this.ui.writeLine(
            `ember-dompurify: dompurify not installed, be sure you have dompurify installed via npm/yarn.`
          );
          return;
        }

        throw e;
      }
    }
  },

  removeSourcemapAnnotation(tree) {
    return stringReplace(tree, {
      files: ['purify.js'],
      annotation: 'Remove sourcemap annotation (dom-purify)',
      patterns: [
        {
          match: /\/\/# sourceMappingURL=purify.js.map/g,
          replacement: ''
        }
      ]
    });
  },

  treeForVendor() {
    let purifyPath = this.findModulePath(this.project.root);
    let tree = funnel(new UnwatchedDir(purifyPath), {
      include: ['purify.js']
    });

    return this.removeSourcemapAnnotation(tree);
  }
};
