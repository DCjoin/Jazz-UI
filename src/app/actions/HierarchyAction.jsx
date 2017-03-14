'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import Hierarchy from '../constants/actionType/Hierarchy.jsx';
import HierarchyStore from '../stores/HierarchyStore.jsx';
import Ajax from '../ajax/ajax.jsx';
import util from 'util/Util.jsx';
import Path from 'constants/Path.jsx';

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
  },

  getBuildingListByCustomerId(customerId) {
    Ajax.get(util.replacePathParams(Path.Hierarchy.GetBuildingList, customerId), {
      params: {customerId},
      tag: 'getBuildingListByCustomerId',
      success: function(buildingList) {

        AppDispatcher.dispatch({
          type: Action.GET_BUILDING_LIST_BY_CUSTOMER_ID,
          data: buildingList
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },

  getAvailableDataReportBuildingListByCustomerId(customerId) {
    Ajax.get(util.replacePathParams('/datareport/availablebuildings/{customerid}', customerId), {
      params: {customerId},
      success: function(buildingList) {

        AppDispatcher.dispatch({
          type: Action.GET_BUILDING_LIST_BY_CUSTOMER_ID,
          data: buildingList,
          isActive: true,
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },

};

module.exports = HierarchyAction;
