js-template
===========

*js-template* is a powerful browser-side templating framework for jQuery + HTML5. It is an updated and modernized reincarnation of Google's excellent open-source [JsTemplate project](http://code.google.com/p/google-jstemplate/).

*js-template* has unique features and expressive power not found in other JavaScript templating frameworks:

* Templates stay in HTML where they belong! No funky syntax to learn—templates are valid HTML5.
* Both pre- and post-processed templates will validate.
* Fully jQuery-ized.
* Killer capabilities:
  * Reprocess templates again and again as data changes
  * Use JavaScript expressions to derive displayable content
  * Iterate easily over arrays
  * Conditionally display or skip elements
  * Modify DOM attributes
  * Use contextual variables during processing
  * Attach function callbacks
  * "transclude" child templates
  * and much more.
* Easy to integrate with other frameworks like Backbone.js
* Supported in practically all browsers (even back to IE6 & FF3), including mobile browsers
* Unmatched power weighing in at only ~10.5KB minified and ~3.5KB gzipped

Here is a simple *js-template* template in an HTML page:

```html
<html>
    <body>
        <p id="myTemplate">Hello, <span data-jst-content="who">nobody</span>!</p>
    </body>
</html>
```

Just loading the page, it looks like this:

```html
Hello, nobody!
```

Now you're ready to fill the template with data, like this:

```javascript
var data = { who: "World" };
$("#myTemplate").refillTemplate(data);
```

which results in:

```html
Hello, World!
```

And filled templates remain valid templates. You can just refill them again when the data changes:

```javascript
data.who = "dude";
$("#myTemplate").refillTemplate(data);
```

which results in:

```html
Hello, dude!
```


#### Credit where credit is due

Credit for the power behind *js-template* goes to Steffen Meschkat and the original JsTemplate committers at Google. My work has been mainly to modernize the core template engine API, integrate it with jQuery, fix some bugs, and sprinkle some additional features in to make it useful in everyday production work.



# Getting started

To use *js-template* in your page, you will need to do five things:

1. Include jQuery in your page,
1. Include *js-template* in your page,
1. Define your data in JavaScript,
1. Define your templates in HTML, and
1. Process the templates to fill them with data


## 1. Include jQuery in your page

Include the latest version of jQuery 1.x before loading *js-template*. For example (using the CDN version):

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js" type="text/javascript"></script>
```


## 2. Include *js-template* in your page

```html
<script src="jquery.js-template-1.0.js" type="text/javascript"></script>
```

## 3. Define your data in JavaScript

A template can be used to display any JavaScript object, or graph of JavaScript objects. The template attributes determine how the object is mapped to an HTML representation.

For a real application, the data may initially come from the server, either as JSON data or in some other format that will need to be translated into a JavaScript object representation. For the sake of simplicity, the examples in this document will initialize the data for template processing on the client-side by setting a variable. 

Here is some sample data for the examples below:

```javascript
var favorites = {
  title: "Favorite Things", 
  favs: ["raindrops", "whiskers", "mittens"]
};
```

## 4. Define your templates in HTML

Standard HTML is marked up as templates through the addition of special attributes to elements. A "template" is simply an HTML element on which at least one of these special attributes is defined, or an element containing descendants on which at least one of these attributes is defined. This approach has the advantage that all templates are valid (X)HTML and can be validated and processed by a variety of tools. 

Here is a simple template:

```html
<div id="template1">
  <h1 data-jst-content="title"></h1>
  <ul>
    <li data-jst-select="favs" data-jst-content="$this"></li>
  </ul>
</div>
```
   
We call element `#template` a "template" because its children have the *js-template* attributes `data-jst-content` and
`data-jst-select` as attributes.


## 5. Process the templates

We fill a template with data like this:

```javascript
$("#template1").refillTemplate(favorites);
```

That's it! Here's how it works:

* The `data-jst-content='title'` attribute instructs the template processor to use the property `title` as the content for the `h1` element. 
* The `data-jst-select='favs'` attribute takes all the values of the `favs` array and iterates over them, copying the current element. 
* The `data-jst-content='$this'` attribute takes the current object of the iteration, in this case a string, and uses it as the content of the element.

