'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Folder.jsx';
import GlobalErrorMessageAction from '../actions/GlobalErrorMessageAction.jsx';
import Ajax from '../ajax/ajax.jsx';
import Immutable from 'immutable';
let FolderAction = {
  getFolderTreeByHierarchyId(hierarchyId, isNew = false) {
    Ajax.post('/Dashboard/GetWdigetFolderTreeByHierarchyId', {
      params: {
        hierarchyId,
        isNew
      },
      success: function(treeNode) {
        AppDispatcher.dispatch({
          type: Action.GET_FOLDER_TREE,
          treeNode: treeNode
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  createWidgetOrFolder(parentNode, name, type, customerId, widgetType, HierarchyId = customerId, isNew = false) {
    var dto = {
      ParentId: parentNode.get("Id"),
      Name: name,
      Type: type,
      CustomerId: customerId,
      HierarchyId,
      WidgetType: widgetType
    };
    Ajax.post('/Dashboard/CreateWidgetOrFolder', {
      params: {
        dto: {...dto, ...{
          isNew
        }},
      },
      success: function(newNode) {
        AppDispatcher.dispatch({
          type: Action.CREATE_FOLDER_OR_WIDGET,
          newNode: newNode,
          parentNode: parentNode, 
          isNew
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  modifyFolderName: function(widgetFolderDto, newName) {
    Ajax.post('/Dashboard/ModifyFolderName', {
      params: {
        widgetFolderDto: widgetFolderDto,
        newName: newName,
      },
      commonErrorHandling: false,
      success: function(newNode) {
        AppDispatcher.dispatch({
          type: Action.MODIFY_NAME_SECCESS,
          newNode: newNode
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.MODIFY_NAME_ERROR,
          newName: newName,
          widgetFolderDto: widgetFolderDto,
          res: res
        });
      }
    });

  },
  setSelectedNode: function(selectedNode) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_NODE,
      selectedNode: selectedNode
    });
  },
  copyItem: function(sourceItem, destItem, newName, isNew = false) {
    Ajax.post('/Dashboard/CopyItem', {
      params: {
        sourceTreeNode: sourceItem.toJSON(),
        desFolder: destItem.toJSON(),
        newName: newName,
        isNew,
      },
      commonErrorHandling: false,
      success: function(newNode) {
        AppDispatcher.dispatch({
          type: Action.COPY_ITEM,
          destItem: destItem,
          newNode: Immutable.fromJS(newNode)
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.COPY_ITEM_ERROR,
          res: res
        });
      }
    });

  },
  deleteItem: function(node, isLoadByWidget) {
    Ajax.post('/Dashboard/DeleteFolderOrWidgetById', {
      params: {
        id: node.get('Id'),
        type: node.get('Type')
      },
      success: function(newNode) {
        AppDispatcher.dispatch({
          type: Action.DELETE_ITEM,
          deleteNode: node,
          isLoadByWidget: isLoadByWidget
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.DELETE_ITEM_ERROR,
          res: res
        });
      }
    });
  },
  modifyFolderReadStatus: function(selectedNode) {
    Ajax.post('/Dashboard/ModfiyReadingStatus', {
      params: {
        readStatus: true,
        id: selectedNode.get('Id')
      },
      success: function(newNode) {
        AppDispatcher.dispatch({
          type: Action.MODIFY_NODE_READ_STATUS,
          selectedNode: selectedNode
        });
      },
      error: function(err, res) {}
    });

  },
  sendFolderCopy: function(sourceTreeNode, userIds, isNew = false) {
    Ajax.post('/Dashboard/SendItemCopy', {
      params: {
        sourceTreeNode: sourceTreeNode.toJSON(),
        userIds: userIds,
        isNew,
      },
      success: function(userIds) {
        AppDispatcher.dispatch({
          sourceTreeNode: sourceTreeNode,
          type: Action.SEND_ITEM,
          userIds: userIds
        });
      },
    });
  },
  shareItemCopy: function(sourceTreeNode, userIds, isNew = false) {
    Ajax.post('/CollaborativeWidget/ShareCollaborativeWidget', {
      params: {
        widget: sourceTreeNode.toJSON(),
        userIds: userIds,
        isNew,
      },
      success: function(userIds) {
        AppDispatcher.dispatch({
          sourceTreeNode: sourceTreeNode,
          type: Action.SHARE_ITEM,
          userIds: userIds
        });
      },
    });
  },
  moveItem: function(sourceNode, parentNode, previousNode, nextNode) {
    Ajax.post('/Dashboard/MoveItem', {
      params: {
        sourceItem: sourceNode,
        desItem: parentNode,
        previousItem: previousNode,
        nextItem: nextNode
      },
      commonErrorHandling: false,
      success: function(newNode) {
        AppDispatcher.dispatch({
          type: Action.MOVE_ITEM,
          sourceNode: Immutable.fromJS(sourceNode),
          parentNode: Immutable.fromJS(parentNode),
          previousNode: Immutable.fromJS(previousNode),
          nextNode: Immutable.fromJS(nextNode),
          newNode: Immutable.fromJS(newNode)
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.MOVE_ITEM_ERROR,
          sourceNode: sourceNode,
          errorCode: res.body.error.Code
        });
      },
    });
  },
  GetWidgetDtos(widgetIds, selectedNode, isNew = false) {
    setTimeout(() => {
      AppDispatcher.dispatch({
        type: Action.GET_WIDGETDTOS_LOADING,
        selectedNode: selectedNode
      });
    }, 0);

    Ajax.post('/Dashboard/GetWidgetDtos', {
      params: {
        widgetIds: widgetIds,
        isNew
      },
      success: function(widgetDto) {
        AppDispatcher.dispatch({
          type: Action.GET_WIDGETDTOS_SUCCESS,
          widgetDto: widgetDto
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_WIDGETDTOS_ERROR,
          widgetDto: null
        });
      },
    });
  },
  updateWidgetDtos(widgetDto, menuIndex, isNew = false) {
    let originWidgetDto = widgetDto;
    Ajax.post('/Dashboard/CreateWidget', {
      params: {
        widgetDto: widgetDto,
        isNew,
      },
      success: function(Dto) {
        if (!menuIndex) {
          GlobalErrorMessageAction.fireGlobalErrorMessage(I18N.Folder.WidgetSaveSuccess);
        }

        AppDispatcher.dispatch({
          type: Action.UPDATE_WIDGETDTOS_SUCCESS,
          widgetDto: Dto
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.UPDATE_WIDGETDTOS_ERROR
        });
      },
    });
  },
  setWidgetInitState(state) {
    AppDispatcher.dispatch({
      type: Action.SET_WIDGET_INIT_STATE,
      state: state
    });
  },
  exportWidget(widgetId) {
    Ajax.post('/Dashboard/ExportWidget', {
      params: {
        widgetId: widgetId
      },
      success: function(widgetDto) {
        AppDispatcher.dispatch({
          type: Action.EXPORT_WIDGET_SUCCESS
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.EXPORT_WIDGET_ERROR
        });
      },
    });
  },
  WidgetSave(widgetDto, customerId, isNew = false) {
    let originWidgetDto = widgetDto;
    Ajax.post('/Dashboard/CreateWidget', {
      params: {
        widgetDto: widgetDto,
        customerId: customerId,
        isNew,
      },
      success: function(widgetDto) {
        GlobalErrorMessageAction.fireGlobalErrorMessage(I18N.Folder.WidgetSaveSuccess);
        AppDispatcher.dispatch({
          type: Action.ALARM_WIDGET_SAVE_SUCCESS,
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.ALARM_WIDGET_SAVE_ERROR
        });
      },
    });
  },
  SaveAsItem(sourceTreeNode, desFolder, newName, widgetDto, isNew = false) {
    let originWidgetDto = widgetDto;
    Ajax.post('/Dashboard/SaveAsItem', {
      params: {
        sourceTreeNode: {...sourceTreeNode, ...{IsSenderCopy: false, SourceUserName: null}},
        desFolder: desFolder,
        newName: newName,
        widgetDto: widgetDto,
        isNew,
      },
      success: function(newNode) {
        AppDispatcher.dispatch({
          type: Action.COPY_ITEM,
          destItem: desFolder,
          newNode: Immutable.fromJS(newNode)
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.COPY_ITEM_ERROR,
          res: res
        });
      },
    });
  },
  setDisplayDialog: function(dialogType, nodeData, contentInfo) {
    AppDispatcher.dispatch({
      type: Action.DISPLAY_DIALOG,
      dialogType: dialogType,
      nodeData: nodeData,
      contentInfo: contentInfo
    });
  },
  swtichWidget: function() {
    AppDispatcher.dispatch({
      type: Action.SWTICH_WIDGET
    });

  },
  checkWidgetUpdate: function(done, cancel, doned) {
    AppDispatcher.dispatch({
      type: Action.CHECK_WIDGET_UPDATE,
      done, cancel, doned
    });
  },
  alwaysUncheckSameWidget: function() {
    AppDispatcher.dispatch({
      type: Action.ALWAYS_UNCHECK_SAME_WIDGET,
    });
  },
  dropError: function(sourceNode) {
    AppDispatcher.dispatch({
      sourceNode,
      type: Action.MOVE_ITEM_ERROR,
      errorCode: '050001205034'
    });
  },
  getTagsDataByNodeId(nodeId) {

    Ajax.get('/energy/gettagsdatabyid/' + nodeId, {
      success: function(tagData) {
        AppDispatcher.dispatch({
          tagData,
          nodeId,
          type: Action.GET_TAG_DATA_BY_NODEID_SUCCESS
        });
      }
    });
  },
  createEnergySolution(params) {
    Ajax.post('/energysolution/create', {
      params,
      success: function(data) {
        alert('success');
        console.log(data);
      },
      error: function() {
        alert('error');
      }
    })
  }
};

module.exports = FolderAction;
