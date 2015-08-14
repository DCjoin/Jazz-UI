import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List,updater,update,Map} from 'immutable';

import Folder from '../constants/actionType/Folder.jsx';
import UserStore from './UserStore.jsx';

let _folderTree=Immutable.fromJS(),
    _parentId=null,
    _changedNode=Immutable.fromJS(),
    _newNode=null,
    _modifyNameErrorCode=null,
    _errorName=null,
    _errorType=null,
    _selectedNode=null,
    _sendStatus=null;
let FOLDER_TREE_EVENT = 'foldertree',
    CREATE_FOLDER_EVENT='createfolder',
    MODIFY_NAME_ERROR_EVENT='modifynameerror',
    MODIFY_NAME_SUCCESS_EVENT='modifynamesuccess',
    COPY_ITEM_SUCCESS_EVENT='copyitemsuccess',
    COPY_ITEM_ERROR_EVENT='copyitemerror',
    DELETE_ITEM_SUCCESS_EVENT='deleteitemsuccess',
    SEND_STATUS_EVENT='sendstatus';

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
            let result=that.modifyTreebyNode(item);
            if(result) {
              index=i;
              changedNode=result;
            }
          });
          if(index!==null){
            node=node.set('Children',children.update(index,(item)=>{return changedNode}));
            return node;
          }
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
      if(item.get('Id')==newNode.get('ParentId')){
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
    _errorName=null;
    _errorType=null;
  },
  copyItem:function(destItem,newNode){
    var parent=destItem;
    var children;
    if(parent.get('Children')){
      children=parent.get('Children')
    }
    else {
      children=Immutable.List([])
    }
      parent=parent.set('Children',children.push(newNode));
      _parentId=parent.get('Id');
      _changedNode=parent;
      _folderTree=this.modifyTreebyNode(_folderTree);
      _selectedNode=newNode;
  },
  deleteItem:function(deleteNode){
    //如果左边选中的是一个widget，在右边执行删除后，左边焦点项下移
    var parent;
    var f=function(item){
      if(item.get('Id')==deleteNode.get('ParentId')){
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
    parent=parent.set('Children',children.delete(children.findIndex(item=>item.get('Id')==deleteNode.get('Id'))));
    _parentId=parent.get('Id');
    _changedNode=parent;
    _folderTree=this.modifyTreebyNode(_folderTree);
  },
  setModifyNameError:function(res,newName,type){
    var errorCode=eval("(" + res + ")");
    _modifyNameErrorCode=errorCode.error.Code;
    _errorName=newName;
    if(type==6) {
      _errorType=I18N.Folder.FolderName;
    }
    else {
      _errorType=I18N.Folder.WidgetName;
    }
  },
  GetModifyNameError:function(){
    var error;
    var length=_modifyNameErrorCode.length;
    var errorCode=_modifyNameErrorCode.substring(length-5,length);
    switch(errorCode){
          case "05032":
          //FolderNameDuplicated
            error=I18N.format(I18N.Folder.SaveNameError.E032, _errorName,_errorType);
            break;
          case "05029":
            error=I18N.format(I18N.Folder.SaveNameError.E029,_errorType);
            break;
          case "05030":
            error=I18N.format(I18N.Folder.SaveNameError.E030,_errorType);
            break;
    }
    return error;
  },
  setSelectedNode:function(selectedNode){
    _selectedNode=selectedNode;
  },
  getSelectedNode:function(){
    return _selectedNode;
  },
  getCopyLabelName:function(folderName,type){
    var nameArray=[],index=0;
    if(_selectedNode===null){
      _selectedNode=_folderTree;
    }
    _selectedNode.get('Children').forEach(function(child){
      if(child.get('Type')==type){
        if(child.get('Name').indexOf(I18N.format(I18N.Template.Copy.DefaultName,folderName))>=0){
          nameArray.push(child.get('Name'));
        }
      }
    });
    if(nameArray){
      nameArray.forEach(function(name,i){
        let num=(i+1)+'';
        if((name.indexOf(num)<0) && (index==0)){
          index=i+1;
        }
      });
      if(index==0){index=nameArray.length+1}
    }
    else {
      index=1
    }
    return (I18N.format(I18N.Template.Copy.DefaultName,folderName)+index);
  },
  setSendStatus:function(sourceNode,status,userIds){
    if(status){
      _sendStatus=I18N.format(I18N.Folder.Send.Success,sourceNode.get('Name'))
    }
    else {
        let userNames;
        let userList=UserStore.getUserStatus();
        userList.forEach(function(user,i){
           var hasUser=false;
           userIds.forEach(function(id){
             if(id==user.get('Id')){
               hasUser=true;
             }
           });
           if(hasUser){
             if(userNames){
               userNames=userNames+','+user.get('Name');
             }
             else {
               userNames=user.get('Name');
             }
           }
        });
      _sendStatus=I18N.format(I18N.Folder.Send.Error,sourceNode.get('Name'),userNames);

    }

  },
  getSendStatus:function(){
    return _sendStatus;
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
         FolderStore.modifyName(Immutable.fromJS(action.newNode));
         FolderStore.emitModifyNameSuccessChange();
      break;
    case FolderAction.MODIFY_NAME_ERROR:
         FolderStore.setModifyNameError(action.res.text,action.newName,action.stype);
         FolderStore.emitModifyNameErrorChange();
      break;
    case FolderAction.SET_SELECTED_NODE:
        FolderStore.setSelectedNode(action.selectedNode);
      break;
    case FolderAction.COPY_ITEM:
        FolderStore.copyItem(action.destItem,action.newNode);
        FolderStore.emitCopyItemSuccessChange();
      break;
    case FolderAction.DELETE_ITEM:
        FolderStore.deleteItem(action.deleteNode);
        FolderStore.emitDeleteItemSuccessChange();
      break;
    case FolderAction.SEND_ITEM_SUCCESS:
        FolderStore.setSendStatus(action.sourceTreeNode,true,action.userIds);
        FolderStore.emitSendStatusChange();
      break;
    case FolderAction.SEND_ITEM_ERROR:
        FolderStore.setSendStatus(action.sourceTreeNode,true,action.userIds);
        FolderStore.emitSendStatusChange();
      break;
  }
});

module.exports = FolderStore;
