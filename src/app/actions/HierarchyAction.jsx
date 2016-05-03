'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import Hierarchy from '../constants/actionType/Hierarchy.jsx';
import Ajax from '../ajax/ajax.jsx';

var Action = Hierarchy.Action;

let HierarchyAction = {
  loadall(data){
      setTimeout(()=>{
    AppDispatcher.dispatch({
         type: Action.SET_HIE_NODE_LOAGDING
    });
      },0);
    Ajax.post('/Hierarchy/GetHierarchyTreeDtosRecursive?', {
        params: {customerId: data},
        success: function(hierarchyList){

          AppDispatcher.dispatch({
              type: Action.LOAD_HIE_NODE,
              hierarchyList: hierarchyList
          });
        },
        error: function(err, res){
          console.log(err,res);
        }
    });
  }

};

module.exports = HierarchyAction;