The result of template processing is also a valid HTML template that preserves the attributes of the input template. Here is the result of processing the above template with our sample data:
  
```html
<div id="template1">
  <h1 data-jst-content="title">Favorite Things</h1>
  <ul>
    <li data-jst-select="favs" data-jst-content="$this">raindrops</li>
    <li data-jst-select="favs" data-jst-content="$this">whiskers</li>
    <li data-jst-select="favs" data-jst-content="$this">mittens</li>
  </ul>
</div>
```

(If you run this example in the browser, you'll see some additional attributes, like `data-jst-__cache` and `data-jst-__instance`, which were added by the template processor to track reprocessing of the template. These low-level implementation details have been elided here, and you can ignore them.)

**All this is to say that the output of template processing is just another template!** This capability allows *js-template* to reprocess the same template multiple times, and it's smart enough to efficiently handle complicated changes to the data like inserts and deletes.

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
<div id="template1">
  <h1 data-jst-content="title">Favorite Things</h1>
  <ul>
    <li data-jst-select="favs" data-jst-content="$this">raindrops</li>
    <li data-jst-select="favs" data-jst-content="$this">whiskers</li>
    <li data-jst-select="favs" data-jst-content="$this">mittens</li>
    <li data-jst-select="favs" data-jst-content="$this">packages</li>
  </ul>
</div>
```


## More advanced templating

#### Placeholder values

Template HTML can appear anywhere in your document where you want to display your data, and it can even contain placeholder values that will be overwritten during template processing. This is very useful for mocking up static pages with placeholder data that will get templatized and filled later:

```html
<div id="template">
  <!-- "Loading data..." will be replaced with the value of someData -->
  <p data-jst-content="someData">Loading data...</p>
</div>
```

#### In-place vs. cloned templates

A template can visibly appear in-place, anywhere in the page, before it is processed, but it doesn't have to. If you will be reusing the same template in multiple places in a document, you can include a single hidden copy of the template and then use JavaScript to make new copies of its DOM node and place them in multiple locations. This way, templates become reusable components.

In this case, we use the `fillTemplate()` function instead of `refillTemplate()`. The return value of `fillTemplate()` is the root element of the cloned and filled template that must be attached to the DOM to be visible:

```html
<!-- A container to hide our templates -->
<div id="templates" style="display: none;">
  <div id="template1">
    <h1 data-jst-content="title"></h1>
  </div>
</div>
...
<!-- The element to which our template will be attached after filling -->
<div id="container">
  <p>No content yet.</p>
</div>
```

```javascript
var favorites = ...

// Clone a template element and fill it. Returns an unattached DOM element.
var processedTemplate = $("#template1").fillTemplate(favorites);

// Attach it to the DOM
$("#container")
  .empty() // Remove the child <p>
  .append(processedTemplate);
```

One note about the `fillTemplate()` function: In the example above, the template contained an `id` attribute, which the HTML spec tell us must be unique with the entire DOM. Therefore, when cloning the template element, `fillTemplate()` removes any `id` attributes in the template so that the resulting template can then be attached to the DOM without causing problems. (See the documentation on the `data-jst-id` and `data-jst-idexpr` attributes for more information on providing a filled template with an `id` attribute.)

Later, if you want to refill the already-placed template, you can just use `refillTemplate()` on `#container`:

```javascript
var favorites = ...;

favorites.favs.push("monkeys");

$("container")
  .refillTemplate(favorites);
```

Of course, you don't have to refill a template with the same object it was originally filled with. You can make a copy of the data or use new data (say from an AJAX call) and refill just like above. The template will intelligently figure out the diffs in the data and display it properly.


# Reference

There are four primary jQuery methods in *js-template*:

* `refillTemplate()`
* `fillTemplate()`
* `templateCallback()`
* `removetemplateCallback()`

The processing instructions that define the results of template processing are encoded as attributes in template HTML elements: 

* `data-jst-content`
* `data-jst-select`
* `data-jst-if`
* `data-jst-skip`
* `data-jst-show`
* `data-jst-hide`
* `data-jst-include`
* `data-jst-values`
* `data-jst-vars`,
* `data-jst-eval`
* `data-jst-id`
* `data-jst-idexpr`
* `data-jst-overwrite`
* `data-jst-data`


## jQuery methods

### refillTemplate()

```javascript
$(<selector for template DOM element(s)>).refillTemplate(data [,parentData]);
```

Merges (and re-merges) template data with the selected template DOM node. The template DOM node will not be cloned; this merging occurs in-place. Data can be merged repeatedly and *js-template* will efficiently find the differences and modify the DOM tree accordingly. It is preferable to use this technique because it allows for fast, real-time updates without cloning or destroying large segments of the DOM.

* The `data` parameter is a normal JavaScript object whose properties will be used to fill the template with data.
* The `parentData` parameter is shared data that may be used as a secondary lookup.
* The return value is the processed template's DOM element. This element already exists in the DOM and any changes as a result of merging the data have already been rendered by the browser.


### fillTemplate()

```javascript
$(<selector for template DOM element>).fillTemplate(data [,parentData]);
```

Clones the template, including all its event handlers, and merges the data. The return value of the method (the cloned DOM element) must be attached somewhere in the DOM to make the processed template visible.

* The `data` parameter is a normal JavaScript object whose properties will be used to fill the template with data.
* The `parentData` parameter is shared data that may be used as a secondary lookup.
* The return value is the processed and cloned template's DOM element. It must be attached to the DOM in order to be visible.

This method should be used when the template is stored in a separate DOM node that will be cloned and attached elsewhere in the DOM as needed. In general, it's preferable to use `refillTemplate()` when possible because it allows data to be merged repeatedly to the same DOM elements.

#### Handling of `id` attributes

When cloning a template element, `fillTemplate()` removes any `id` attributes in the cloned template so that it can then be attached to the DOM without causing `id` conflicts (in HTML, only one element can have a unique `id` value within the DOM). See the documentation on the `data-jst-id` and `data-jst-idexpr` attributes for more information on providing a cloned template with an `id` attribute.

#### Cloned event handlers

Because cloned templates retain all of their attached event handlers and callback functions, you can efficiently attach event handlers to the template once in $(document).ready() and those event handlers will then be used for all instances of the template.

For example, let's say we have a page like this:

```html
<div id="container">
</div>

<!-- A hidden container for all our templates -->
<div id="templates" style="display: none;">
  <a id="template1" href="javascript:void(0);">Click me!</a>
</div>

<script type="text/javascript">
$(document).ready(function() {
  // Attach an event handler to the template
  $("#template1").click(function onTemplateClick(event) {
    console.log("Clicked element: ",this);
  });

// The new template will have the onclick event handler defined above
$("#template1")
  .fillTemplate()
  .appendTo("#container");

// This one too
$("#template1")
  .fillTemplate()
  .appendTo("#container");
});
</script>
```
Loading the page results in this DOM structure:

```html
<div id="container">
  <a href="javascript:void(0);">Click me!</a>
  <a href="javascript:void(0);">Click me!</a>
</div>

<!-- A hidden container for all our templates -->
<div id="templates" style="display: none;">
  <a id="template1" href="javascript:void(0);">Click me!</a>
</div>
```
and each of the child `a` elements in `#container` will have the same `onclick` event that was bound to `#template1`, which when fired, will log the element that was clicked (available via `this` in the event handler) to the console.


### templateCallback()

```javascript
$(<selector for template DOM element>).templateCallback(data [,parentData]);
```

Template callbacks are functions that are called as the corresponding nodes in the template are processed. They are extermely useful for tracking template processing from your page's script, for example inspecting data, modifying template processing, setting attributes and data, and so on.

```html
<div id="template">
  <div class="row" data-jst-select="favs" data-jst-content="$this"></div>
</div>
```
```javascript
function onRowProcessed(vars, data) {
  $(this)
    .data("index",vars.$index)
    .data("fave",data);
}

$(document).ready(function () {
  $("#template .row").templateCallback(onRowProcessed)
});
```

A callback function is called with the following environment:

* `this` is a reference to the current DOM element being processed
* The `vars` parameter is an object containing all the variables available to `data-jst-vars` (and `data-jst-values`) attribute expressions. See the **Template processing environment** section below for the list of available variables.
* The `data` parameter contains the current data value being processed for this node. It is the same object as the `$this` variable used inside the template, or the `vars.$this` property in the callback.

Only a single template callback function can be attached to any given element at a time.

### removeTemplateCallback()

```javascript
$(<selector for template DOM element>).removeTemplateCallback();
```

Detaches the template callback function from the selected elements so that it will no longer be called during template processing.


## Template processing environment

With the exception of the `data-jst-include` instruction, the values of all *js-template* attributes will contain JavaScript expressions. These expressions will be evaluated in an environment that includes the following:

* `this`: Evaluates to the element on which the attribute is defined. In this respect *js-template* attributes mirror event handler attributes like `onclick`. 
* `$this`: The current context data object used in processing the current node
* `$index`: The current index of the array being iterated over during `data-jst-select` processing
* `$length`: The length of the current array being iterated over during `data-jst-select` processing
* `$top`: The top data context, i.e. the object that was passed to `(re)fillTemplate()`
* `$context`: The root instance of `JsContext` being used for template processing. (Advanced topic; see source code for more info)

So if you have the template:

```html
<div id="witha">
  <div id="Hey" data-jst-content="this.parentNode.id + this.id + dataProperty + $this.dataProperty + declaredVar"
  ></div>
</div> 
```
and you process it with the statements

```javascript
var mydata = {dataProperty: "Nonny"};
var context = {declaredVar, "Ho"};
$("#witha").refillTemplate(mydata,context);
```
then the document will display the string "withaHeyNonnyNonnyHo". The values of `id` and `parentNode.id` are available as properties of the current node (accessible through the keyword `this`), the value of `dataProperty` is available (via both a naked reference and the special variable `$this`) because it is defined in the context data object, and the value of `declaredVar` is available because it is defined in the context's variables.


## Template attributes

In the discussion of specific template processing instruction attributes below, the phrase "current node" refers to the DOM element on which the attribute is defined.


### data-jst-content

This attribute is evaluated as a JavaScript expression in the current processing environment. The string value of the result then becomes the text content of the current node. So this template:

```html
<div id="template"> Welcome 
  <span data-jst-content="$this">
   (This placeholder name will be replaced by the actual username.) 
  </span>
</div> 
```
when processed with the JavaScript statements:

```javascript
var data = "Joe User";
$("#template").refillTemplate(data);
```
will display "Welcome Joe User" in the browser. Note the use of `$this` here: the `refillTemplate()` function is passed the string "Joe User", and so this is the object to which `$this` refers.

When the template processor executes a `data-jst-content` instruction, a new text node object is created with the string value of the result as its `nodeValue`, and this new text node becomes the only child of the current node. This implementation ensures that no markup in the result is evaluated.


### data-jst-overwrite

Default behavior for the `data-jst-content` attribute is to clear all text content from a node when the corresponding expression evaluations to `null` or `undefined`. By setting `data-jst-overwrite=false`, existing content will not be overwritten in such a case. Setting `data-jst-overwrite=true` is the same as omitting this attribute and relying on the default behavior.


### data-jst-select

The primary function of *js-template* is to create mappings between data structures and HTML representations of those data structures. The `data-jst-select` attribute handles much of the work of defining this mapping by allowing you to associate a particular subtree of the data with a particular subtree of the template's DOM structure.

When a template node with a `data-jst-select` attribute is processed, the value of the `data-jst-select` attribute is evaluated as a JavaScript expression in the current processing environment, as described above. If the result of this evaluation is not an array, the template processor automatically creates a new context to wrap the result of the evaluation. The processing environment for the current node now uses this new context rather than the original context.

For example, imagine that you have the following data object:

```javascript
var data = { 
  username:"Jane User", 
  addresses: [{
    location:"111 8th Av.",
    label:"NYC front door"
  },
  {
    location:"76 9th Av.",
    label:"NYC back door"
  },
  {
    location:"Mountain View",
    label:"Mothership"
  }]
}; 
```
and you use this data in processing the template:

```html
<div id="template">
  <span data-jst-select="username" data-jst-content="$this"></span>'s Address Book
</div> 
```

The `data-jst-select` attribute tells the processor to retrieve the `username` property of the data object, wrap this value ("Jane User") in a new context, and use the new context in processing the span element. As a result, `$this` refers to "Jane User" in the context of the span, and the `data-jst-content` attribute evaluates to "Jane User."

Note that the `data-jst-select` has to be executed before the `data-jst-content` in order for this example to work. In fact, `data-jst-select` is always evaluated before any other attributes (with the exception of `data-jst-include`), and so the processing of all subsequent instructions for the same template element will take place in the new environment created by the `data-jst-select` (see "Order of Evaluation" below).

What happens if you try to `data-jst-select` the array-valued `addresses` property of the data object? If the result of evaluating a `data-jst-select` expression is an array, a duplicate of the current template node is created for each item in the array. For each of these duplicate nodes a new context will be created to wrap the array item, and the processing environment for the duplicate node now uses this new context rather than the original. In other words, `data-jst-select` operates as a sort of "for each" statement in the case of arrays. So you can expand your address book template to list the addresses in your data object like so:

```html
<div id="template">
  <h1><span data-jst-select="username" data-jst-content="$this">User de Fault</span>'s Address Book </h1>
  <table cellpadding="5">
  <tr>
    <td>
      <h2>Location:</h2>
    </td>
    <td>
      <h2> ;Label:</h2>
    </td>
  </tr>
  <tr data-jst-select="addresses">
    <td data-jst-content="location"></td>
    <td data-jst-content="label"></td>
  </tr>
  </table>
</div> 
```

Processing this template with your Jane User address book data will produce a nice table with a row for each address. 

Since the execution of a `data-jst-select` instruction can change the number of children under a template node, we might worry that if we try to reprocess a template with new data the template will no longer have the structure we want. *js-template* manages this problem with a couple of tricks. 

First, whenever a `data-jst-select` produces duplicate nodes as a result of an array-valued expression, the template processor records an index for each node as an attribute of the element. So if the duplicate nodes are reprocessed, the processor can tell that they started out as a single node and will reprocess them as if they are still the single node of the original template. Second, a template node is never entirely removed, even if a `data-jst-select` evaluates to null. If a `data-jst-select` evaluates to null (or undefined), the current node will be hidden by setting `display='none'`, and no further processing will be performed on it. But the node will still be present, and available for future reprocessing.


### data-jst-if

The value of the `data-jst-if` attribute is evaluated as a JavaScript expression. If the result a falsy value, the `jQuery.show(false)` method will be called, rendering it invisible, _and no further processing will be done on this node or its children_ (compare to `data-jst-show` and `data-jst-hide`, which hide or show the node but continue template processing). 

This instruction is particularly useful for checking for empty content. You might want to display an informative message if a user's address book is empty, for example, rather than just showing them an empty table. The following template will accomplish this goal:

```html
<div id="template">
  <h1><span data-jst-select="username" data-jst-content="$this">User de Fault</span>'s Address Book </h1>
  <span data-jst-if="addresses.length==0">Address book is empty.</span> <table cellpadding="5" data-jst-if="addresses.length">
  <tr>
    <td><h2>Location:</h2></td>
    <td><h2> ;Label:</h2></td>
  </tr>
  <tr data-jst-select="addresses">
    <td data-jst-content="location"></td>
    <td data-jst-content="label"></td>
  </tr>
  </table>
</div> 
```
If the addresses array is empty, the user will see "Address book is empty," but otherwise they will see the table of addresses as usual.


### data-jst-skip

The value of the `data-jst-skip` attribute is evaluated as a JavaScript expression. If the result is a truthy JavaScript value, then the template processor will not process the subtree under the current node. This instruction is useful for improving the efficiency of an application (to avoid unnecessarily processing deep trees, for example).

The effect of a `data-jst-skip` that evaluates to `true` is very similar to the result of a `data-jst-if` that evaluates to false. In both cases, no processing will be performed on the node's children. `data-jst-skip` will not, however, prevent the current node from being displayed.


### data-jst-show

The value of the `data-jst-show` attribute is evaluated as a JavaScript expression. If the result is a falsy JavaScript value, the `jQuery.show(false)` method will be called on the node, but processing of child nodes will contine normally. Compare to `data-jst-if`, which will prevent further template processing.


### data-jst-hide

The value of the `data-jst-show` attribute is evaluated as a JavaScript expression. If the result is a truthy JavaScript value, the `jQuery.show(false)` method will be called on the node, but processing of child nodes will contine normally. Compare to `data-jst-if`, which will prevent further template processing.


### data-jst-include

As `data-jst-select` does, the `data-jst-include` instruction expands the structure of a template by copying a structure from some other element in the document. 

The value of the `data-jst-include` attribute can be one of two possibilities:
* A CSS ID selector of the template to include, starting with "#"; for example, `data-jst-include="#someid"`.
* A JavaScript expression that results in a string assumed to be the value of an HTML element ID (without the "#") of the template to include. For example, `data-jst-include="'(productType)+'Template'"`.

If an element with the given ID exists in the document, it is cloned and the clone replaces the node with the `data-jst-include` attribute. Template processing continues on the new element. If no element with the given ID exists, the node with the `data-jst-include` attribute is removed. No further processing instruction attributes will be evaluated on a node if it has a `data-jst-include` attribute.

The `data-jst-include` attribute allows for recursion, because a template can be included into itself. This feature can be handy when you want to display hierarchically structured data. If you have a hierarchically structured table of contents, for example, recursive `data-jst-include` statements allow you represent the arbitrarily complex hierarchy with a simple template:

```javascript
// Hierarchical data:
var data = {
  title: "js-template",
  items: [{
    title: "How to use js-template",
    items: [{ 
      title: "Include jQuery in your page"
    },
    { 
      title: "Include js-template in your page"
    },
    { 
      title: "Define your data in JavaScript"
    },
    { 
      title: "Define your templates in HTML"
    },
    { 
      title: "Process the templates"
    }]
  },
  {
    title: "Reference",
    items: [{ 
      title: "Template processing environment" 
    },
    { 
      title: "Template attributes", 
      items: [{
        title: "data-jst-content"
      },
      {
        title: "data-jst-overwrite"
      },
      {
        title: "data-jst-select"
      },
      {
        title: "data-jst-if"
      },
      {
        title: "data-jst-show"
      },
      {
        title: "data-jst-hide"
      },
      {
        title: "data-jst-include"
      },
      {
        title: "data-jst-values"
      },
      {
        title: "data-jst-skip"
      },
      {
        title: "data-jst-eval"
      },
      {
        title: "data-jst-id"
      },
      {
        title: "data-jst-idexpr"
      }]
    }]
  }]
};
```
```html
<div id="template">
  <span data-jst-content="title">Outline heading</span>
  <ul data-jst-if="items.length">
    <li data-jst-select="items">
      <!-- Recursive inclusion -->
      <div data-jst-include="template"></div>
    </li>
  </ul>
</div> 
```

The recursion in this example terminates because eventually it reaches data objects that have no "items" property. When the `data-jst-select` asks for "items" on one of these leaves, it evaluates to null and no further processing will be performed on that node. Note also that when the node with a `data-jst-include` attribute is replaced with the included node in this example, the replacement node will not have a `data-jst-include` attribute.

The **How to Use js-template** section above described the use of the `fillTemplate()` function to process a copy of a template rather than the original template. Templates with recursive `data-jst-include`s must be cloned in this way before processing. Because of the internal details of template processing, a template that contains a recursive reference to itself may be processed incorrectly if the original template is processed directly. The following JavaScript code will perform the required duplication for the above template:

```javascript
function displayData(data) {
  // Fill the template
  var template = $("template").fillTemplate(data);

  // Clear the element to which we'll attach the processed template
  // before attaching
  $("#container")
    .empty()
    .append(template);
}

$(document).ready(function() {
  var data = ...
  displayData(data);
});

```

### data-jst-values

The `data-jst-values` instruction provides a way of making assignments that alter the template processing environment. The template processor parses the value of the `data-jst-values` attribute value as a pipe-delimited ("|") list of name-value pairs, with every name separated from its value by a equals sign. For example:

```html
<div data-jst-values="$foo=bar|$bar=bat">...</div>
```

Every name represents a target for assignment. Every value will be evaluated as a JavaScript expression and assigned to its associated target. The nature of the target depends on the first character of the target name:

* If the first character of the target name is "$", then the target name is interpreted as a reference to a variable in the current processing environment context. This variable is created if it doesn't already exist, and assigned the result of evaluating its associated expression. It will then be available for subsequent template processing on this node and its descendants (including subsequent name-value pairs in the same `data-jst-values` attribute). Note that the dollar sign is actually part of the variable name: if you create a variable with `data-jst-values="$varname=varvalue"`, you must use `$varname` to retrieve the value.
* If the first character of the target name is ".", then the target name is interpreted as a reference to a JavaScript property of the current template node. The property is created if it doesn't already exist, and is assigned the result of evaluating its associated expression. So the instruction `data-jst-values=".id='Joe'|.style.fontSize='2em'"` would change the id of the current template node to "Joe" and change its font size to 2em.
* If the first character of the target name is neither a dot nor a dollar sign, then the target name is interpreted as a reference to an XML attribute of the current template element. In this case the instruction `data-jst-values="name=value"` is equivalent to the JavaScript statement `this.setAttribute('name','value')`, where `this` refers to the current template node. Just as in the case of a call to `setAttribute()`, the value will be interpreted as a string (after JavaScript evaluation). So `data-jst-values="sum=1+2"` is equivalent to `this.setAttribute('sum', '3')`.

The `data-jst-values` instruction makes a handy bridge between the DOM and template data. If you want a built-in event handler attribute like `onclick` to be able to access the currently selected portion of the context data, for example, you can use `data-jst-values` to copy a reference to the data into an attribute of the current element, where it will be accessible in the `onclick` attribute via `this`. The following example uses this approach to turn our outline into a collapsible outline:

```javascript
// Function called by onclick to record state of closedness and
// refresh the outline display
function setClosed(data, value) {
  data.closed = value;
  displayData(data);
}
```

```html
<div id="template">
  <!-- Links to open and close outline sections: -->
  <a href="#" data-jst-if="closed" data-jst-values=".jstdata=$this" onclick="setClosed(this.jstdata,0)">[Open]</a>
  <a href="#" data-jst-if="!closed && items.length" data-jst-values=".jstdata=$this" onclick="setClosed(this.jstdata,1)">[Close]</a>
  <span data-jst-content="title">Outline heading</span>
  <ul data-jst-if="items.length && !closed">
    <li data-jst-select="items">
      <!-- Recursive inclusion -->
      <div data-jst-include="template"></div>
    </li>
  </ul>
</div> 
```

(Note, the example above is for illustrative purposes only--the use of the `onclick` attribute on an element is highly discouraged in production code.)


### data-jst-vars

This instruction is identical to `data-jst-values`, except that all assignment targets are interpreted as variable names, whether or not they start with a "$." That is, all assignment targets are interpreted as described in section 1 of the `data-jst-values` section above.


### data-jst-data

The value of this attribute is a pipe-separated (|) list of name/value pairs. Each value of each pair will be evaluated as a JavaScript expression, and the result will be set on the node using the `jQuery.data(name,value)` method. This allows easy interoperation between data derived in the template (such as a list index) with the page's script. For example:


```html
<div data-jst-select="favs" data-jst-data="foo='bar'|value=$this|index=$index">...</div>
```

will result in the following method calls: `jQuery(node).data("foo","bar")`, `jQuery(node).data("value",<value of the $this content variable>)` and `jQuery(node).data("index",<value of the current iterator index>)`


### data-jst-id

Allows template nodes to specify the `id` attribute they should have after processing. This attribute is useful when templates will be cloned from the existing DOM and so should not have an ID that is already present in the original template. This attribute should always be used instead of the `id` attribute for descendent nodes of the top-level template container. (The top-level template container should have an `id` attribute so that it can be found and processed; this attribute is always removed when the template is cloned via `fillTemplate()`.)

Note that `data-jst-values` can also be used to set the element's `id` attribute, but this attribute helps simplify the use of `data-jst-values` for this common use case.


### data-jst-idexpr

Similar to `data-jst-id`, but eval's the attribute value as an expression. This attribute can be used to dynamically generate ID values based on context data, `$index` iteration value, etc.

Note that `data-jst-values` can also be used to set the element's `id` attribute, but this attribute helps simplify the use of `data-jst-values` for this common use case.


### data-jst-eval

The template processor evaluates a `data-jst-eval` instruction as a JavaScript expression, or a series of JavaScript expressions separated by semicolons. The `data-jst-eval` instruction thus allows you to invoke JavaScript functions during template processing, in the usual template processing environment, but without any of the predefined template processing effects of `data-jst-select`, `data-jst-values`, `data-jst-if`, `data-jst-skip`, or `data-jst-content`.

For example, with the addition of a `data-jst-eval` instruction to our outline title span, the template processor can record a count of the total number of outline items with and without titles as it traverses the data hierarchy. The count information in this example is stored in the processing context with a call to `setVariable`, so that it will be available to template processing throughout the data hierarchy:

A `data-jst-eval` expression increments the count:

```html
<div class="container" data-jst-vars="$counter=0">
  <span data-jst-content="title"
    data-jst-eval="title ? $counter.full++ : $counter.empty++"> Outline heading </span> 
    ...
```
and then a separate template displays these counts later in the page:

```html
  ...
  <div>
    <p>This outline has <span data-jst-content="$counter.empty"></span>
    empty titles and <span data-jst-content="$counter.full"></span>
    titles with content.</p>
  </div> 
</div> 
```

Note that when you close headings the counts change: `data-jst-if` is not only hiding the closed elements, but also aborting the processing of these elements, so that the `data-jst-eval` expressions on these elements are never evaluated.



## Order of evaluation

*js-template* instruction attributes within a single element are evaluated in the following order:

* `data-jst-include`. If a `data-jst-include` attribute is present no further attributes are processed. 
* `data-jst-select`. If `data-jst-select` is array-valued, remaining attributes will be copied to each new duplicate element created by the `data-jst-select` and processed when the new elements are processed. 
* `data-jst-id` 
* `data-jst-idexpr` 
* `data-jst-if`. If the value of a `data-jst-if` attribute is falsy, template processing stops immediately and no further attributes will be evaluated. 
* `data-jst-vars` 
* `data-jst-values` 
* `data-jst-data` 
* `data-jst-eval` 
* `data-jst-show` 
* `data-jst-hide` 
* `data-jst-skip` 
* `data-jst-content`


# Appendix: Examples

## Simple in-place template

```html
<!DOCTYPE html>
<html xmlns:jst="http://code.google.com/p/google-jstemplate/">
  <body>
    <!-- This is the template, denoted by the attributes in the data-jst- namespace -->
    <div id="user" style="display:none">
        User <span data-jst-content="userName"></span>
        <ul>
          <li>ID: <span data-jst-content="id">Loading...</span></li>
          <li>Timestamp: <span data-jst-content="created">Loading...</span></li>
          <li>Gender: <span data-jst-content="gender">Loading...</span></li>
        </ul>
    </div>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js" type="text/javascript"></script>
    <script src="jquery.js-template-1.0.js" type="text/javascript"></script>
    <script type="text/javascript">
    $(document).ready(
      function onReady() {
          var data={
              userName: "Todd",
              id: 1,
              created: "Tue Mar 3, 2010 19:04:23",
              gender: "Male"
          };
          
          // Merge the data with the template and show it
          $("#user")
            .refillTemplate(data)
            .show();
      });
    </script>
  </body>
</html>
```


# Appendix: Changes from the original JsTemplate project

## Namespacing

I've put all the original JsTemplate code into the `GOOGLE.templates` namespace to avoid global namespace pollution.

## Added new public methods

I've added several public methods to the `GOOGLE.templates` namespace to make using the raw JsTemplate engine easier. However, these methods should not normally be used by the application in favor of using jQuery integration instead. If interested, you can see these methods in the source.

### jQuery integration

I've integrated the original engine into a properly namespaced jQuery plugin called `jquery-js-template`, with a much simplified interface. It is now possible to use the standard jQuery `$(...)` selector syntax to find and process templates.


### JsTemplate attributes

I found the original JsTemplate API difficult to use and remember, so I've renamed key attributes and methods to make them more meaningful and stylistically consistent. All template-specific HTML attributes (like `jscontent` and `jsselect`) have been renamed to be HTML5-compatible.
