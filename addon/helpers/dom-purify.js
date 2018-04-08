import createDOMPurify from 'dompurify';
import { makeArray } from '@ember/array';
import Helper from '@ember/component/helper';
import { getOwner } from '@ember/application';
import { htmlSafe, isHTMLSafe } from '@ember/string';

const HOOKS = [
  'beforeSanitizeElements',
  'uponSanitizeElement',
  'afterSanitizeElements',
  'beforeSanitizeAttributes',
  'uponSanitizeAttribute',
  'afterSanitizeAttributes',
  'beforeSanitizeShadowDOM',
  'uponSanitizeShadowNode',
  'afterSanitizeShadowDOM'
];

export default Helper.extend({
  /** @private **/
  _owner: null,

  /** @private **/
  _config: null,

  /** @private **/
  _purify: null,

  /** @public **/
  init() {
    this._super(...arguments);
    this._owner = getOwner(this);
    this._purify = createDOMPurify(self);
  },

  /** @public **/
  compute([input], attrs) {
    const inputString = isHTMLSafe(input) ? input.toString() : input;

    if (typeof inputString !== 'string' || !inputString) {
      return;
    }

    if (this._config) {
      /* reset purify state between computes */
      this._purify.removeAllHooks();
      this._purify.clearConfig();
      this._config = null;
    }

    /* re-create new purify state */
    this._config = this.parseAttributes(attrs);
    this._purify.setConfig(this._config);

    return htmlSafe(this._purify.sanitize(inputString));
  },

  /** @private **/
  normalizeAttributeName(key) {
    return key.toUpperCase().replace(/-/g, '_');
  },

  /** @private **/
  lookupHooks(name) {
    return name
      .split(' ')
      .map(hookName => this._owner.factoryFor(`hook:${hookName}`).class);
  },

  /** @private **/
  parseAttributes(attrs) {
    return Object.keys(attrs).reduce((accum, key) => {
      const value = attrs[key];

      if (key === 'hook') {
        let hooks =
          typeof value === 'string'
            ? this.lookupHooks(value)
            : makeArray(value);

        hooks.forEach(Hook => new Hook(this._purify));
      } else if (HOOKS.includes(key)) {
        this._purify.addHook(key, (...args) => value(...args));
      } else {
        accum[this.normalizeAttributeName(key)] = value;
      }

      return accum;
    }, {});
  }
});
