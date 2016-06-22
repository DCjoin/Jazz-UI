'use strict';
import events from 'events';
import assign from 'object-assign';
let { EventEmitter } = events;
let CHANGE_EVENT = 'change';

var PrototypeStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
    this.dispose();
  },
  emitError: function(error) {
    this.emit("onerror",error);
  },

  /**
   * @param {function} callback
   */
  addErrorListener: function(callback) {
    this.on("onerror", callback);
  },

  /**
   * @param {function} callback
   */
  removeErrorListener: function(callback) {
    this.removeListener("onerror", callback);

},

  dispose(){}
});

module.exports = PrototypeStore;
