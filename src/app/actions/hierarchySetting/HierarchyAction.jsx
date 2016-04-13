'use strict';
import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/hierarchySetting/Hierarchy.jsx';
import Ajax from '../../ajax/ajax.jsx';
import HierarchyStore from '../../stores/hierarchySetting/HierarchyStore.jsx';
var _page,
  _ruleId,
  _association,
  _filterObj;
let HierarchyAction = {
  GetHierarchys: function() {
    let customerId = parseInt(window.currentCustomerId);
    Ajax.post('/Hierarchy.svc/GetHierarchyTreeDtosRecursive', {
      params: {
        customerId: customerId,
      },
      success: function(hierarchys) {
        AppDispatcher.dispatch({
          type: Action.GET_HIERARCHY_TREE_DTOS,
          hierarchys: hierarchys
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  setCurrentSelectedNode: function(node) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_HIERARCHY_NODE,
      node: node
    });
  },
  //for customer
  getCustomersByFilter: function(customerId) {
    Ajax.post('/Customer.svc/GetCustomersByFilter', {
      params: {
        filter: {
          CustomerId: customerId,
        }
      },
      success: function(customer) {
        AppDispatcher.dispatch({
          type: Action.GET_CUSTOMER_FOR_HIERARCHY,
          customer: customer
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getLogListByCustomerId: function() {
    Ajax.post('/Hierarchy.svc/GetHierarchyImportHistory', {
      params: {
        customerId: parseInt(window.currentCustomerId)
      },
      success: function(logList) {
        AppDispatcher.dispatch({
          type: Action.GET_LOG_LIST_SUCCESS,
          logList: logList
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_LOG_LIST_ERROR,
        });
      }
    });
  },
  getAssociatedTag: function(page, ruleId, association, filterObj, refresh) {
    _page = page;
    _ruleId = ruleId;
    _association = association;
    _filterObj = filterObj;
    Ajax.post('/Tag.svc/GetTagsByFilter', {
      params: {
        filter: {
          CustomerId: parseInt(window.currentCustomerId),
          Association: association,
          Type: 1,
          RuleIds: [ruleId],
          HierarchyIds: null,
          CommodityId: filterObj.CommodityId,
          UomId: filterObj.UomId,
          LikeCodeOrName: filterObj.LikeCodeOrName
        },
        page: page,
        start: (page - 1) * 20,
        limit: 20,
        size: 20
      },
      success: function(data) {
        AppDispatcher.dispatch({
          type: Action.GET_ASSOCIATED_TAG,
          data: data
        });
        if (refresh === true) {
          AppDispatcher.dispatch({
            type: Action.SAVE_VEE_TAG_SUCCESS,
          });
        }
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  modifyTags: function(ruleId, tagIds) {
    var that = this;
    Ajax.post('/VEE.svc/ModifyVEETags', {
      params: {
        dto: {
          "Filter": {
            "RuleIds": ruleId === null ? null : [ruleId],
            "TagIds": tagIds,
            "CustomerId": window.currentCustomerId
          },
          "AssociateAll": false
        }

      },
      success: function(data) {
        if (ruleId === null) {
          if (HierarchyStore.getTotal() - 1 > 0 && parseInt((HierarchyStore.getTotal() - 1 + 19) / 20) < _page) {
            _page = _page - 1;
          }
        }
        that.getAssociatedTag(_page, _ruleId, _association, _filterObj, ruleId !== null);
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
};

module.exports = HierarchyAction;
