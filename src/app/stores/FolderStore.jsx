import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List,updater,update,Map} from 'immutable';

import Folder from '../constants/actionType/Folder.jsx';

let _folderTree=Immutable.fromJS(),
    _parentId=null,
    _changedNode=Immutable.fromJS(),
    _newNode=null,
    _modifyNameErrorCode=null;
let FOLDER_TREE_EVENT = 'foldertree',
    CREATE_FOLDER_EVENT='createfolder',
    MODIFY_NAME_ERROR_EVENT='modifynameerror';

var FolderStore = assign({},PrototypeStore,{

  setFolderTree:function(treeNode){
    _folderTree=Immutable.fromJS(treeNode)
  },
  getFolderTree:function(){
    return _folderTree
  },
  getNewNode:function(){
    return _newNode
  },
  getNodeById:function(parent){
    var that=this;
    if(parent.get("Id") == _parentId){
      return parent;
    }
    else{
      if(parent.Children){
        parent.Children.forEach(item=>{
          that.getNodeById(item);
        });
      }
    }
  },
  modifyTreebyNode:function(node){
    var that=this;
    if(node.get("Id") == _parentId){
      return _changedNode;
    }
    else{
      if(node.get('Children')){
          var children=node.get('Children');
          var index=null;
          var changedNode=null;
          children.forEach(function(item,i){
            let node=that.modifyTreebyNode(item);
            if(node) {
              index=i;
              changedNode=node;
            }
          });
          node=node.set('Children',children.update(index,(item)=>{return changedNode}));
        return node;
      }
      return false;
    }
  },
  createFolderOrWidget:function(parentNode,newNode){
  _parentId=parentNode.get('Id');
  _changedNode=parentNode;
  _newNode=Immutable.fromJS(newNode);

   if(_changedNode.get('Children')){
     let children=_changedNode.get('Children').push(_newNode);
     _changedNode=_changedNode.set('Children',children);
   }
   else {
     let children=Immutable.List([]);
     children=children.push(_newNode);
     _changedNode=_changedNode.set('Children',children);
     if(_newNode.get('Type')==6){
       let subFolderCount =  _changedNode.get('SubFolderCount')+1;
        _changedNode=_changedNode.set('SubFolderCount',subFolderCount);
     }
     else {
       let subWidgetCount  =  _changedNode.get('SubWidgetCount ')+1;
        _changedNode=_changedNode.set('SubWidgetCount ',subWidgetCount );
     }
   }
   _folderTree=this.modifyTreebyNode(_folderTree);
  },
  modifyName:function(newNode){
    var parent;
    var f=function(item){
      if(item.get('Id')==newNode.get('ParentId ')){
        parent = item;
      }
      else {
        if(item.get('Children')){
          item.get('Children').forEach(child=>{f(child)})
        }
      }
    };
    f(_folderTree);
    var children=parent.get('Children');
    parent=parent.set('Children',children.update(children.findIndex(item=>item.get('Id')==newNode.get('Id')),(item)=>{
      return newNode;
    }));
    _parentId=parent.get('Id');
    _changedNode=parent;
    _folderTree=this.modifyTreebyNode(_folderTree);
    _modifyNameErrorCode=null;
  },
  setModifyNameError:function(errorCode){
    var errorCode=eval("(" + res + ")");
    _modifyNameErrorCode=errorCode.error.Code
  },
  GetModifyNameError:function(text){
    var error={};
    var length=_modifyNameErrorCode.length;
    var errorCode=_modifyNameErrorCode.substring(length-5,length-1);
    switch(errorCode){
          case "05029":
            error.chartTitle="该名称已存在";
            break;
          case "05030":
            error.oldDashboard="该仪表盘已满，无法保存新的图表";
            break;
          case "05031":
            error.newDashboard="该名称已存在";
            break;
    }
    return error;
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
});

var FolderAction = Folder.Action;

FolderStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case FolderAction.GET_FOLDER_TREE:
         FolderStore.setFolderTree(action.treeNode);
         FolderStore.emitFolderTreeChange();
      break;
    case FolderAction.CREATE_FOLDER_OR_WIDGET:
         FolderStore.createFolderOrWidget(action.parentNode,action.newNode);
         FolderStore.emitCreateFolderOrWidgetChange();
      break;
    case FolderAction.MODIFY_NAME_SECCESS:
         FolderStore.modifyName(action.newNode);
      break;
    case FolderAction.MODIFY_NAME_ERROR:
         FolderStore.setModifyNameError(action.res.text);
      break;
  }
});

module.exports = FolderStore;
