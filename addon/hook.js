export default class Hook {
  constructor(_purify) {
    this._purify = _purify;
    this._setup();
  }

  /** @private **/
  _setup() {
    this._purify.addHook('beforeSanitizeElements', this.beforeSanitizeElements.bind(this));
    this._purify.addHook('uponSanitizeElement', this.uponSanitizeElement.bind(this));
    this._purify.addHook('afterSanitizeElements', this.afterSanitizeElements.bind(this));
    this._purify.addHook('beforeSanitizeAttributes', this.beforeSanitizeAttributes.bind(this));
    this._purify.addHook('uponSanitizeAttribute', this.uponSanitizeAttribute.bind(this));
    this._purify.addHook('afterSanitizeAttributes', this.afterSanitizeAttributes.bind(this));
    this._purify.addHook('beforeSanitizeShadowDOM', this.beforeSanitizeShadowDOM.bind(this));
    this._purify.addHook('uponSanitizeShadowNode', this.uponSanitizeShadowNode.bind(this));
    this._purify.addHook('afterSanitizeShadowDOM', this.afterSanitizeShadowDOM.bind(this));
  }

  /** @public **/
  beforeSanitizeElements() {}

  /** @public **/
  uponSanitizeElement() {}

  /** @public **/
  afterSanitizeElements() {}

  /** @public **/
  beforeSanitizeAttributes() {}

  /** @public **/
  uponSanitizeAttribute() {}

  /** @public **/
  afterSanitizeAttributes() {}

  /** @public **/
  beforeSanitizeShadowDOM() {}

  /** @public **/
  uponSanitizeShadowNode() {}

  /** @public **/
  afterSanitizeShadowDOM() {}
}
