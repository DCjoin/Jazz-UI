'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import Hierarchy from '../constants/actionType/Hierarchy.jsx';
import Ajax from '../ajax/ajax.jsx';

var Action = Hierarchy.Action;

let HierarchyAction = {
  loadall(date){
    Ajax.post('/Hierarchy.svc/GetHierarchyTreeDtosRecursive?_dc=1432863139860', {
        params: {customerId: date},
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
