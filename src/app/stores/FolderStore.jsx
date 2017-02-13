import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List, updater, update, Map } from 'immutable';

import Folder from '../constants/actionType/Folder.jsx';
import UserStore from './UserStore.jsx';

let _folderTree = Immutable.fromJS(),
  _parentId = null,
  _changedNode = Immutable.fromJS(),
  _newNode = null,
  _newCreateNode = null,
  _modifyNameErrorCode = null,
  _errorName = null,
  _errorType = null,
  _selectedNode = null,
  _sendStatus = null,
  _shareStatus = null,
  _dialogInfo = null;
let FOLDER_TREE_EVENT = 'foldertree',
  CREATE_FOLDER_EVENT = 'createfolder',
  MODIFY_NAME_ERROR_EVENT = 'modifynameerror',
  MODIFY_NAME_SUCCESS_EVENT = 'modifynamesuccess',
  COPY_ITEM_SUCCESS_EVENT = 'copyitemsuccess',
  COPY_ITEM_ERROR_EVENT = 'copyitemerror',
  DELETE_ITEM_SUCCESS_EVENT = 'deleteitemsuccess',
  SEND_STATUS_EVENT = 'sendstatus',
  SELECTED_NODE_EVENT = 'selectednode',
  MOVE_ITEM_SUCCESS_EVENT = 'moveitemsuccess',
  MOVE_ITEM_ERROR_EVENT = 'moveitemerror',
  MODIFY_READING_STATUS_EVENT = 'modifyreadingstatus',
  EXPORT_WIDGET_ERROR_EVENT = 'exportwidgeterror',
  EXPORT_WIDGET_SUCCESS_EVENT = 'exportwidgetsuccess',
  SHARE_STATUS_EVENT = 'sharestatus',
  SAVE_ALARM_WIDGET_SUCCESS_EVENT = 'savealarmwidgetsuccess',
  SAVE_ALARM_WIDGET_ERROR_EVENT = 'savealarmwidgeterror',
  DIALOG_EVENT = 'dialog',
  CHECK_WIDGET_UPDATE_CHANGE_EVENT = 'check_widget_update_change_event';

