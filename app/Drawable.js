export default Drawable;

/**
 * @constructor
 * @description Object which can be drawn or scrolled or resized and may contain child drawables.
 */
function Drawable() {
  this._children = [];
  this._visible = true;

  Object.defineProperty(this, "visible", {
    set: function(value) {
      this._visible = (value == true);
      if (this._visible) {
        this.onShow();
      } else {
        this.onHide();
      }
    }.bind(this),
    get: function() {
      return this._visible;
    }.bind(this)
  });

  this._rebuildLists();
}

Drawable.prototype = {

  /**
   * Rebuild lists for this drawable and notify any parent drawable to do so as well. This ensures each drawable
   * contains an updated, flat list of all the drawables beneath them. This way we save performance by not recursing
   * through each child during draw time, and instead, drawing from the flat list at the level we care about.
   */
  _rebuildLists : function() {

    this._drawList = (typeof this.draw === "function") ? [this] : [];
    this._scrollList = (typeof this.scroll === "function") ? [this] : [];
    this._resizeList = (typeof this.resize === "function") ? [this] : [];

    for (let child of this._children) {
      Array.prototype.push.apply(this._drawList, child._drawList);
      Array.prototype.push.apply(this._scrollList, child._scrollList);
      Array.prototype.push.apply(this._resizeList, child._resizeList);
    };

    if(this.parent) {
      this.parent._rebuildLists();
    }
  },

  onShow:function(){},

  onHide:function(){},

  /**
   * Add a child drawable to this instance
   * @param {Drawable[]|Drawable} children child drawables to add
   */
  add : function(children) {

    if (!Array.isArray(children)) {
      children = [children];
    }

    for(let region of children) {
      region.parent = this;
      this._children.push(region);
    }

    this._rebuildLists();

    return children;
  },

  /**
   * Remove a child drawable from this instance
   * @param {Drawable[]|Drawable} children child drawables to remove
   */
  remove : function(children) {

    if (!Array.isArray(children)) {
      children = [children];
    }

    for (let region of children) {
      let index = this._children.indexOf(region);
      if (index !== -1) {
        this._children.splice(index, 1);
      }
    }

    this._rebuildLists();
    return children;
  },

};