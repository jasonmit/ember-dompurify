import createDOMPurify from 'dompurify';
import { helper } from '@ember/component/helper';
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

function parseNamedAttributes(attrs, domPurifyInstance) {
  const config = Object.create(null);
  const hooks = [];

  for (let key in attrs) {
    if (key === 'transform') {
      const Transform = attrs[key];
      const transform = new Transform(domPurifyInstance);
      HOOK_ATTRS.forEach(key =>
        hooks.push([key, (...args) => transform[key](...args)])
      );
    } else if (HOOK_ATTRS.includes(key)) {
      hooks.push([key, attrs[key]]);
    } else {
      config[key.toUpperCase().replace(/-/g, '_')] = attrs[key];
    }
  }

  return { config, hooks };
}

export function htmlSafer([value = ''], attrs = {}) {
  if (!value) {
    return;
  }

  let inputString = value;

  if (isHTMLSafe(inputString)) {
    /* unwrap safeString */
    inputString = inputString.toString();
  }

  if (typeof inputString !== 'string' || inputString.length === 0) {
    return;
  }

  const domPurifyInstance = createDOMPurify(self);
  const { config, hooks } = parseNamedAttributes(attrs, domPurifyInstance);
  hooks.forEach(([hookName, fn]) => domPurifyInstance.addHook(hookName, fn));

  return htmlSafe(domPurifyInstance.sanitize(value, config));
}

export default helper(htmlSafer);
