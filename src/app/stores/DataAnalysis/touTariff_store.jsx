'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action,status } from 'constants/actionType/DataAnalysis.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

var tags=null;
const TouTariffStore = assign({}, PrototypeStore, {
  setTagsInfo(infos){
    tags=Immutable.fromJS(infos);
  },
  getTagsInfo(){
    return tags
  }
})


TouTariffStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_TOU_TAGS_INFO:
          TouTariffStore.setTagsInfo(action.tagData);
          TouTariffStore.emitChange()
      break;
  }
});

export default TouTariffStore