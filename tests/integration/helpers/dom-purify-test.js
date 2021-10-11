import { module, test } from 'qunit';
import { htmlSafe } from '@ember/string';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'ember-qunit';
import createPurify, { Hook } from 'ember-dompurify';

module('Integration | Helper | dom-purify', function (hooks) {
  setupRenderingTest(hooks);

  test('it exports the documented API', function (assert) {
    assert.ok(typeof createPurify, 'function');
    assert.ok(typeof Hook, 'function');
  });

  test('it can pass through content without DOM nodes', async function (assert) {
    this.set('input', '1234');
    await render(hbs`{{dom-purify this.input}}`);

    assert.equal(this.element.innerHTML.trim(), '1234');
  });

  test('it strips out potential security risks', async function (assert) {
    await render(hbs`{{dom-purify '<img src=x onerror=alert(1) />'}}`);

    assert.dom('img').hasAttribute('src', 'x');
    assert.dom('img').doesNotHaveAttribute('onerror');
  });

  test('it unpacks safe strings', async function (assert) {
    this.set('input', htmlSafe('<img src=x onerror=alert(1) />'));
    await render(hbs`{{dom-purify this.input}}`);

    assert.dom('img').hasAttribute('src', 'x');
    assert.dom('img').doesNotHaveAttribute('onerror');
  });

  test('it resets state between runs', async function (assert) {
    this.owner.register('dompurify-hook:noop', class EmptyHook extends Hook {});
    this.set('hookName', 'target-blank');

    await render(hbs`{{dom-purify '<a>Link</a>' hook=this.hookName}}`);

    assert.dom('a').hasAttribute('target', '_blank');
    assert.dom('a').hasAttribute('rel', 'noopener');

    this.set('hookName', 'noop');

    assert.dom('a').doesNotHaveAttribute('target');
    assert.dom('a').doesNotHaveAttribute('rel');
  });

  module('accepting dompurify options', function () {
    test('it accepts options in their original format', async function (assert) {
      await render(hbs`
        {{dom-purify '<img src=x data-srcset="foobar" />' ALLOW_DATA_ATTR=false}}
      `);

      assert.equal(this.element.innerHTML.trim(), '<img src="x">');
    });

    test('it can normalize dasherized options', async function (assert) {
      await render(hbs`
        {{dom-purify '<img src=x data-srcset="foobar" />' allow-data-attr=false}}
      `);

      assert.dom('img').hasAttribute('src', 'x');
      assert.dom('img').doesNotHaveAttribute('data-srcset');
    });

    test('it can normalize `camelCase` options', async function (assert) {
      await render(hbs`
        {{dom-purify '<img src=x data-srcset="foobar" />' allowDataAttr=false}}
      `);

      assert.dom('img').hasAttribute('src', 'x');
      assert.dom('img').doesNotHaveAttribute('data-srcset');
    });
  });

  module('invoking hooks', function () {
    test('receiving a function for a specific hook', async function (assert) {
      assert.expect(2); /* once for src, once for onerror */
      this.set('uponSanitizeAttribute', () => assert.ok(true));

      await render(hbs`
        {{dom-purify '<img src="x" onerror=alert(1) />' uponSanitizeAttribute=this.uponSanitizeAttribute}}
      `);
    });

    test('receiving a class of hooks', async function (assert) {
      assert.expect(10);

      this.set(
        'hook',
        class AssertionHook extends Hook {
          beforeSanitizeAttributes() {
            assert.ok(true);
          }

          afterSanitizeAttributes() {
            assert.ok(true);
          }

          beforeSanitizeShadowDOM() {
            assert.ok(true);
          }

          uponSanitizeShadowNode() {
            assert.ok(true);
          }

          afterSanitizeShadowDOM() {
            assert.ok(true);
          }

          beforeSanitizeElements() {
            assert.ok(true);
          }

          afterSanitizeElements() {
            assert.ok(true);
          }

          uponSanitizeAttribute() {
            assert.ok(true);
          }

          uponSanitizeElement(el) {
            if (!(el instanceof self.HTMLAnchorElement)) return;

            assert.ok(true);
            assert.ok(this instanceof AssertionHook);
          }
        }
      );

      await render(hbs`{{dom-purify '<a>' hook=this.hook}}`);
    });
  });

  module('hooks in the registry', function () {
    test('it can combine hooks', async function (assert) {
      await render(hbs`
        {{dom-purify '<a src="http://google.com">Link</a>' hook='target-blank class-adder'}}
      `);

      assert.dom('a').hasAttribute('target', '_blank');
      assert.dom('a').hasAttribute('rel', 'noopener');
      assert.dom('a').hasAttribute('class', 'foobar');
    });
  });

  test('it can handle falsey values passed in', async function (assert) {
    this.set('input', undefined);
    await render(hbs`{{dom-purify this.input}}`);

    [undefined, null, false, ''].forEach((input) => {
      this.set('input', input);
      assert.equal(this.element.innerHTML.trim(), '');
    });
  });
});
