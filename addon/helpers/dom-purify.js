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
  init() {
    this._super(...arguments);
    this._owner = getOwner(this);
  },

  _normalizeConfigKey(key) {
    return key.toUpperCase().replace(/-/g, '_');
  },

  _parse(attrs, { target, owner }) {
    const config = Object.create(null);
    const hooks = [];

    for (let key in attrs) {
      if (key === 'transform') {
        let Transform;

        if (typeof attrs[key] === 'string') {
          Transform = owner.factoryFor(`purifier:${attrs[key]}`).class;
        } else {
          Transform = attrs[key];
        }

        const transform = new Transform(target);
        HOOK_ATTRS.forEach(key =>
          hooks.push([key, (...args) => transform[key](...args)])
        );
      } else if (HOOK_ATTRS.includes(key)) {
        hooks.push([key, attrs[key]]);
      } else {
        config[this._normalizeConfigKey(key)] = attrs[key];
      }
    }

    return { config, hooks };
  },

  compute([value = ''], attrs = {}) {
    let inputString = value;
    if (!inputString) return;

    if (isHTMLSafe(inputString)) {
      /* unwrap safeString */
      inputString = inputString.toString();
    }

    if (typeof inputString !== 'string' || inputString.length === 0) {
      return;
    }

    const domPurify = createDOMPurify(self);
    const { config, hooks } = this._parse(attrs, {
      target: domPurify,
      owner: this._owner
    });

    hooks.forEach(([hookName, fn]) => domPurify.addHook(hookName, fn));

    return htmlSafe(domPurify.sanitize(inputString, config));
  }
});
