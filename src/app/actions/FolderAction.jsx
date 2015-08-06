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
      widgetType:widgetType
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
  modifyFolderName:function(sourceId,newName){
    Ajax.post('/Dashboard.svc/ModifyFolderName', {
         params: {
           sourceId:sourceId,
           newName:newName
          },
        success: function(newNode){
          AppDispatcher.dispatch({
              type: Action.MODIFY_NAME_SECCESS,
              newNode: newNode
          });
        },
        error: function(err, res){
          AppDispatcher.dispatch({
              type: Action.MODIFY_NAME_ERROR,
              res:res
          });
        }
    });

  },
};

module.exports = FolderAction;
