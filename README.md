js-template
===========

js-template is a powerful jQuery-based JavaScript templating framework. This project is an updated and modernized reincarnation of Google's excellent open-source [JsTemplate project](http://code.google.com/p/google-jstemplate/).

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


# Reference

The processing instructions that define the results of template processing are encoded as attributes in template HTML elements. There are 12 such special attributes: 

* `jst:content`,
* `jst:select`
* `jst:if`
* `jst:skip`
* `jst:include`
* `jst:values`
* `jst:vars`,
* `jst:eval`
* `jst:id`
* `jst:idexpr`
* `jst:overwrite`
* `jst:data`

Before you dive into the details of individual instructions, however, you should know a little bit about the namespace within which these instructions are processed.

## Processing Environment

With the exception of the `jst:include` instruction, the values of all js-template attributes will contain JavaScript expressions. These expressions will be evaluated in an environment that includes bindings from a variety of sources, and names defined by any of these sources can be referenced in js-template attribute expressions as if they were variables:

* `JsEvalContext` data: All the properties of the `JsEvalContext`'s data object are included in the processing environment.
* Explicitly declared variables: The `setVariable(name,value)` method of `JsEvalContext` creates a new variable with the name `variableName` in the processing environment if no such variable exists, assigning it the value `variableValue`. If the variable already exists, it will be reassigned the value `variableValue`. Variables can also be created and assigned with the `jst:values` instruction (see below).
    * Note that variables defined in either of these ways are distinct from the `JsEvalContext` data object. Calling `setVariable` will not alter the data wrapped by the `JsEvalContext` instance. This fact can have important consequences when template processing is traversing the hierarchy of the data object (through the use of the `jst:select` instruction, for example -- see below): no matter what portion of the data hierarchy has been selected for processing, variables created with `setVariable` will always be available for use in template processing instructions.
* Special variables: js-templte also defines three special variables that can be used in processing instruction attributes:
* `this`: The keyword `this` in js-template attribute expressions will evaluate to the element on which the attribute is defined. In this respect js-template attributes mirror event handler attributes like `onclick`. 
* `$index`: Array-valued data can result in a duplicate template node being created for each array element (see `jst:select`, below). In this case the processing environment for each of those nodes includes `$index` variable, which will contain the array index of the element associated with the node. 
* `$this`: `$this` refers to the `JsEvalContext` data object used in processing the current node. So in the above example we could substitute `$this.end` for `end` without changing the meaning of the `jst:content` expression. This may not seem like a very useful thing to do in this case, but there are other cases in which `$this` is necessary. If the `JsEvalContext` contains a value such as a string or a number rather than an object with named properties, there is no way to retrieve the value using object-property notation, and so we need `$this` to access the value.
So if you have the template

```html
<div id="witha">
  <div id="Hey" 
       jst:content="this.parentNode.id + this.id + dataProperty + $this.dataProperty + declaredVar"
  ></div>
</div> 
```
and you process it with the statements

```JavaScript
var mydata = {dataProperty: "Nonny"};
var context = {declaredVar, "Ho"};
$("#witha").refillTemplate(mydata,context);
```
then the document will display the string `withaHeyNonnyNonnyHo`. The values of `id` and `parentNode.id` are available as properties of the current node (accessible through the keyword `this`), the value of `dataProperty` is available (via both a naked reference and the special variable `$this`) because it is defined in the context data object, and the value of `declaredVar` is available because it is defined in the context's variables.


## Processing instructions

In the discussion of specific instruction attributes below, the phrase "current node" refers to the DOM element on which the attribute is defined.


### jst:content

This attribute is evaluated as a JavaScript expression in the current processing environment. The string value of the result then becomes the text content of the current node. So this template:

```html
<div id="template"> Welcome 
  <span jst:content="$this">
   (This placeholder name will be replaced by the actual username.) 
  </span>
</div> 
```
when processed with the JavaScript statements:

```JavaScript
var data = "Joe User";
$("#template").refillTemplate(data);
```
will display

`Welcome Joe User`

in the browser. Note the use of `$this` here: the `refillTemplate()` function is passed the string "Joe User", and so this is the object to which `$this` refers.

