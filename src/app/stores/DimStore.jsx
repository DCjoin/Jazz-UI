import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import Dim from '../constants/actionType/Dim.jsx';
var _data = {};

var DimStore = assign({},PrototypeStore,{
  getDate(){
    return _data;
  },
  setDate(data){

      _data =  data;


  },
});
var Action = Dim.Action;
DimStore.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.type) {
      case Action.LOAD_DIM_NODE:
      console.log("**wyh***DimStore");
      console.log(action.dimList);
           DimStore.setDate(action.dimList);
           DimStore.emitChange();
        break;

    }
});

module.exports = DimStore;
