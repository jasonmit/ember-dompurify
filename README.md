# ember-dompurify

[![npm Version][npm-badge]][npm]
[![Build Status](https://travis-ci.org/jasonmit/ember-dompurify.svg?branch=master)](https://travis-ci.org/jasonmit/ember-dompurify)

A wrapper around [DOMPurify](https://github.com/cure53/DOMPurify).

> DOMPurify sanitizes HTML and prevents XSS attacks. You can feed DOMPurify with string full of dirty HTML and it will return a string with clean HTML. DOMPurify will strip out everything that contains dangerous HTML and thereby prevent XSS attacks and other nastiness. It's also damn bloody fast. We use the technologies the browser provides and turn them into an XSS filter. The faster your browser, the faster DOMPurify will be.

## Installation

```sh
ember i ember-dompurify
```

## Helper usage


### Basic

```hbs
{{dom-purify '<img src="x" onerror=alert(1)>'}}
```

Returns an `Ember.String.htmlSafe` object:
```html
<img src="x">
```

### Advanced (custom stateful hooks)

DOMPurify exposes a number of useful hooks.  These hooks can be leveraged to initiate transforms on the HTML you are sanitizing, such as always inserting `target="_blank"` if the element type implements `target` (i.e., `HTMLAnchorElement`).

```js
// app/dompurify-hooks/target-blank.js (built-in but an example of the public API)
import { Hook } from 'ember-dompurify';

export default class TargetBlankHook extends Hook {
  afterSanitizeAttributes(node) {
    if (node instanceof HTMLAnchorElement) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener');
    }
  }
}
```

```hbs
{{dom-purify '<a src="https://google.com">Link</a>' hook='target-blank'}}
```

Result:

```html
<a src="https://google.com" target="_blank" rel="noopener">Link</a>
```

_Note_: Hooks can be combined (example: `{{dom-purify '<a src="https://google.com">Link</a>' hook='target-blank some-other-transform}}`)

### Built-in hooks

These are commonly used and bundled with ember-dompurify.  If you have other hooks you would like to add, please submit a PR or open an issue for a proposal.

```

#### target-blank

```hbs
{{dom-purify '<a src="https://google.com">Link</a>' hook='target-blank'}}
```

Result:

```html
<a src="https://google.com" target="_blank" rel="noopener">Link</a>
```

## API

```js
import createDOMPurify from 'ember-dompurify';

const dompurify = createDOMPurify(window);
dompurify.sanitize('<img src="x" onerror=alert(1)/>'); // -> type: String, result: `<img src="x">`
```

## Supported Helper Attributes

All DOMPurify options are supported, [DOMPurify options](https://github.com/cure53/DOMPurify#can-i-configure-it).

Example:
```hbs
{{dom-purify model.notes keep-content=true}}
```

Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-dompurify`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `npm test` – Runs `ember try:each` to test your addon against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md)

[npm]: https://www.npmjs.org/package/ember-dompurify
[npm-badge]: https://img.shields.io/npm/v/ember-dompurify.svg?style=flat-square