When the template processor executes a `jst:content` instruction, a new text node object is created with the string value of the result as its `nodeValue`, and this new text node becomes the only child of the current node. This implementation ensures that no markup in the result is evaluated.


### jst:select

The primary function of js-template is to create mappings between data structures and HTML representations of those data structures. The `jst:select` attribute handles much of the work of defining this mapping by allowing you to associate a particular subtree of the data with a particular subtree of the template's DOM structure.

When a template node with a `jst:select` attribute is processed, the value of the `jst:select` attribute is evaluated as a JavaScript expression in the current processing environment, as described above. If the result of this evaluation is not an array, the template processor automatically creates a new context to wrap the result of the evaluation. The processing environment for the current node now uses this new context rather than the original context.

For example, imagine that you have the following data object:

```JavaScript
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
  <span jst:select="username" jst:content="$this"></span>'s Address Book
</div> 
```

The `jst:select` attribute tells the processor to retrieve the `username` property of the data object, wrap this value ("Jane User") in a new context, and use the new context in processing the span element. As a result, `$this` refers to "Jane User" in the context of the span, and the `jst:content` attribute evaluates to "Jane User."

Note that the `jst:select` has to be executed before the `jst:content` in order for this example to work. In fact, `jst:select` is always evaluated before any other attributes (with the exception of `jst:include`), and so the processing of all subsequent instructions for the same template element will take place in the new environment created by the `jst:select` (see "Order of Evaluation" below).

What happens if you try to `jst:select` the array-valued `addresses` property of the data object? If the result of evaluating a `jst:select` expression is an array, a duplicate of the current template node is created for each item in the array. For each of these duplicate nodes a new context will be created to wrap the array item, and the processing environment for the duplicate node now uses this new context rather than the original. In other words, `jst:select` operates as a sort of "for each" statement in the case of arrays. So you can expand your address book template to list the addresses in your data object like so:

```html
<div id="template">
  <h1><span jst:select="username" jst:content="$this">User de Fault</span>'s Address Book </h1>
  <table cellpadding="5">
  <tr>
    <td>
      <h2>Location:</h2>
    </td>
    <td>
      <h2> ;Label:</h2>
    </td>
  </tr>
  <tr jst:select="addresses">
    <td jst:content="location"></td>
    <td jst:content="label"></td>
  </tr>
  </table>
</div> 
```

Processing this template with your Jane User address book data will produce a nice table with a row for each address. 

Since the execution of a `jst:select` instruction can change the number of children under a template node, we might worry that if we try to reprocess a template with new data the template will no longer have the structure we want. js-template manages this problem with a couple of tricks. 

First, whenever a `jst:select` produces duplicate nodes as a result of an array-valued expression, the template processor records an index for each node as an attribute of the element. So if the duplicate nodes are reprocessed, the processor can tell that they started out as a single node and will reprocess them as if they are still the single node of the original template. Second, a template node is never entirely removed, even if a `jst:select` evaluates to null. If a `jst:select` evaluates to null (or undefined), the current node will be hidden by setting `display='none'`, and no further processing will be performed on it. But the node will still be present, and available for future reprocessing.


### jst:if

The value of the `jst:if` attribute is evaluated as a JavaScript expression. If the result is false, 0, "" or any other falsy JavaScript value that is true when negated, the CSS `display` property of the current template node will be set to 'none', rendering it invisible, and no further processing will be done on this node or its children. This instruction is particularly useful for checking for empty content. You might want to display an informative message if a user's address book is empty, for example, rather than just showing them an empty table. The following template will accomplish this goal:

```html
<div id="template">
  <h1><span jst:select="username" jst:content="$this">User de Fault</span>'s Address Book </h1>
  <span jst:if="addresses.length==0">Address book is empty.</span> <table cellpadding="5" jst:if="addresses.length">
  <tr>
    <td><h2>Location:</h2></td>
    <td><h2> ;Label:</h2></td>
  </tr>
  <tr jst:select="addresses">
    <td jst:content="location"></td>
    <td jst:content="label"></td>
  </tr>
  </table>
</div> 
```
If the addresses array is empty, the user will see "Address book is empty," but otherwise they will see the table of addresses as usual.


