js-template
=========

js-template is a powerful jQuery-based JavaScript templating framework. This project is an updated and modernized reincarnation of Google's excellent [JsTemplate project](http://code.google.com/p/google-jstemplate/).

js-template has unique features and expressive power not found in other client-side templating frameworks:

* Supported in practically all browsers (even back to IE6 & FF3), including mobile browsers
* Fully jQuery-ized
* Templates stay in HTML where they belong and are valid (X)HTML 
* Templates pull data from your JavaScript objects, including full object graphs
* Easy iteration over arrays, conditional display of elements, dynamically skip sub-branches, modify attribute values, set contextual variables, attach template processing callbacks, "transclude" child templates, and much more
* Processed templates are themselves templates and can be efficiently and repeatedly refilled
* Easy to integrate with other frameworks like Backbone.js

To familiarize yourself with the basic library and its usage, please read the original documentation at http://code.google.com/apis/jstemplate/docs/howto.html. Once you understand the basic concepts, refer to the following changes js-template.

Last but not least, most of the credit for the power behind js-template goes to Steffen Meschkat and the original committers from Google. My work has been mainly to modernize the core template engine API, integrate it with jQuery, and sprinkle some additional features to make it useful in everyday production work.

# How to use js-template

To use js-template in your page, you will need to do five things:

* Include jQuery in your page,
* Include js-template in your page,
* Represent the data you want to display as a JavaScript object,
* Define the template or templates that will display your data, and
* Write JavaScript to fill templates and display the results in your document


## Include jQuery in your page

Include the latest version of jQuery before loading js-template.


## Include js-template in your page

```
<script src="jquery.js-template-1.0.js" type="text/javascript"></script>
```


## JavaScript data

A template can be used to display any JavaScript object, or graph of JavaScript objects. The template attributes determine how the object is mapped to an HTML representation. For a real application, the data may initially come from the server, either as JSON data or in some other format that will need to be translated into a JavaScript object representation. For the sake of simplicity, the examples in this document will initialize the data for template processing on the client-side by setting a variable. 

Here is some sample data for the examples below:

```javascript
var favorites = {
  title: "Favorite Things", 
  favs: ["raindrops", "whiskers", "mittens"]
};
```

## Defining templates

Standard HTML is marked up as templates through the addition of special attributes to elements. A "template" is simply an HTML element on which at least one of these special attributes is defined, or an element containing descendants on which at least one of these attributes is defined. This approach has the advantage that all templates are valid (X)HTML and can be validated and processed by a variety of tools. 

Here is a simple template:

```html
<div id="template1">
  <h1 jst:content="title"></h1>
  <ul>
    <li jst:select="favs" jst:content="$this"></li>
  </ul>
</div>
```
   
We call element `#template` a "template" because its children have the js-template attributes `jst:content` and
`jst:select` as attributes.


## Template processing

We "fill" the template with this data like this:

```javascript
$("#template1").refillTemplate(favorites);
```

That's it! Here's how it works:

* The `jst:content='title'` attribute instructs the template processor to use the property `title` as the content for the `h1` element. 
* The `jst:select='favs'` attribute takes all the values of the `favs` array and iterates over them, copying the current element. 
* The `jst:content='$this'` attribute takes the current object of the iteration, in this case a string, and uses it as the content of the element.

The result of template processing is also a valid HTML template that preserves the attributes of the input template. Here is the result of processing the above template with our sample data:
  
```
<div jst:cache="0" id="t1">
  <h1 jst:cache="1" jst:content="title">Favorite Things</h1>
  <ul jst:cache="0">
    <li jst:instance="0" jst:cache="2" jst:select="favs" 
        jst:content="$this">raindrops</li>
    <li jst:instance="1" jst:cache="3" jst:select="favs" 
        jst:content="$this">whiskers</li>
    <li jst:instance="2" jst:cache="4" jst:select="favs" 
        jst:content="$this">mittens</li>
  </ul>
</div>
```

In other words, the output of template processing is just another template. This capability allows js-template to reprocess the same template multiple times, and it's smart enough to efficiently handle complicated changes to the data like inserts and deletes.

For example, a user might alter the underlying data by clicking a button, in which case we can immediately update the view by refilling the template:

```javascript
var favorites=...

$("button.my-button").click(function onMyButtonClick(event) {
  // Update the data
  favorites.favs.push("packages");

  // Refill the template
  $("#template1").refillTemplate(favorites);
});
```

Now the template becomes:

```html
  <div jst:cache="0" id="t1">
    <h1 jst:cache="1" jst:content="title">Favorite Things</h1>
    <ul jst:cache="0">
      <li jst:instance="0" jst:cache="2" jst:select="favs" 
          jst:content="$this">raindrops</li>
      <li jst:instance="1" jst:cache="3" jst:select="favs" 
          jst:content="$this">whiskers</li>
      <li jst:instance="2" jst:cache="4" jst:select="favs" 
          jst:content="$this">mittens</li>
      <li jst:content="$this" jst:select="favs" jst:cache="5" 
          jst:instance="3">packages</li>
    </ul>
  </div>
```

## More advanced templating

Template HTML can appear anywhere in your document where you want to display your data, and it can even contain placeholder values that will be overwritten during template processing. This is very useful for mocking up static pages with placeholder data that will get templatized and filled later.

A template can visibly appear in-place the page before it is processed, but it doesn't have to. If you will be reusing the same template in multiple places in a document, you can include a single hidden copy of the template and then use JavaScript to make new copies of its DOM node and place them in multiple locations. This way, templates become reusable components.

