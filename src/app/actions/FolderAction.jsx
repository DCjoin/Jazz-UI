'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import {Action} from '../constants/actionType/Folder.jsx';
import Ajax from '../ajax/ajax.jsx';
import Immutable from 'immutable';
let FolderAction = {
  getFolderTreeByCustomerId(customerId){
    Ajax.post('/Dashboard.svc/GetWdigetFolderTreeByCustomerId', {
         params: {
           customerId:customerId
          },
        success: function(treeNode){
          AppDispatcher.dispatch({
              type: Action.GET_FOLDER_TREE,
              treeNode: treeNode
          });
        },
        error: function(err, res){
          console.log(err,res);
        }
    });
  },
  createWidgetOrFolder(parentNode,name,type,customerId,widgetType){
    var dto={
      ParentId:parentNode.get("Id"),
      Name:name,
      Type:type,
      CustomerId:customerId,
      WidgetType:widgetType
    };
    Ajax.post('/Dashboard.svc/CreateWidgetOrFolder', {
         params: {
           dto:dto
          },
        success: function(newNode){
          AppDispatcher.dispatch({
              type: Action.CREATE_FOLDER_OR_WIDGET,
              newNode: newNode,
              parentNode:parentNode
          });
        },
        error: function(err, res){
          console.log(err,res);
        }
    });
  },
  modifyFolderName:function(widgetFolderDto,newName){
    Ajax.post('/Dashboard.svc/ModifyFolderName', {
         params: {
           widgetFolderDto:widgetFolderDto,
           newName:newName,
          },
          commonErrorHandling:false,
        success: function(newNode){
          AppDispatcher.dispatch({
              type: Action.MODIFY_NAME_SECCESS,
              newNode: newNode
          });
        },
        error: function(err, res){
          AppDispatcher.dispatch({
              type: Action.MODIFY_NAME_ERROR,
              newName:newName,
              widgetFolderDto:widgetFolderDto,
              res:res
          });
        }
    });

  },
  setSelectedNode:function(selectedNode){
    AppDispatcher.dispatch({
        type: Action.SET_SELECTED_NODE,
        selectedNode: selectedNode
    });
  },
  copyItem:function(sourceItem,destItem,newName){
    Ajax.post('/Dashboard.svc/CopyItem', {
         params: {
           sourceId:sourceItem.get('Id'),
           desParentId:destItem.get('Id'),
           newName:newName,
          },
        success: function(newNode){
          AppDispatcher.dispatch({
              type: Action.COPY_ITEM,
              destItem :destItem,
              newNode:newNode
          });
        },
        error: function(err, res){
          AppDispatcher.dispatch({
              type: Action.COPY_ITEM_ERROR,
              res:res
          });
        }
    });

  },
  deleteItem:function(node){
    Ajax.post('/Dashboard.svc/DeleteFolderOrWidgetById', {
         params: {
           id:node.get('Id'),
           type:node.get('Type')
          },
        success: function(newNode){
          AppDispatcher.dispatch({
              type: Action.DELETE_ITEM,
              deleteNode:node
          });
        },
        error: function(err, res){
          AppDispatcher.dispatch({
              type: Action.DELETE_ITEM_ERROR,
              res:res
          });
        }
    });
  },
  ModifyFolderReadStatus:function(selectedNode){
    AppDispatcher.dispatch({
        type: Action.SET_SELECTED_NODE,
        selectedNode: selectedNode
    });
  },
};

module.exports = FolderAction;
