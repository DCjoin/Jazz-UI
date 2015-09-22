'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Folder.jsx';
import GlobalErrorMessageAction from '../actions/GlobalErrorMessageAction.jsx';
import Ajax from '../ajax/ajax.jsx';
import Immutable from 'immutable';
let FolderAction = {
  getFolderTreeByCustomerId(customerId) {
    Ajax.post('/Dashboard.svc/GetWdigetFolderTreeByCustomerId', {
      params: {
        customerId: customerId
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
  createWidgetOrFolder(parentNode, name, type, customerId, widgetType) {
    var dto = {
      ParentId: parentNode.get("Id"),
      Name: name,
      Type: type,
      CustomerId: customerId,
      WidgetType: widgetType
    };
    Ajax.post('/Dashboard.svc/CreateWidgetOrFolder', {
      params: {
        dto: dto
      },
      success: function(newNode) {
        AppDispatcher.dispatch({
          type: Action.CREATE_FOLDER_OR_WIDGET,
          newNode: newNode,
          parentNode: parentNode
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  modifyFolderName: function(widgetFolderDto, newName) {
    Ajax.post('/Dashboard.svc/ModifyFolderName', {
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
  copyItem: function(sourceItem, destItem, newName) {
    Ajax.post('/Dashboard.svc/CopyItem', {
      params: {
        sourceTreeNode: sourceItem.toJSON(),
        desFolder: destItem.toJSON(),
        newName: newName,
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
    Ajax.post('/Dashboard.svc/DeleteFolderOrWidgetById', {
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
    Ajax.post('/Dashboard.svc/ModfiyReadingStatus', {
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
  sendFolderCopy: function(sourceTreeNode, userIds) {
    Ajax.post('/Dashboard.svc/SendItemCopy', {
      params: {
        sourceTreeNode: sourceTreeNode.toJSON(),
        userIds: userIds
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
  shareItemCopy: function(sourceTreeNode, userIds) {
    Ajax.post('/CollaborativeWidget.svc/ShareCollaborativeWidget', {
      params: {
        widget: sourceTreeNode.toJSON(),
        userIds: userIds
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
    Ajax.post('/Dashboard.svc/MoveItem', {
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
          nextNode: Immutable.fromJS(nextNode),
          newNode: Immutable.fromJS(newNode)
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.MOVE_ITEM_ERROR,
          sourceNode: sourceNode
        });
      },
    });
  },
  GetWidgetDtos(widgetIds, selectedNode) {
    setTimeout(() => {
      AppDispatcher.dispatch({
        type: Action.GET_WIDGETDTOS_LOADING,
        selectedNode: selectedNode
      })
    }, 0);

    Ajax.post('/Dashboard.svc/GetWidgetDtos', {
      params: {
        widgetIds: widgetIds
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
  updateWidgetDtos(widgetDto) {
    let originWidgetDto = widgetDto;
    Ajax.post('/Dashboard.svc/CreateWidget', {
      params: {
        widgetDto: widgetDto
      },
      success: function(widgetDto) {
        GlobalErrorMessageAction.fireGlobalErrorMessage(I18N.Folder.WidgetSaveSuccess);
        AppDispatcher.dispatch({
          type: Action.UPDATE_WIDGETDTOS_SUCCESS,
          widgetDto: originWidgetDto
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
    Ajax.post('/Dashboard.svc/ExportWidget', {
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
  }
};

module.exports = FolderAction;
