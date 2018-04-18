/**
 * @module Util
 * @description Catch-all module, which should eventually be broken out into different categories
 */

/**
 * @description Returns an HTMLElement based on a selector string, or an HTMLElement.
 */
var getHtmlElement = function(selector) {
  let element = (selector instanceof HTMLElement) ? selector : document.querySelector(selector);
  console.assert(element, `${selector} is neither an HTMLElement nor a productive CSS selector`);
  return element;
}

/** Creates a new Div */
var newDiv = function(userOptions) {
  let opts = {};
  let newElement = document.createElement("div");
  Object.assign(opts, userOptions);

  if (opts.style) {
    Object.assign(newElement.style, opts.style);
  }

  if (opts.class) {
    newElement.className = opts.class;
  }

  if (opts.html) {
    newElement.innerHTML = opts.html;
  }

  return newElement;
}

/** Creates a new Div and appends it to a parent  */
var appendNewDiv = function(parentSelector, userOptions) {
  let parent = getHtmlElement(parentSelector);
  let newElement = newDiv(userOptions);
  parent.appendChild(newElement);
  return newElement;
}

/** Similar to Object.assign, but performs deep merge of child objects */
var mergeOptions = function(target, extension) {
  for (let prop in extension) {
    let value = extension[prop];
    if (prop in target && target[prop] !== null) {
      if ((value !== null) && (typeof value === "object") && !Array.isArray(value)) {
        mergeOptions(target[prop], value);
      } else {
        target[prop] = value;
      }
    } else  {
      target[prop] = value;
    }
  }

  /* Target is modified, but return it as well for convenience */
  return target;
}

export {getHtmlElement, appendNewDiv, newDiv, mergeOptions};