'use strict';
import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/hierarchySetting/Hierarchy.jsx';
import Ajax from '../../ajax/ajax.jsx';
import HierarchyStore from '../../stores/hierarchySetting/HierarchyStore.jsx';
import CommonFuns from '../../util/Util.jsx';
import Immutable from 'immutable';
var _page,
  _hierarchyId,
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
  getCustomersByFilter: function(customerId, refresh = false) {
    var that = this;
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
        if (refresh) {
          that.GetHierarchys();
        }
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
  getAssociatedTag: function(page, hierarchyId, association, filterObj, refresh) {
    _page = page;
    _hierarchyId = hierarchyId;
    _association = association;
    _filterObj = filterObj;
    Ajax.post('/Tag.svc/GetTagsByFilter', {
      params: {
        filter: {
          CustomerId: parseInt(window.currentCustomerId),
          Association: {
            AssociationId: hierarchyId,
            AssociationOption: association
          },
          IncludeAssociationName: true,
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
            type: Action.SAVE_ASSOCIATED_TAG_SUCCESS,
          });
        }
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  modifyTags: function(hierarchyId, tags) {
    var that = this;
    Ajax.post('/Tag.svc/SetAssociation', {
      params: {
        dto: {
          AssociationId: hierarchyId,
          AssociationType: 1,
          Tags: tags
        }
      },
      success: function(data) {
        if (hierarchyId === null) {
          if (HierarchyStore.getTotal() - 1 > 0 && parseInt((HierarchyStore.getTotal() - 1 + 19) / 20) < _page) {
            _page = _page - 1;
          }
        }
        that.getAssociatedTag(_page, _hierarchyId, _association, _filterObj, _hierarchyId !== null);
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  clearAll: function() {
    AppDispatcher.dispatch({
      type: Action.CLEAR_ALL_ASSOCIATED_TAGS,
    });
  },
  createHierarchy: function(dto) {
    var that = this;
    Ajax.post('/Hierarchy.svc/CreateHierarchy', {
      params: {
        hierarchy: dto
      },
      commonErrorHandling: false,
      success: function(node) {
        AppDispatcher.dispatch({
          type: Action.SET_SELECTED_HIERARCHY_NODE,
          node: Immutable.fromJS(node)
        });
        that.GetHierarchys();
      },
      error: function(err, res) {
        let ErrorMsg = CommonFuns.getErrorMessageByRes(res.text);
        AppDispatcher.dispatch({
          type: Action.HIERARCHY_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
        console.log(err, res);
      }
    });
  },
  modifyHierarchy: function(dto) {
    var that = this;
    Ajax.post('/Hierarchy.svc/ModifyHierarchy', {
      params: {
        hierarchy: HierarchyStore.traversalNode(dto)
      },
      commonErrorHandling: false,
      success: function(node) {
        AppDispatcher.dispatch({
          type: Action.SET_SELECTED_HIERARCHY_NODE,
          node: Immutable.fromJS(node)
        });
        that.GetHierarchys();
      },
      error: function(err, res) {
        let ErrorMsg = CommonFuns.getErrorMessageByRes(res.text);
        AppDispatcher.dispatch({
          type: Action.HIERARCHY_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
      }
    });
  },
  deleteHierarchy: function(dto) {
    var that = this;
    Ajax.post('/Hierarchy.svc/DeleteHierarchy', {
      params: {
        hierarchy: HierarchyStore.traversalNode(dto)
      },
      commonErrorHandling: false,
      success: function() {
        AppDispatcher.dispatch({
          type: Action.DELETE_HIERARCHY_DTO_SUCCESS,
          nextSelectedNode: HierarchyStore.findNextSelectedNode(dto)
        });
        that.GetHierarchys();
      },
      error: function(err, res) {
        let ErrorMsg = CommonFuns.getErrorMessageByRes(res.text);
        AppDispatcher.dispatch({
          type: Action.HIERARCHY_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
        console.log(err, res);
      }
    });
  },
};

module.exports = HierarchyAction;