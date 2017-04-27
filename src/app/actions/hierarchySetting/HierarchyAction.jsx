'use strict';
import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/hierarchySetting/Hierarchy.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import HierarchyStore from 'stores/hierarchySetting/HierarchyStore.jsx';
import CommonFuns from 'util/Util.jsx';
import Path from 'constants/Path.jsx';
import Immutable from 'immutable';
var _page,
  _hierarchyId,
  _association,
  _filterObj;
let HierarchyAction = {
  GetHierarchys: function(customerId,selectedId, isFromBuilding = false) {
    let that = this;
    Ajax.post('/Hierarchy/GetHierarchyTreeDtosRecursive', {
      params: {
        customerId: customerId,
      },
      success: function(hierarchys) {
        AppDispatcher.dispatch({
          type: Action.GET_HIERARCHY_TREE_DTOS,
          hierarchys: hierarchys,
          selectedId: selectedId
        });
        if (isFromBuilding) {
          that.getAssociatedTag(customerId,_page, _hierarchyId, _association, _filterObj, _hierarchyId !== null);
        }
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
    Ajax.post('/Customer/GetCustomersByFilter', {
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
          that.GetHierarchys(customerId);
        }
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getLogListByCustomerId: function(CustomerId) {
    Ajax.post('/Hierarchy/GetHierarchyImportHistory', {
      params: {
        customerId: parseInt(CustomerId)
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
  getAssociatedTag: function(customerId,page, hierarchyId, association, filterObj, isView) {
    _page = page;
    _hierarchyId = hierarchyId;
    _association = association;
    _filterObj = filterObj;
    var associationObj = {
      AssociationId: hierarchyId,
      AssociationOption: association
    };
    if (!isView) {
      associationObj.Associatiable = true;
    }
    Ajax.post('/Tag/GetTagsByFilter', {
      params: {
        filter: {
          CustomerId: parseInt(customerId),
          Association: associationObj,
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
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  modifyTags: function(customerId,hierarchyId, tags, associationType, hierarchyType) {
    var that = this;
    Ajax.post('/Tag/SetAssociation', {
      params: {
        dto: {
          AssociationId: hierarchyId,
          AssociationType: associationType,
          Tags: tags
        }
      },
      success: function(data) {
        if (hierarchyId === null) {
          if (HierarchyStore.getTotal() - 1 > 0 && parseInt((HierarchyStore.getTotal() - 1 + 19) / 20) < _page) {
            _page = _page - 1;
          }
          that.getAssociatedTag(customerId,_page, _hierarchyId, _association, _filterObj, _hierarchyId !== null);
        }
        if (hierarchyType === 2) {
          that.GetHierarchys(customerId,HierarchyStore.getSelectedNode().get('Id'), true);
        } else {
          that.getAssociatedTag(customerId,_page, _hierarchyId, _association, _filterObj, _hierarchyId !== null);
        }

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
  setEnergyConsumption: function(tag, value, type, hierarchyId) {
    Ajax.post('/Tag/SetEnergyConsumption', {
      params: {
        dto: {
          AssociationId: hierarchyId,
          AssociationType: type,
          EnergyConsumption: value,
          Tags: tag
        }
      },
      success: function(tag) {
        AppDispatcher.dispatch({
          type: Action.SET_ENERGY_CONSUMPTION,
          tag: tag
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  createHierarchy: function(dto) {
    var that = this;
    Ajax.post('/Hierarchy/CreateHierarchy', {
      params: {
        hierarchy: dto
      },
      commonErrorHandling: false,
      success: function(node) {
        AppDispatcher.dispatch({
          type: Action.SET_SELECTED_HIERARCHY_NODE,
          node: Immutable.fromJS(node)
        });
        if (node.Type === 101) {
          that.GetHierarchys(dto.CustomerId,-node.Id);
        } else {
          that.GetHierarchys(dto.CustomerId,node.Id);
        }

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
    var that = this,
      id = dto.Id;
    Ajax.post('/Hierarchy/ModifyHierarchy', {
      params: {
        hierarchy: HierarchyStore.traversalNode(dto)
      },
      commonErrorHandling: false,
      success: function(node) {
        AppDispatcher.dispatch({
          type: Action.SET_SELECTED_HIERARCHY_NODE,
          node: Immutable.fromJS(node)
        });
        that.GetHierarchys(dto.CustomerId,id);
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
    Ajax.post('/Hierarchy/DeleteHierarchy', {
      params: {
        hierarchy: HierarchyStore.traversalNode(dto)
      },
      commonErrorHandling: false,
      success: function() {
        AppDispatcher.dispatch({
          type: Action.DELETE_HIERARCHY_DTO_SUCCESS,
        // nextSelectedNode: HierarchyStore.findNextSelectedNode(HierarchyStore.traversalNode(dto))
        });
        that.GetHierarchys(dto.CustomerId,HierarchyStore.findNextSelectedNode(HierarchyStore.traversalNode(dto)).get('Id'));
      },
      error: function(err, res) {
        let ErrorMsg = CommonFuns.getErrorMessageByRes(res.text);
        let type = HierarchyStore.getNameByType(dto.Type);
        AppDispatcher.dispatch({
          type: Action.HIERARCHY_ERROR,
          title: I18N.format(I18N.Setting.Hierarchy.CannotDeleteTitle, type, dto.Name),
          content: ErrorMsg,
        });
        console.log(err, res);
      }
    });
  },
  getAllCalendar: function() {
    Ajax.post('/Administration/GetAllCalendars', {
      params: {
      },
      success: function(calendar) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_CALENDARS_FOR_HIERARCHY,
          calendar: calendar
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getCalendar: function(hierarchyId) {
    Ajax.post('/Hierarchy/GetHierarchyCalendarByHierarchyId', {
      params: {
        hierarchyId: hierarchyId
      },
      success: function(calendar) {
        AppDispatcher.dispatch({
          type: Action.GET_CALENDAR_FOR_HIERARCHY,
          calendar: calendar
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  cancelSaveCalendar: function() {
    AppDispatcher.dispatch({
      type: Action.CANCEL_SAVE_CALENDAR
    });
  },
  saveCalendar: function(calendar) {
    Ajax.post('/Hierarchy/SaveHierarchyCalendar', {
      params: {
        dto: calendar
      },
      success: function(calendar) {
        AppDispatcher.dispatch({
          type: Action.SET_CALENDAR_FOR_HIERARCHY,
          calendar: calendar
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getProperty: function(hierarchyId) {
    Ajax.post('/Hierarchy/GetAdvancedPropertyValuesByHierarchy', {
      params: {
        hierarchyId: hierarchyId
      },
      success: function(property) {
        AppDispatcher.dispatch({
          type: Action.GET_PROPERTY_FOR_HIERARCHY,
          property: property
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  cancelSaveProperty: function() {
    AppDispatcher.dispatch({
      type: Action.CANCEL_SAVE_PROPERTY
    });
  },
  saveProperty: function(property) {
    Ajax.post('/Hierarchy/SetAdvancedPropertyValues', {
      params: {
        setting: property
      },
      success: function(property) {
        AppDispatcher.dispatch({
          type: Action.SET_PROPERTY_FOR_HIERARCHY,
          property: property
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getAllIndustries: function(customerId) {
    var that = this;
    Ajax.post('/Administration/GetAllIndustries', {
      params: {
        includeRoot: false,
        onlyLeaf: true,
        sysId:1
      },
      success: function(industries) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_INDUSTRIES_FOR_HIERARCHY,
          industries: industries
        });
        that.getAllZones(customerId);
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  getAllZones: function(customerId) {
    var that = this;
    Ajax.post('/Administration/GetAllZones', {
      params: {
        includeRoot: false
      },
      success: function(zones) {
        AppDispatcher.dispatch({
          type: Action.GET_ALL_ZONES_FOR_HIERARCHY,
          zones: zones
        });
        that.getCustomersByFilter(customerId, true);
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  modifyHierarchyPath: function(customerId,DesParent, MovingHierarchies, NextBrother, PreviousBrother) {
    var that = this;
    Ajax.post('/Hierarchy/ModifyHierarchyPath', {
      params: {
        hierarchyMovingDto: {
          DesParent: DesParent,
          MovingHierarchies: [MovingHierarchies],
          NextBrother: NextBrother,
          PreviousBrother: PreviousBrother
        }
      },
      commonErrorHandling: false,
      success: function(result) {
        that.GetHierarchys(customerId,MovingHierarchies.Id);
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
  getCostByHierarchy: function(hierarchyId, refresh = false) {
    Ajax.post('/Cost/GetCostByHierarchy', {
      params: {
        hierarchyId: hierarchyId
      },
      success: function(cost) {
        AppDispatcher.dispatch({
          type: Action.GET_COST_BY_HIERARCHY,
          cost: cost
        });
        if (refresh) {
          AppDispatcher.dispatch({
            type: Action.SAVE_COST_BY_HIERARCHY_SUCCESS
          });
        }
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  saveCost: function(cost) {
    var that = this;
    Ajax.post('/Cost/SaveCost', {
      params: {
        dto: cost
      },
      success: function(cost) {
        that.getCostByHierarchy(cost.HierarchyId, true);


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
  resetAll: function() {
    AppDispatcher.dispatch({
      type: Action.RESET_ALL_FOR_HIERARCHY,
    });
  },
  getConsultants: function(hierarchyId) {    
    // setTimeout(() => {
    //     AppDispatcher.dispatch({
    //       type: Action.GET_CONSULTANTS,
    //       data: [{
    //         Id: 1,
    //         RealName: '劳伦斯',
    //         UserPhoto: 'http://img.idol001.com/origin/2017/04/10/805dcd0af2fab1c9d3f951f7d96aeb4e1491790409.jpg',
    //         Telephone: 123456789,
    //         Email: 'asdfa@adsf.coin'
    //       }],
    //     });  
    // }, 1000);
    AppDispatcher.dispatch({
      type: Action.GET_CONSULTANTS,
      data: null,
    });
    Ajax.get(CommonFuns.replacePathParams(Path.Hierarchy.getConsultants, hierarchyId), {
      avoidDuplicate: true,
      tag: 'getConsultants',
      success: res => {
        AppDispatcher.dispatch({
          type: Action.GET_CONSULTANTS,
          data: res,
        });
      }
    });
  }
};

module.exports = HierarchyAction;