var FolderStore = assign({}, PrototypeStore, {

  setFolderTree: function(treeNode) {
    _folderTree = Immutable.fromJS(treeNode);
    _selectedNode = _folderTree;
  },
  getFolderTree: function() {
    return _folderTree;
  },
  getNodeById: function(id) {
    var node;
    var f = function(item) {
      if (item.get('Id') == id) {
        node = item;
      } else {
        if (item.get('Children')) {
          item.get('Children').forEach(child => {
            f(child)
          })
        }
      }
    };
    f(_folderTree);
    return node;
  },
  getParent: function(node) {
    var parent;
    var f = function(item) {
      if (item.get('Id') == node.get('ParentId')) {
        parent = item;
      } else {
        if (item.get('Children')) {
          item.get('Children').forEach(child => {
            f(child)
          })
        }
      }
    };
    f(_folderTree);
    return parent;
  },
  modifyTreebyNode: function(node) {
    var that = this;
    if (node.get("Id") == _parentId) {
      return _changedNode;
    } else {

      if (node.get('Children')) {
        var children = node.get('Children');
        var index = null;
        var changedNode = null;
        children.forEach(function(item, i) {
          let result = that.modifyTreebyNode(item);
          if (result) {
            index = i;
            changedNode = result;
          }
        });
        if (index !== null) {
          node = node.set('Children', children.update(index, (item) => {
            return changedNode
            }))
            return node;
          }
        }
        return false;
      }
    },
    createFolderOrWidget: function(parentNode, newNode, isNew) {
      _parentId = parentNode.get('Id');
      _changedNode = parentNode;
      _newNode = Immutable.fromJS(newNode);
      _newCreateNode = newNode;

      if (_changedNode.get('Children')) {
        let children = isNew ?
          _changedNode.get('Children').unshift(_newNode) :
          _changedNode.get('Children').push(_newNode);
        _changedNode = _changedNode.set('Children', children);
      } else {
        let children = Immutable.List([]);
        children = children.push(_newNode);
        _changedNode = _changedNode.set('Children', children);
      }
      if (_newNode.get('Type') == 6) {
        let subFolderCount = _changedNode.get('ChildFolderCount') + 1;
        _changedNode = _changedNode.set('ChildFolderCount', subFolderCount);
      } else {
        let subWidgetCount = _changedNode.get('ChildWidgetCount') + 1;
        _changedNode = _changedNode.set('ChildWidgetCount', subWidgetCount);
      }
      _folderTree = this.modifyTreebyNode(_folderTree);
      _selectedNode = _newNode;
    },
    getNewNode: function() {
      return _newCreateNode;
    },
    modifyName: function(newNode) {
      var parent = this.getParent(newNode);

      var children = parent.get('Children');
      parent = parent.set('Children', children.update(children.findIndex(item => item.get('Id') == newNode.get('Id')), (item) => {
        return newNode;
      }));
      _parentId = parent.get('Id');
      _changedNode = parent;
      _folderTree = this.modifyTreebyNode(_folderTree);
      _modifyNameErrorCode = null;
      _errorName = null;
      _errorType = null;
      _selectedNode = newNode;
    },
    copyItem: function(destItem, newNode) {
      var parent = destItem;
      var children;
      var _newNode = newNode;
      if (parent.get('Children')) {
        children = parent.get('Children');
      } else {
        children = Immutable.List([]);
      }
      parent = parent.set('Children', children.push(_newNode));
      _parentId = parent.get('Id');
      _changedNode = parent;
      if (_newNode.get('Type') == 6) {
        let subFolderCount = _changedNode.get('ChildFolderCount') + 1;
        _changedNode = _changedNode.set('ChildFolderCount', subFolderCount);
      } else {
        let subWidgetCount = _changedNode.get('ChildWidgetCount') + 1;
        _changedNode = _changedNode.set('ChildWidgetCount', subWidgetCount);
      }
      _folderTree = this.modifyTreebyNode(_folderTree);
      _selectedNode = newNode;
    },
    insertItem: function(preItem, nextItem, newNode) {
      var parent, temp;
      if (preItem || nextItem) {
        parent = (!!preItem) ? this.getParent(preItem) : this.getParent(nextItem);
        var children = parent.get('Children');
        var index = (!!preItem) ? children.indexOf(preItem) : children.indexOf(nextItem);
        var pre, next;
        if (!!preItem) {
          pre = children.filter((item, i) => (i <= index));
          next = children.filter((item, i) => (i > index));
        } else {
          pre = children.filter((item, i) => (i < index));
          next = children.filter((item, i) => (i >= index));
        }
        temp = pre.push(newNode).concat(next);
      } else {
        parent = this.getParent(newNode);
        var children = parent.get('Children');
        if (children) {
          temp = children.push(newNode);
        } else {
          temp = Immutable.fromJS([]);
          temp = temp.push(newNode);
        }
      }
      parent = parent.set('Children', temp);
      _parentId = parent.get('Id');
      _changedNode = parent;
      if (newNode.get('Type') == 6) {
        let subFolderCount = _changedNode.get('ChildFolderCount') + 1;
        _changedNode = _changedNode.set('ChildFolderCount', subFolderCount);
      } else {
        let subWidgetCount = _changedNode.get('ChildWidgetCount') + 1;
        _changedNode = _changedNode.set('ChildWidgetCount', subWidgetCount);
      }
      _folderTree = this.modifyTreebyNode(_folderTree);
      _selectedNode = newNode;
    },
    deleteItem: function(deleteNode, isLoadByWidget) {
      //如果左边选中的是一个widget，在右边执行删除后，左边焦点项下移
      var parent = this.getParent(deleteNode);
      var children = parent.get('Children');
      var index = children.findIndex(item => item.get('Id') == deleteNode.get('Id'));
      parent = parent.set('Children', children.delete(index));
      _parentId = parent.get('Id');
      _changedNode = parent;
      if (deleteNode.get('Type') == 6) {
        let subFolderCount = _changedNode.get('ChildFolderCount') - 1;
        _changedNode = _changedNode.set('ChildFolderCount', subFolderCount);
      } else {
        let subWidgetCount = _changedNode.get('ChildWidgetCount') - 1;
        _changedNode = _changedNode.set('ChildWidgetCount', subWidgetCount);
      }
      _folderTree = this.modifyTreebyNode(_folderTree);
      // if (isLoadByWidget) {
      //   if (index == children.size - 1) {
      //     _selectedNode = children.find((item, i) => (i == index - 1));
      //   } else {
      //     _selectedNode = children.find((item, i) => (i == index + 1));
      //   }
      //
      // } else {
      //   _selectedNode = _changedNode;
      // }
      if (isLoadByWidget) {
        if (children.size == 1) {
          _selectedNode = _changedNode;
        } else {
          if (index == children.size - 1) {
            _selectedNode = children.find((item, i) => (i == index - 1));
          } else {
            _selectedNode = children.find((item, i) => (i == index + 1));
          }

        }
      } else {
        _selectedNode = this.getNodeById(_selectedNode.get('Id'));
      }



    },
    setModifyNameError: function(res, newName, type) {
      var errorCode = eval("(" + res + ")");
      _modifyNameErrorCode = errorCode.error.Code;
      _errorName = newName;
      if (type == 6) {
        _errorType = I18N.Folder.FolderName;
      } else {
        _errorType = I18N.Folder.WidgetName;
      }
    },
    GetModifyNameError: function() {
      var error;
      var length = _modifyNameErrorCode.length;
      var errorCode = _modifyNameErrorCode.substring(length - 5, length);
      switch (errorCode) {
        case "05032":
          //FolderNameDuplicated
          error = I18N.format(I18N.Folder.SaveNameError.E032, _errorName, _errorType);
          break;
        case "05029":
          error = I18N.format(I18N.Folder.SaveNameError.E029, _errorType);
          break;
        case "05030":
          error = I18N.format(I18N.Folder.SaveNameError.E030, _errorType);
          break;
      }
      return error;
    },
    setMoveItemError: function(node) {
      _errorName = node.Name;
      if (node.Type == 6) {
        _errorType = I18N.Folder.FolderName;
      } else {
        _errorType = I18N.Folder.WidgetName;
      }
      _selectedNode = Immutable.fromJS(node);
    },
    getMoveItemError: function() {
      return I18N.format(I18N.Folder.Drag.Error, _errorName, _errorType);
    },
    setSelectedNode: function(selectedNode) {
      _selectedNode = selectedNode;
    },
    getSelectedNode: function() {
      return _selectedNode;
    },
    getDefaultName: function(nodeName, parentNode, type, isNew) {
      var nameArray = [];
      if (parentNode.get('Children')) {
        parentNode.get('Children').forEach(function(child) {
          if (child.get('Type') == type) {
            if (child.get('Name').indexOf(nodeName) >= 0) {
              nameArray.push(child.get('Name'));
            }
          }
        });
      }
      var name = nodeName;
      for (var i = 1; i <= nameArray.length; i++) {
        var has = false;
        nameArray.forEach(function(item, i) {
          if (item == name) {
            has = true;
          }
        }
        )
        if (!has) {
          return name;
        } else {
          name = I18N.format(
            isNew ? I18N.Template.Copy.DefaultNameNew : I18N.Template.Copy.DefaultName, 
            nodeName) + i;
        }
      }
      return name;
    },
    getCopyLabelName: function(node, type) {
      var parent = this.getParent(node);
      return this.getDefaultName(node.get('Name'), parent, type);
    },

    setSendStatus: function(sourceNode, userIds) {
      if (userIds.length === 0) {
        _sendStatus = I18N.format(I18N.Folder.Send.Success, sourceNode.get('Name'));
      } else {
        let userNames;
        let userList = UserStore.getUserStatus();
        userList.forEach(function(user, i) {
          var hasUser = false;
          userIds.forEach(function(id) {
            if (id == user.get('Id')) {
              hasUser = true;
            }
          });
          if (hasUser) {
            if (userNames) {
              userNames = userNames + ',' + user.get('Name');
            } else {
              userNames = user.get('Name');
            }
          }
        });
        _sendStatus = I18N.format(I18N.Folder.Send.Error, sourceNode.get('Name'), userNames);

      }

    },
    setShareStatus: function(sourceNode, userIds) {
      if (userIds.length === 0) {
        _shareStatus = I18N.format(I18N.Folder.Share.Success, sourceNode.get('Name'));
      } else {
        let userNames;
        let userList = UserStore.getUserStatus();
        userList.forEach(function(user, i) {
          var hasUser = false;
          userIds.forEach(function(id) {
            if (id == user.get('Id')) {
              hasUser = true;
            }
          });
          if (hasUser) {
            if (userNames) {
              userNames = userNames + ',' + user.get('Name');
            } else {
              userNames = user.get('Name');
            }
          }
        });
        _shareStatus = I18N.format(I18N.Folder.Share.Error, sourceNode.get('Name'), userNames);

      }

    },
    getShareStatus: function() {
      return _shareStatus;
    },
    getSendStatus: function() {
      return _sendStatus;
    },
    updateWidgetDtosSuccess: function(widgetDto) {
      _changedNode = Immutable.fromJS(widgetDto);
      _parentId = widgetDto.Id;
      _folderTree = this.modifyTreebyNode(_folderTree);
      _selectedNode = _changedNode;
    },
    moveItem: function(sourceNode, parentNode, preNode, nextNode, newNode) {
      this.deleteItem(sourceNode);
      // if (nextNode === null) {
      //   this.copyItem(parentNode, newNode);
      // } else {
      //   this.insertItem(nextNode, newNode);
      // }
      this.insertItem(preNode, nextNode, newNode);
    },
    ModfiyReadingStatus: function(nodeData) {
      _parentId = nodeData.get('Id');
      _changedNode = nodeData.set('IsRead', true);
      _folderTree = this.modifyTreebyNode(_folderTree);
    },
    setDisplayDialog: function(type, node, contentInfo) {
      _dialogInfo = {
        type: type,
        node: node,
        contentInfo: contentInfo
      };
    },
    switchWidget: function() {
      var id = _selectedNode.get('ParentId');
      this.deleteItem(_selectedNode, false);
      if (!!_dialogInfo.node) {
        _selectedNode = this.getNodeById(_dialogInfo.node.get('Id')) ;
      } else {
        _selectedNode = this.getNodeById(id);
      }

    },
    getDisplayDialog: function() {
      return _dialogInfo;
    },
    emitFolderTreeChange: function() {
      this.emit(FOLDER_TREE_EVENT);
    },
    addFolderTreeListener: function(callback) {
      this.on(FOLDER_TREE_EVENT, callback);
    },

    removeFolderTreeListener: function(callback) {
      this.removeListener(FOLDER_TREE_EVENT, callback);
      this.dispose();
    },
    emitDialogChange: function() {
      this.emit(DIALOG_EVENT);
    },
    addDialogListener: function(callback) {
      this.on(DIALOG_EVENT, callback);
    },

    removeDialogListener: function(callback) {
      this.removeListener(DIALOG_EVENT, callback);
      this.dispose();
    },
    emitCreateFolderOrWidgetChange: function() {
      this.emit(CREATE_FOLDER_EVENT);
    },
    addCreateFolderOrWidgetListener: function(callback) {
      this.on(CREATE_FOLDER_EVENT, callback);
    },

    removeCreateFolderOrWidgetListener: function(callback) {
      this.removeListener(CREATE_FOLDER_EVENT, callback);
      this.dispose();
    },
    emitModifyNameSuccessChange: function() {
      this.emit(MODIFY_NAME_SUCCESS_EVENT);
    },
    addModifyNameSuccessListener: function(callback) {
      this.on(MODIFY_NAME_SUCCESS_EVENT, callback);
    },

    removeModifyNameSuccessListener: function(callback) {
      this.removeListener(MODIFY_NAME_SUCCESS_EVENT, callback);
      this.dispose();
    },
    emitModifyNameErrorChange: function() {
      this.emit(MODIFY_NAME_ERROR_EVENT);
    },
    addModifyNameErrorListener: function(callback) {
      this.on(MODIFY_NAME_ERROR_EVENT, callback);
    },

    removeModifyNameErrorListener: function(callback) {
      this.removeListener(MODIFY_NAME_ERROR_EVENT, callback);
      this.dispose();
    },
    emitCopyItemErrorChange: function() {
      this.emit(COPY_ITEM_ERROR_EVENT);
    },
    addCopyItemErrorListener: function(callback) {
      this.on(COPY_ITEM_ERROR_EVENT, callback);
    },
    removeCopyItemErrorListener: function(callback) {
      this.removeListener(COPY_ITEM_ERROR_EVENT, callback);
      this.dispose();
    },
    emitCopyItemSuccessChange: function() {
      this.emit(COPY_ITEM_SUCCESS_EVENT);
    },
    addCopyItemSuccessListener: function(callback) {
      this.on(COPY_ITEM_SUCCESS_EVENT, callback);
    },
    removeCopyItemSuccessListener: function(callback) {
      this.removeListener(COPY_ITEM_SUCCESS_EVENT, callback);
      this.dispose();
    },
    emitDeleteItemSuccessChange: function() {
      this.emit(DELETE_ITEM_SUCCESS_EVENT);
    },
    addDeleteItemSuccessListener: function(callback) {
      this.on(DELETE_ITEM_SUCCESS_EVENT, callback);
    },
    removeDeleteItemSuccessListener: function(callback) {
      this.removeListener(DELETE_ITEM_SUCCESS_EVENT, callback);
      this.dispose();
    },
    emitMoveItemSuccessChange: function() {
      this.emit(MOVE_ITEM_SUCCESS_EVENT);
    },
    addMoveItemSuccessListener: function(callback) {
      this.on(MOVE_ITEM_SUCCESS_EVENT, callback);
    },
    removeMoveItemSuccessListener: function(callback) {
      this.removeListener(MOVE_ITEM_SUCCESS_EVENT, callback);
      this.dispose();
    },
    emitMoveItemErrorChange: function() {
      this.emit(MOVE_ITEM_ERROR_EVENT);
    },
    addMoveItemErrorListener: function(callback) {
      this.on(MOVE_ITEM_ERROR_EVENT, callback);
    },
    removeMoveItemErrorListener: function(callback) {
      this.removeListener(MOVE_ITEM_ERROR_EVENT, callback);
      this.dispose();
    },
    emitSendStatusChange: function() {
      this.emit(SEND_STATUS_EVENT);
    },
    addSendStatusListener: function(callback) {
      this.on(SEND_STATUS_EVENT, callback);
    },
    removeSendStatusListener: function(callback) {
      this.removeListener(SEND_STATUS_EVENT, callback);
      this.dispose();
    },
    emitShareStatusChange: function() {
      this.emit(SHARE_STATUS_EVENT);
    },
    addShareStatusListener: function(callback) {
      this.on(SHARE_STATUS_EVENT, callback);
    },
    removeShareStatusListener: function(callback) {
      this.removeListener(SHARE_STATUS_EVENT, callback);
      this.dispose();
    },
    emitSelectedNodeChange: function() {
      this.emit(SELECTED_NODE_EVENT);
    },
    addSelectedNodeListener: function(callback) {
      this.on(SELECTED_NODE_EVENT, callback);
    },
    removeSelectedNodeListener: function(callback) {
      this.removeListener(SELECTED_NODE_EVENT, callback);
      this.dispose();
    },
    emitModfiyReadingStatusChange: function() {
      this.emit(MODIFY_READING_STATUS_EVENT);
    },
    addModfiyReadingStatusListener: function(callback) {
      this.on(MODIFY_READING_STATUS_EVENT, callback);
    },
    removeModfiyReadingStatusListener: function(callback) {
      this.removeListener(MODIFY_READING_STATUS_EVENT, callback);
      this.dispose();
    },
    emitExportWidgetErrorChange: function() {
      this.emit(EXPORT_WIDGET_ERROR_EVENT);
    },
    addExportWidgetErrorListener: function(callback) {
      this.on(EXPORT_WIDGET_ERROR_EVENT, callback);
    },
    removeExportWidgetErrorListener: function(callback) {
      this.removeListener(EXPORT_WIDGET_ERROR_EVENT, callback);
      this.dispose();
    },
    emitExportWidgetSuccessChange: function() {
      this.emit(EXPORT_WIDGET_SUCCESS_EVENT);
    },
    addExportWidgetSuccessListener: function(callback) {
      this.on(EXPORT_WIDGET_SUCCESS_EVENT, callback);
    },
    removeExportWidgetSuccessListener: function(callback) {
      this.removeListener(EXPORT_WIDGET_SUCCESS_EVENT, callback);
      this.dispose();
    },
    emitWidgetSaveSuccessChange: function() {
      this.emit(SAVE_ALARM_WIDGET_SUCCESS_EVENT);
    },
    addWidgetSaveSuccessListener: function(callback) {
      this.on(SAVE_ALARM_WIDGET_SUCCESS_EVENT, callback);
    },
    removeWidgetSaveSuccessListener: function(callback) {
      this.removeListener(SAVE_ALARM_WIDGET_SUCCESS_EVENT, callback);
      this.dispose();
    },
    emitWidgetSaveErrorChange: function() {
      this.emit(SAVE_ALARM_WIDGET_ERROR_EVENT);
    },
    addWidgetSaveErrorListener: function(callback) {
      this.on(SAVE_ALARM_WIDGET_ERROR_EVENT, callback);
    },
    removeWidgetSaveErrorListener: function(callback) {
      this.removeListener(SAVE_ALARM_WIDGET_ERROR_EVENT, callback);
      this.dispose();
    },
    emitCheckWidgetUpdateChange: function(done, cancel) {
      this.emit(CHECK_WIDGET_UPDATE_CHANGE_EVENT, done, cancel);
    },
    addCheckWidgetUpdateChangeListener: function(callback) {
      this.on(CHECK_WIDGET_UPDATE_CHANGE_EVENT, callback);
    },
    removeCheckWidgetUpdateChangeListener: function(callback) {
      this.removeListener(CHECK_WIDGET_UPDATE_CHANGE_EVENT, callback);
      this.dispose();
    },

  });

  var FolderAction = Folder.Action;

  FolderStore.dispatchToken = AppDispatcher.register(function(action) {
    switch (action.type) {
      case FolderAction.GET_FOLDER_TREE:
        FolderStore.setFolderTree(action.treeNode);
        FolderStore.emitSelectedNodeChange();
        FolderStore.emitFolderTreeChange();
        break;
      case FolderAction.CREATE_FOLDER_OR_WIDGET:
        FolderStore.createFolderOrWidget(action.parentNode, action.newNode, action.isNew);
        FolderStore.emitCreateFolderOrWidgetChange();
        FolderStore.emitSelectedNodeChange();
        break;
      case FolderAction.MODIFY_NAME_SECCESS:
        FolderStore.modifyName(Immutable.fromJS(action.newNode));
        FolderStore.emitModifyNameSuccessChange();
        FolderStore.emitSelectedNodeChange();
        break;
      case FolderAction.MODIFY_NAME_ERROR:
        FolderStore.setModifyNameError(action.res.text, action.newName, action.stype);
        FolderStore.emitModifyNameErrorChange();
        break;
      case FolderAction.SET_SELECTED_NODE:
        FolderStore.setSelectedNode(action.selectedNode);
        FolderStore.emitSelectedNodeChange();
        break;
      case FolderAction.COPY_ITEM:
        FolderStore.copyItem(action.destItem, action.newNode);
        FolderStore.emitCopyItemSuccessChange();
        FolderStore.emitSelectedNodeChange();
        break;
      case FolderAction.DELETE_ITEM:
        FolderStore.deleteItem(action.deleteNode, action.isLoadByWidget);
        FolderStore.emitDeleteItemSuccessChange();
        FolderStore.emitSelectedNodeChange();
        break;
      case FolderAction.SEND_ITEM:
        FolderStore.setSendStatus(action.sourceTreeNode, action.userIds);
        FolderStore.emitSendStatusChange();
        break;
      case FolderAction.SHARE_ITEM:
        FolderStore.setShareStatus(action.sourceTreeNode, action.userIds);
        FolderStore.emitShareStatusChange();
        break;
      case FolderAction.MOVE_ITEM:
        FolderStore.moveItem(action.sourceNode, action.parentNode, action.previousNode, action.nextNode, action.newNode);
        FolderStore.emitMoveItemSuccessChange();
        FolderStore.emitSelectedNodeChange();
        break;
      case FolderAction.MOVE_ITEM_ERROR:
        FolderStore.setMoveItemError(action.sourceNode);
        FolderStore.emitMoveItemErrorChange();
        FolderStore.emitSelectedNodeChange();
        break;
      case FolderAction.COPY_ITEM_ERROR:
        FolderStore.emitCopyItemErrorChange();
        break;
      case FolderAction.MODIFY_NODE_READ_STATUS:
        FolderStore.ModfiyReadingStatus(action.selectedNode);
        FolderStore.emitModfiyReadingStatusChange();
        break;
      case FolderAction.EXPORT_WIDGET_ERROR:
        FolderStore.emitExportWidgetErrorChange();
        break;
      case FolderAction.EXPORT_WIDGET_SUCCESS:
        FolderStore.emitExportWidgetSuccessChange();
        break;
      case FolderAction.ALARM_WIDGET_SAVE_ERROR:
        FolderStore.emitWidgetSaveErrorChange();
        break;
      case FolderAction.ALARM_WIDGET_SAVE_SUCCESS:
        FolderStore.emitWidgetSaveSuccessChange();
        break;
      case FolderAction.UPDATE_WIDGETDTOS_SUCCESS:
        FolderStore.updateWidgetDtosSuccess(action.widgetDto);
        FolderStore.emitFolderTreeChange();
        //FolderStore.emitSelectedNodeChange();
        break;
      case FolderAction.DISPLAY_DIALOG:
        FolderStore.setDisplayDialog(action.dialogType, action.nodeData, action.contentInfo);
        FolderStore.emitDialogChange();
        break;
      case FolderAction.SWTICH_WIDGET:
        FolderStore.switchWidget();
        FolderStore.emitSelectedNodeChange();
        FolderStore.emitFolderTreeChange();
      case FolderAction.CHECK_WIDGET_UPDATE:
        FolderStore.emitCheckWidgetUpdateChange(action.done, action.cancel);
        break;
    }
  });

  module.exports = FolderStore;
