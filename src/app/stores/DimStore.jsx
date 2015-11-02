import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import Dim from '../constants/actionType/Dim.jsx';
var _data = {};

var DimStore = assign({}, PrototypeStore, {
  getData() {
    return _data;
  },
  setData(data) {

    _data = data;


  },
  findDimItem(item, dimId) {

    if (item.Id === dimId) {
      return item;
    }

    if (item.Children) {
      for (let i = 0, len = item.Children.length; i < len; i++) {
        let resultItem = DimStore.findDimItem(item.Children[i], dimId);
        if (resultItem) {
          return resultItem;
        }
      }
    }

    return null;
  },
});
var Action = Dim.Action;
DimStore.dispatchToken = AppDispatcher.register(function(action) {

  switch (action.type) {
    case Action.LOAD_DIM_NODE:
      DimStore.setData(action.dimList);
      DimStore.emitChange();
      break;

  }
});

module.exports = DimStore;