### jst:skip
The value of the `jst:skip` attribute is evaluated as a JavaScript expression. If the result is any JavaScript value that evaluates to `true` in a boolean context, then the template processor will not process the subtree under the current node. This instruction is useful for improving the efficiency of an application (to avoid unnecessarily processing deep trees, for example).

The effect of a `jst:skip` that evaluates to `true` is very similar to the result of a `jst:if` that evaluates to false. In both cases, no processing will be performed on the node's children. `jst:skip` will not, however, prevent the current node from being displayed.


### jst:include

As `jst:select` does, the `jst:include` instruction expands the structure of a template by copying a structure from some other element in the document. The value of the `jst:include` attribute is a CSS ID selector, for example `#someid`.

If an element with the given id exists in the document, it is cloned and the clone replaces the node with the `jst:include` attribute. Template processing continues on the new element. If no element with the given ID exists, the node with the `jst:include` attribute is removed. No further processing instruction attributes will be evaluated on a node if it has a `jst:include` attribute.

The `jst:include` attribute allows for recursion, because a template can be included into itself. This feature can be handy when you want to display hierarchically structured data. If you have a hierarchically structured table of contents, for example, recursive `jst:include` statements allow you represent the arbitrarily complex hierarchy with a simple template:

```JavaScript
// Hierarchical data:
var data = {
  title: "JsTemplate",
  items: [ {
    title: "Using JsTemplate",
    items: [ { 
      title: "The js-template Module"
    }, { 
      title: "JavaScript Data"
    }, { 
      title: "Template HTML"
    }, { 
      title: "Processing Templates with JavaScript Statements"
    } ]
  }, {
    title: "Template Processing Instructions",
    items: [ { 
      title: "Processing Environment" 
    }, { 
      title: "Instruction Attributes", 
      items: [ {
        title: "jst:content"
      }, {
        title: "jst:select"
      }, {
        title: "jst:if"
      }, {
        title: "jst:include"
      }, {
        title: "jst:values"
      }, {
        title: "jst:skip"
      }, {
        title: "jst:eval"
      } ]
    } ]
  } ]
};
```
```JavaScript
<div id="template">
  <span jst:content="title">Outline heading</span>
  <ul jst:if="items.length">
    <li jst:select="items">
      <!-- Recursive inclusion -->
      <div jst:include="template"></div>
    </li>
  </ul>
</div> 
```

The recursion in this example terminates because eventually it reaches data objects that have no "items" property. When the `jst:select` asks for "items" on one of these leaves, it evaluates to null and no further processing will be performed on that node. Note also that when the node with a `jst:include` attribute is replaced with the included node in this example, the replacement node will not have a `jst:include` attribute.

How to Use js-template described the use of the `filTemplate()` function to process a copy of a template rather than the original template. Templates with recursive `jst:include`s must be cloned in this way before processing. Because of the internal details of template processing, a template that contains a recursive reference to itself may be processed incorrectly if the original template is processed directly. The following JavaScript code will perform the required duplication for the above template:

```JavaScript

function displayData(data) {
  // Fill the template
  var template = $("template").fillTemplate(data);

  // Clear the element to which we'll attach the processed template
  // before attaching
  $("#peg")
    .empty()
    .append(template);
}

$(document).ready(function() {
  var data = ...
  displayData(data);
});

```

### jst:values

The `jst:values` instruction provides a way of making assignments that alter the template processing environment. The template processor parses the value of the `jst:values` attribute value as a pipe-delimited ("|") list of name-value pairs, with every name separated from its value by a equals sign. For example:

```html
<div jst:values="$foo=bar|$bar=bat">...</div>
```

Every name represents a target for assignment. Every value will be evaluated as a JavaScript expression and assigned to its associated target. The nature of the target depends on the first character of the target name:

