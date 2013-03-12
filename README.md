js-template
=========

JsTemplate (http://code.google.com/p/google-jstemplate/) is a client-side JavaScript templating framework originally developed by Google. It has unique features such as the ability for authors to write templates in valid (X)HTML, and the ability to repeatedly (re)fill templates by determining and managing diffs to previously rendered template instances.
   
The original JsTemplate appears to no longer be under active development, and uses a number of undesirable patterns. I've updated and adapted the library in a number of ways described below.

To familiarize yourself with the basic library and its usage, please read the original documentation at http://code.google.com/apis/jstemplate/docs/howto.html. Once you understand the basic concepts, refer to the following changes for our version:

## Changes to JsTemplate

### Namespacing

I've put all the original JsTemplate code into the `GOOGLE.templates` namespace to avoid global collisions.

###Added new public methods

I've added several public methods to the `GOOGLE.templates` namespace to make using JsTemplate easier. However, these methods should not normally be used by the application in favor of using the jQuery integration instead. If interested, you can see these methods in the source.

### jQuery integration

I've integrated into a properly namespaced jQuery plugin called `jquery-googlejst`, with a much simplified interface. It is now possible to use the standard ~$(...)~ selector syntax to find and process embedded templates.

### refillTemplate()

```javascript
$(<selector for template DOM element>).refillTemplate(data, [parentData]);
```

Merges (and re-merges) template data with the selected template DOM node. The template DOM node will not be cloned; this merging occurs in-place. Data can be merged repeatedly and JsTemplate will find the differences and modify the DOM tree accordingly. It is preferable to use this technique, including in-place templates, because it allows for fast, real-time updates without cloning or destroying large segments of the DOM.

The data parameter is a normal JavaScript object whose properties will be used to fill the template with data. (Note, the value of this parameter will automatically be wrapped in a JsContext instance for use by JsTemplate if needed.)

The parentData parameter is shared data that may be used as a secondary lookup. See the original JsTemplate documentation on advanced usage (http://code.google.com/apis/jstemplate/docs/advanced.html).

The return value is the processed template's DOM element. This element already exists in the DOM and any changes as a result of merging the data have already been rendered by the browser.

### fillTemplate()

```javascript
$(<selector for template DOM element>).fillTemplate(data, [parentData]);
```

Clones the template and merges the data. The return value of the method (the cloned DOM element) must be attached somewhere in the DOM to make the processed template visible.  This method should be used when the template is stored in a separate DOM node that will be cloned and attached elsewhere in the DOM as needed. In general, it's preferable to use refillTemplate() when possible because it allows data to be merged repeatedly to the same DOM elements.

The data parameter is a normal JavaScript object whose properties will be used to fill the template with data. (Note, the value of this parameter will automatically be wrapped in a JsContext instance for use by JsTemplate if needed.)

The `parentData` parameter is shared data that may be used as a secondary lookup. See the original JsTemplate documentation on advanced usage (http://code.google.com/apis/jstemplate/docs/advanced.html).

The return value is the processed and cloned template's DOM element. It must be attached to the DOM in order to be visible.

### JsTemplate Attributes

I found the original JsTemplate API difficult to use and remember (in addition to being non-XHTML compliant by polluting the HTML attribute namespace), so I've renamed key attributes and methods to make them more meaningful and stylistically consistent.

First, all template-specific HTML attributes (like `jscontent` and `jsselect`) have been properly namespaced. JsTemplate will now not discover template attributes without a proper namespace declaration. The default namespace (without a namespace declaration in the HTML document) is "jst". Although using an alternative namespace is theoretically possible, it seems to be infeasible to discover what namespace is being used in Internet Explorer 8 or below, so for now, use the standard namespace of "jst".

To declare the JsTemplate namespace, attach the following attribute to the `<html>` or `<body>` element of the document:

```html
<html xmlns:jst="http://code.google.com/p/google-jstemplate/">
```

The usage of these attributes then looks like the following:
```html
<div jst:select="someArray"><span jst:content="foo">Future value of foo</span></div>
```

Here is a summary of all the JsTemplate attributes:

#### `jst:content` (was `jscontent`)

No changes. See original documentation

### `jst:select` (was `jsselect`)

No changes. See original documentation

#### `jst:if` (was `jsdisplay`)

No changes. See original documentation.

#### `jst:include` (was `transclude`)

No changes. See original documentation.

`jst:values` (was `jsvalues`)

Syntax has changed. Now, the pipe ("|") character is the expression separator rather than semicolon (";"), and the name/value separator is now equals ("=") rather than colon (":"). Example: `<option jst:values="value=$index|selected=($index===0)" ... >`.

#### `jst:vars` (was `jsvars`)

Same syntax change for `jst:values` noted above.

#### `jst:eval`
Was `jseval`. No changes. See original documentation.

#### `jst:skip`
Was `jsskip`. No changes. See original documentation.

#### `jst:id`

Allows template nodes to specify the "id" attribute they should have after processing. This attribute is useful when templates will be cloned from the existing DOM and so should not have an ID that is already present in the original template. This attribute should always be used instead of the "id" attribute for descendent nodes of the top-level template container. (The top-level template container should have an "id" attribute so that it can be found and processed; this ID is always removed when the template is cloned.)

Note that `jst:values` can also be used to set the element's ID attribute, but this attribute helps simplify the use of jst:values for this common use case.

#### `jst:idexpr`

Similar to `jst:id`, but eval's the attribute value as an expression. This attribute can be used to dynamically generate ID values based on context data, `$index` iteration value, etc.

Note that `jst:values` can also be used to set the element's `id` attribute, but this attribute helps simplify the use of `jst:values` for this common use case.

Examples:

```html
<html ... xmlns:jst="http://code.google.com/p/google-jstemplate/">
...
<!-- This is the template, denoted by the attributes in the jst: namespace -->
<div id="user" style="display:none">
    User <span jst:content="userName"></span>
    <ul>
      <li>ID: <span jst:content="id">Loading...</span></li>
      <li>Timestamp: <span jst:content="created">Loading...</span></li>
      <li>Gender: <span jst:content="gender">Loading...</span></li>
    </ul>
</div>

<script type="text/javascript">
function someFunction() {
    var data={
        userName: "Todd",
        id: 1,
        created: "Tue Mar 3, 2010 19:04:23",
        gender: "Male"
    };
    
    // Merge the data with the template and show it
    $("#user").refillTemplate(data);
}
</script>
...
</html>
```
