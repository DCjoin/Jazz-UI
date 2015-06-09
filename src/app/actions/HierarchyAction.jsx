'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import Hierarchy from '../constants/actionType/Hierarchy.jsx';
import Ajax from '../ajax/ajax.jsx';

var Action = Hierarchy.Action;

let HierarchyAction = {
  loadall(date){
    Ajax.post('/Hierarchy.svc/GetHierarchyTreeDtosRecursive?', {
        params: {customerId: date},
        success: function(hierarchyList){
          console.log("hierarchyList");
          console.log(hierarchyList);
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
