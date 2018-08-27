import {newDiv, getHtmlElement, mergeOptions} from "Util";
import Drawable from "Drawable";

export default Element;

/**
 * @constructor
 * @extends Drawable
 * @description Generic class for classes which render text or graphics in the browser
 * @param {Element.Options} userOptions  User provided options
 */
function Element(userOptions) {

  /**
   * @typedef Element.Options
   * @description Options for Element
   * @property {(String|HTMLElement)} element   Existing html element to use. If one is not provided, a div will be created by this constructor
   * @property {Object} style                   CSS style object for the HTML element
   * @property {String} class                   Class name which will be assigned to the element
   * @property {(String|HTMLElement)} container Parent element which will contain the element
   */
  const defaultOptions = {
    element:null,
    style:{},
    class:"",
    container:null,
  }

  let options = mergeOptions(defaultOptions, userOptions);

  Drawable.call(this, options);

  Object.defineProperty(this, "element", {
    set:function(value){
      options.element = getHtmlElement(value);
      if (options.container) {
        getHtmlElement(options.container).appendChild(options.element);
      }
    },
    get:function(){
      return options.element;
    }
  });

  this.element = options.element || newDiv(userOptions);
  this._cachedDisplay = this.element.style.display || "block";
  if ("visible" in options) {
    this.visible = options.visible;
  }
}

Element.prototype = Object.assign( Object.create(Drawable.prototype), {

  onShow: function(){
    this.element.style.display = this._cachedDisplay;
  },

  onHide: function(){
    if (this.visible) {
      this._cachedDisplay = this.element.style.display || "block";
    }
    this.element.style.display = "none";
  }

});
