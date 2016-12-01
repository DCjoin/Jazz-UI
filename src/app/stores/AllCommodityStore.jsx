'use strict';

import PopAppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import {Action} from '../constants/actionType/Main.jsx';

let _commodities = [];
var AllCommodityStore = assign({},PrototypeStore,{
  initCommodities(commodities){
    _commodities = commodities;
  },
  getAllCommodities(){
    return _commodities;
  }
});

AllCommodityStore.dispatchToken = PopAppDispatcher.register(function(action) {
    switch(action.type) {
      case Action.GET_ALL_COMMODITY_SUCCESS:
        AllCommodityStore.initCommodities(action.commodities);
        AllCommodityStore.emitChange();
        break;
      case Action.GET_ALL_COMMODITY_ERROR:
        AllCommodityStore.initCommodities([]);
        AllCommodityStore.emitChange();
        break;
    }
});

module.exports = AllCommodityStore;
