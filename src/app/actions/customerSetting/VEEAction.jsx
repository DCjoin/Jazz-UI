'use strict';
import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/customerSetting/VEE.jsx';
import Ajax from '../../ajax/ajax.jsx';
import CommonFuns from '../../util/Util.jsx';
var _page, _ruleId, _association, _filterObj;
let VEEAction = {
  GetVEERules: function() {
    Ajax.post('/VEE.svc/GetVEERules', {
      params: {
        filter: {
          CustomerId: window.currentCustomerId,
        }
      },
      success: function(rules) {
        AppDispatcher.dispatch({
          type: Action.GET_VEE_RULES,
          rules: rules
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  setCurrentSelectedId: function(id) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_RULE_ID,
      id: id
    });
  },
  getAllReceivers: function(ruleId) {
    Ajax.post('/VEE.svc/GetUsersByFilter', {
      params: {
        "filter": {
          "RuleIds": [ruleId],
          "CustomerId": window.currentCustomerId,
          "IncludeAll": true
        },
        "page": 0,
        "start": 0,
        "limit": 0
      },
      success: function(receivers) {
        AppDispatcher.dispatch({
          type: Action.GET_VEE_ALL_RECEIVERS,
          receivers: receivers
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  createVEERule: function(rule) {
    var that = this;
    Ajax.post('/VEE.svc/CreateVEERule', {
      params: {
        dto: rule
      },
      commonErrorHandling: false,
      success: function(rule) {
        AppDispatcher.dispatch({
          type: Action.SET_SELECTED_RULE_ID,
          id: rule.Id
        });
        that.GetVEERules();
      },
      error: function(err, res) {
        let ErrorMsg = CommonFuns.getErrorMessageByRes(res.text);
        AppDispatcher.dispatch({
          type: Action.VEE_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
        console.log(err, res);
      }
    });
  },
  modifyVEERule: function(rule) {
    var that = this;
    Ajax.post('/VEE.svc/ModifyVEERule', {
      params: {
        dto: rule
      },
      commonErrorHandling: false,
      success: function(rule) {
        AppDispatcher.dispatch({
          type: Action.SET_SELECTED_RULE_ID,
          id: rule.Id
        });
        that.GetVEERules();
      },
      error: function(err, res) {
        let ErrorMsg = CommonFuns.getErrorMessageByRes(res.text);
        AppDispatcher.dispatch({
          type: Action.VEE_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
        console.log(err, res);
      }
    });
  },
  deleteRule: function(data) {
    Ajax.post('/VEE.svc/DeleteVEERule', {
      params: {
        filter: data
      },
      success: function() {
        AppDispatcher.dispatch({
          type: Action.DELETE_RULE_SUCCESS,
          id: data.Ids[0]
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getAssociatedTag: function(page, ruleId, association, filterObj, refresh) {
    _page = page;
    _ruleId = ruleId;
    _association = association;
    _filterObj = filterObj;
    Ajax.post('/VEE.svc/GetVEETagsByFilter', {
      params: {
        filter: {
          CustomerId: window.currentCustomerId,
          Association: association,
          Type: 1,
          RuleIds: [ruleId],
          HierarchyIds: null,
          CommodityId: filterObj.CommodityId,
          UomId: filterObj.UomId,
          IsAccumulated: filterObj.IsAccumulated,
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
  modifyVEETags: function(ruleId, tagIds) {
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
        that.getAssociatedTag(_page, _ruleId, _association, ruleId !== null);
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },

};

module.exports = VEEAction;
