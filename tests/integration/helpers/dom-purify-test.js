import { module, test } from 'qunit';
import { htmlSafe } from '@ember/string';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'ember-qunit';
import createPurify, { Hook } from 'ember-dompurify';

module('Integration | Helper | dom-purify', function(hooks) {
  setupRenderingTest(hooks);

  test('it exports the documented API', function(assert) {
    assert.ok(typeof createPurify, 'function');
    assert.ok(typeof Hook, 'function');
  });

  test('it returns the passed-in content', async function(assert) {
    this.set('input', '1234');
    await render(hbs`{{dom-purify input}}`);

    assert.equal(this.element.innerHTML.trim(), '1234');
  });

  test('it strips out potential security risks', async function(assert) {
    await render(hbs`{{dom-purify '<img src=x onerror=alert(1) />'}}`);

    assert.equal(this.element.innerHTML.trim(), '<img src="x">');
  });

  test('it unpacks safe strings', async function(assert) {
    this.set('input', htmlSafe('<img src=x onerror=alert(1) />'));
    await render(hbs`{{dom-purify input}}`);

    assert.equal(this.element.innerHTML.trim(), '<img src="x">');
  });

  test('it accepts dompurify options (normalized)', async function(assert) {
    await render(
      hbs`{{dom-purify '<img src=x data-srcset="foobar" />' allow-data-attr=false}}`
    );

    assert.equal(this.element.innerHTML.trim(), '<img src="x">');
  });

  test('it resets state between runs', async function(assert) {
    this.owner.register('hook:noop', class EmptyHook extends Hook {});
    this.set('hookName', 'target-blank');

    await render(hbs`{{dom-purify '<a>Link</a>' hook=hookName}}`);
    assert.equal(
      this.element.innerHTML.trim(),
      '<a target="_blank" rel="noopener">Link</a>'
    );

    this.set('hookName', 'noop');
    assert.equal(this.element.innerHTML.trim(), '<a>Link</a>');
  });

  test('it accepts dompurify options', async function(assert) {
    await render(
      hbs`{{dom-purify '<img src=x data-srcset="foobar" />' ALLOW_DATA_ATTR=false}}`
    );

    assert.equal(this.element.innerHTML.trim(), '<img src="x">');
  });

  test('it invokes hooks', async function(assert) {
    assert.expect(2); /* once for src, once for onerror */
    this.set('uponSanitizeAttribute', () => assert.ok(true));

    await render(
      hbs`{{dom-purify '<img src="x" onerror=alert(1) />' uponSanitizeAttribute=uponSanitizeAttribute}}`
    );
  });

  test('it accepts a hook', async function(assert) {
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

    await render(hbs`{{dom-purify '<a>' hook=hook}}`);
  });

  test('it can transform elements', async function(assert) {
    assert.expect(1);

    this.set(
      'hook',
      class AttributeBlankHook extends Hook {
        afterSanitizeAttributes(node) {
          if ('target' in node) {
            node.setAttribute('target', '_blank');
          }
        }
      }
    );

    await render(
      hbs`{{dom-purify '<a src="http://google.com">Link</a>' hook=hook}}`
    );
    assert.equal(
      this.element.innerHTML.trim(),
      '<a src="http://google.com" target="_blank">Link</a>'
    );
  });

  test('it can combine hooks', async function(assert) {
    await render(
      hbs`{{dom-purify '<a src="http://google.com">Link</a>' hook='target-blank class-adder'}}`
    );

    assert.equal(
      this.element.innerHTML.trim(),
      '<a src="http://google.com" target="_blank" rel="noopener" class="foobar">Link</a>'
    );
  });

  test('it can handle falsey values passed in', async function(assert) {
    this.set('input', undefined);
    await render(hbs`{{dom-purify input}}`);

    [undefined, null, false, ''].forEach(input => {
      this.set('input', input);
      assert.equal(this.element.innerHTML.trim(), '');
    });
  });
});
