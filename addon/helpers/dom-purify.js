import createDOMPurify from 'dompurify';
import Helper from '@ember/component/helper';
import { getOwner } from '@ember/application';
import { htmlSafe, isHTMLSafe } from '@ember/string';

const HOOK_ATTRS = [
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

  /** @public **/
  init() {
    this._super(...arguments);
    this._owner = getOwner(this);
  },

  /** @public **/
  compute([input], attrs) {
    const inputString = isHTMLSafe(input) ? input.toString() : input;

    if (typeof inputString !== 'string' || !inputString) {
      return;
    }

    const domPurify = createDOMPurify(self);
    const { config, hooks } = this.parseAttributes(attrs);
    hooks.forEach(([hookName, fn]) => domPurify.addHook(hookName, fn));

    return htmlSafe(domPurify.sanitize(inputString, config));
  },

  /** @private **/
  normalizeAttributeName(key) {
    return key.toUpperCase().replace(/-/g, '_');
  },

  /** @private **/
  lookupHook(name) {
    return this._owner.factoryFor(`hook:${name}`).class;
  },

  /** @private **/
  parseAttributes(attrs) {
    const config = Object.create(null);
    const hooks = [];

    for (let key in attrs) {
      if (key === 'hook') {
        let Hook;

        if (typeof attrs[key] === 'string') {
          Hook = this.lookupHook(attrs[key]);
        } else {
          Hook = attrs[key];
        }

        const hook = new Hook();
        HOOK_ATTRS.forEach(key =>
          hooks.push([key, (...args) => hook[key](...args)])
        );
      } else if (HOOK_ATTRS.includes(key)) {
        hooks.push([key, (...args) => attrs[key](...args)]);
      } else {
        config[this.normalizeAttributeName(key)] = attrs[key];
      }
    }

    return { config, hooks };
  }
});
