'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import Ajax from '../ajax/ajax.jsx';
import {Action} from '../constants/actionType/MainBiz.jsx';

let MainBizAction = {
  setBizType:function(typeId){
    AppDispatcher.dispatch({
        type: Action.SET_BIZ_TYPE,
        typeId: typeId
    });
  }
};
module.exports = MainBizAction;