In this case, we use the `fillTemplate()` function instead of `refillTemplate()`. The return value of `fillTemplate()` is the root element of the cloned and filled template that must be attached to the DOM to be visible:

```html
<!-- A container to hide our templates -->
<div id="templates" style="display: none;">
  <div id="template1">
    <h1 jst:content="title"></h1>
  </div>
</div>
...
<!-- The element to which our template will be attached after filling -->
<div id="peg">
  <p>No content yet.</p>
</div>
```

```javascript
var favorites = ...

// Clone a template element and fill it. Returns an unattached DOM element.
var processedTemplate = $("#template1").fillTemplate(favorites);

// Attach it to the DOM
$("#peg")
  .empty()
  .append(processedTemplate);
```

One note about the `fillTemplate()` function: In the example above, the template contained an `id` attribute, which the HTML spec tell us must be unique with the entire DOM. Therefore, when cloning the template element, `fillTemplate()` removes any `id` attributes in the template so that the resulting template can then be attached to the DOM without causing problems. (See the documentation on the `jst:id` and `jst:idexpr` attributes for more information on providing a filled template with an `id` attribute.)

Later, if you want to refill the already-placed template, you can just use `refillTemplate()` on `#peg`:

```javascript
var favorites = ...;

favorites.favs.push("monkeys");

$("peg")
  .refillTemplate(favorites);
```

Of course, you don't have to refill a template with the same object it was originally filled with. You can make a copy of the data or use new data (say from an AJAX call) and refill just like above. The template will intelligently figure out the diffs in the data and display it properly.






# Changes from the original JsTemplate project

### Namespacing

I've put all the original JsTemplate code into the `GOOGLE.templates` namespace to avoid global namespace pollution.

### Added new public methods

I've added several public methods to the `GOOGLE.templates` namespace to make using the raw JsTemplate engine easier. However, these methods should not normally be used by the application in favor of using jQuery integration instead. If interested, you can see these methods in the source.

### jQuery integration

I've integrated the original engine into a properly namespaced jQuery plugin called `jquery-js-template`, with a much simplified interface. It is now possible to use the standard jQuery `$(...)` selector syntax to find and process templates.

### $(...).refillTemplate()

```javascript
$(<selector for template DOM element(s)>).refillTemplate(data, [parentData]);
```

Merges (and re-merges) template data with the selected template DOM node. The template DOM node will not be cloned; this merging occurs in-place. Data can be merged repeatedly and js-template will find the differences and modify the DOM tree accordingly. It is preferable to use this technique, including in-place templates, because it allows for fast, real-time updates without cloning or destroying large segments of the DOM.

The data parameter is a normal JavaScript object whose properties will be used to fill the template with data. (Note, the value of this parameter will automatically be wrapped in a `JsContext` instance for use by JsTemplate if needed.)

The `parentData` parameter is shared data that may be used as a secondary lookup. See the original JsTemplate documentation on advanced usage (http://code.google.com/apis/jstemplate/docs/advanced.html).

The return value is the processed template's DOM element. This element already exists in the DOM and any changes as a result of merging the data have already been rendered by the browser.

### $(...).fillTemplate()

```javascript
$(<selector for template DOM element>).fillTemplate(data, [parentData]);
```

Clones the template and merges the data. The return value of the method (the cloned DOM element) must be attached somewhere in the DOM to make the processed template visible.  This method should be used when the template is stored in a separate DOM node that will be cloned and attached elsewhere in the DOM as needed. In general, it's preferable to use `refillTemplate()` when possible because it allows data to be merged repeatedly to the same DOM elements.

The data parameter is a normal JavaScript object whose properties will be used to fill the template with data. (Note, the value of this parameter will automatically be wrapped in a `JsContext` instance for use by JsTemplate if needed.)

The `parentData` parameter is shared data that may be used as a secondary lookup. See the original JsTemplate documentation on advanced usage (http://code.google.com/apis/jstemplate/docs/advanced.html).

The return value is the processed and cloned template's DOM element. It must be attached to the DOM in order to be visible.

### JsTemplate Attributes

I found the original JsTemplate API difficult to use and remember (in addition to being non-XHTML compliant by polluting the HTML attribute namespace), so I've renamed key attributes and methods to make them more meaningful and stylistically consistent.

First, all template-specific HTML attributes (like `jscontent` and `jsselect`) have been properly namespaced. JsTemplate will now not discover template attributes without a proper namespace declaration. The default namespace (without a namespace declaration in the HTML document) is `jst`. Although using an alternative namespace is theoretically possible, it seems to be infeasible to discover what namespace is being used in Internet Explorer 8 or below, so for now, use the standard namespace of `jst`.

To declare the JsTemplate namespace, attach the following attribute to the `<html>` or `<body>` element of the document:

```html
<html xmlns:jst="http://code.google.com/p/google-jstemplate/">
```

The usage of these attributes then looks like the following:

```html
<div jst:select="someArray"><span jst:content="foo">Future value of foo</span></div>
```

Here is a summary of all the JsTemplate attributes:

#### `jst:content`

Was `jscontent`. No changes. See original documentation

#### `jst:select`

Was `jsselect`. No changes. See original documentation

#### `jst:if`

Was `jsdisplay`. No changes. See original documentation.

#### `jst:include`

Was `transclude`. No changes. See original documentation.

#### `jst:values`

Was `jsvalues`. Syntax has changed. Now, the pipe ("|") character is the expression separator rather than semicolon (";"), and the name/value separator is now equals ("=") rather than colon (":"). Example: `<option jst:values="value=$index|selected=($index===0)" ... >`.

#### `jst:vars`

Was `jsvars`. Same syntax change for `jst:values` noted above.

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

Example:

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
