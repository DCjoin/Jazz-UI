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
  dispose(){}
});

module.exports = PrototypeStore;