* If the first character of the target name is "$", then the target name is interpreted as a reference to a variable in the current processing environment context. This variable is created if it doesn't already exist, and assigned the result of evaluating its associated expression. It will then be available for subsequent template processing on this node and its descendants (including subsequent name-value pairs in the same `jst:values` attribute). Note that the dollar sign is actually part of the variable name: if you create a variable with `jst:values="$varname=varvalue"`, you must use `$varname` to retrieve the value.
* If the first character of the target name is ".", then the target name is interpreted as a reference to a JavaScript property of the current template node. The property is created if it doesn't already exist, and is assigned the result of evaluating its associated expression. So the instruction `jst:values=".id='Joe'|.style.fontSize='2em'"` would change the id of the current template node to "Joe" and change its font size to 2em.
* If the first character of the target name is neither a dot nor a dollar sign, then the target name is interpreted as a reference to an XML attribute of the current template element. In this case the instruction `jst:values="name=value"` is equivalent to the JavaScript statement `this.setAttribute('name','value')`, where `this` refers to the current template node. Just as in the case of a call to `setAttribute()`, the value will be interpreted as a string (after JavaScript evaluation). So `jst:values="sum=1+2"` is equivalent to `this.setAttribute('sum', '3')`.

The `jst:values` instruction makes a handy bridge between the DOM and template data. If you want a built-in event handler attribute like `onclick` to be able to access the currently selected portion of the context data, for example, you can use `jst:values` to copy a reference to the data into an attribute of the current element, where it will be accessible in the `onclick` attribute via `this`. The following example uses this approach to turn our outline into a collapsible outline:

```JavaScript
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
  <a href="#" jst:if="closed" jst:values=".jstdata=$this" onclick="setClosed(this.jstdata,0)">[Open]</a>
  <a href="#" jst:if="!closed && items.length" jst:values=".jstdata=$this" onclick="setClosed(this.jstdata,1)">[Close]</a>
  <span jst:content="title">Outline heading</span>
  <ul jst:if="items.length && !closed">
    <li jst:select="items">
      <!-- Recursive inclusion -->
      <div jst:include="template"></div>
    </li>
  </ul>
</div> 
```

Note, the example above is for illustrative purposes only--the use of the `onclick` attribute on an element is highly discouraged in production code.


### jst:vars

This instruction is identical to `jst:values`, except that all assignment targets are interpreted as variable names, whether or not they start with a "$." That is, all assignment targets are interpreted as described in section 1 of the `jst:values` section above.


### jst:eval

The template processor evaluates a `jst:eval` instruction as a JavaScript expression, or a series of JavaScript expressions separated by semicolons. The `jst:eval` instruction thus allows you to invoke JavaScript functions during template processing, in the usual template processing environment, but without any of the predefined template processing effects of `jst:select`, `jst:values`, `jst:if`, `jst:skip`, or `jst:content`.

For example, with the addition of a `jst:eval` instruction to our outline title span, the template processor can record a count of the total number of outline items with and without titles as it traverses the data hierarchy. The count information in this example is stored in the processing context with a call to `setVariable`, so that it will be available to template processing throughout the data hierarchy:

A `jst:eval` expression increments the count:

```html
<div class="container" jst:vars="$counter=0">
  <span jst:content="title"
    jst:eval="title ? $counter.full++ : $counter.empty++"> Outline heading </span> 
    ...
```
and then a separate template displays these counts later in the page:

```html
  ...
  <div>
    <p>This outline has <span jst:content="$counter.empty"></span>
    empty titles and <span jst:content="$counter.full"></span>
    titles with content.</p>
  </div> 
</div> 
```

Note that when you close headings the counts change: `jst:if` is not only hiding the closed elements, but also aborting the processing of these elements, so that the `jst:eval` expressions on these elements are never evaluated.


### jst:id


### jst:idexpr


### jst:overwrite


### jst:data



## Order of evaluation

js-template instruction attributes within a single element are evaluated in the following order:

* `jst:include`. If a jst:include attribute is present no further attributes are processed. 
* `jst:select`. If `jst:select` is array-valued, remaining attributes will be copied to each new duplicate element created by the `jst:select` and processed when the new elements are processed. 
* `jst:if` 
* `jst:vars` 
* `jst:values` 
* `jst:eval` 
* `jst:skip` 
* `jst:content`


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
