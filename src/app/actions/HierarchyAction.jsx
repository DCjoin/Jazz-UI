'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import Hierarchy from '../constants/actionType/Hierarchy.jsx';
import HierarchyStore from '../stores/HierarchyStore.jsx';
import Ajax from '../ajax/ajax.jsx';

var Action = Hierarchy.Action;

let HierarchyAction = {
  loadall(data, includeArea) {
    setTimeout(() => {
      AppDispatcher.dispatch({
        type: Action.SET_HIE_NODE_LOAGDING
      });
    }, 0);
    Ajax.post('/Hierarchy/GetHierarchyTreeDtosRecursive?', {
      params: {
        customerId: data,
        includeArea: includeArea
      },
      success: function(hierarchyList) {

        AppDispatcher.dispatch({
          type: Action.LOAD_HIE_NODE,
          hierarchyList: includeArea ? HierarchyStore.traversalNode(hierarchyList) : hierarchyList
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  }

};

module.exports = HierarchyAction;
