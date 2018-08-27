export default Optionable;

let privates = new WeakMap();

function Optionable() {
  privates.set(this, {});
  let priv = privates.get(this);
  priv._options = {};
  priv._handlers = {};
}

Optionable.prototype = {

  handleOption : function(optionName, onUpdateHandler) {

    var propertyObj;

    /* If the update handler is another Optionable, use the instance's hander for that optionName */
    if ( onUpdateHandler instanceof Optionable ) {

      let siblingPrivates = privates.get(onUpdateHandler);

      if (!(optionName in siblingPrivates._handlers)) {
        console.error(`No handler for '${optionName}' is present in`, onUpdateHandler);
      }

      propertyObj = siblingPrivates._handlers[optionName];

    } else {

      propertyObj = {

        set: function(newValue) {

          privates.get(this)._options[optionName] = newValue;

          if (onUpdateHandler) {
            onUpdateHandler(newValue);
          }

        }.bind(this),

        get: function() {
          return privates.get(this)._options[optionName];
        }.bind(this)

      };
    }

    Object.defineProperty(this, optionName, propertyObj);
    privates.get(this)._handlers[optionName] = propertyObj;

  },

  getOption : function(optionName){
    return privates.get(this)._options[optionName];
  },

  setOption : function(optionName, value){
    privates.get(this)._options[optionName] = value;
  },

  update : function(options) {
    for (let optionName in options) {
      if (optionName in privates.get(this)._handlers) {
        let value = options[optionName];
        privates.get(this)._handlers[optionName].set(value);
      }
    }
  },

  serialize : function(obj = {}) {

    let handler = privates.get(this)._handlers;
    for (let optionName in handler) {
      obj[optionName] = handler[optionName].get();
    }

    return obj;
  },

  deserialize : function(serialization) {
    for (let optionName in serialization) {
      if (optionName in privates.get(this)._handlers) {
        privates.get(this)._handlers[optionName].set(serialization[optionName]);
      }
    }
  }

};