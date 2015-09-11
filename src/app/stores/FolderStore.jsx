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
    _newCreateNode=null,
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
    SEND_STATUS_EVENT='sendstatus',
    SELECTED_NODE_EVENT='selectednode',
    MOVE_ITEM_SUCCESS_EVENT='moveitemsuccess',
    MOVE_ITEM_ERROR_EVENT='moveitemerror',
    MODIFY_READING_STATUS_EVENT='modifyreadingstatus',
    EXPORT_WIDGET_ERROR_EVENT='exportwidgeterror',
    EXPORT_WIDGET_SUCCESS_EVENT='exportwidgetsuccess';

var FolderStore = assign({},PrototypeStore,{

  setFolderTree:function(treeNode){
    _folderTree=Immutable.fromJS(treeNode);
    _selectedNode=_folderTree;
  },
  getFolderTree:function(){
    return _folderTree;
  },
  getNodeById:function(id){
    var node;
    var f=function(item){
      if(item.get('Id')==id){
        node=item;
      }
      else {
        if(item.get('Children')){
          item.get('Children').forEach(child=>{f(child)})
        }
      }
    };
    f(_folderTree);
    return node;
  },
  getParent:function(node){
    var parent;
    var f=function(item){
      if(item.get('Id')==node.get('ParentId')){
        parent = item;
      }
      else {
        if(item.get('Children')){
          item.get('Children').forEach(child=>{f(child)})
        }
      }
    };
    f(_folderTree);
    return parent;
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
            node=node.set('Children',children.update(index,(item)=>{return changedNode}))
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
  _newCreateNode=newNode;

   if(_changedNode.get('Children')){
     let children=_changedNode.get('Children').push(_newNode);
     _changedNode=_changedNode.set('Children',children);
   }
   else {
     let children=Immutable.List([]);
     children=children.push(_newNode);
     _changedNode=_changedNode.set('Children',children);
   }
   if(_newNode.get('Type')==6){
     let subFolderCount =  _changedNode.get('ChildFolderCount')+1;
      _changedNode=_changedNode.set('ChildFolderCount',subFolderCount);
   }
   else {
     let subWidgetCount  =  _changedNode.get('ChildWidgetCount')+1;
      _changedNode=_changedNode.set('ChildWidgetCount',subWidgetCount );
   }
   _folderTree=this.modifyTreebyNode(_folderTree);
  _selectedNode=_newNode;
  },
  getNewNode:function(){
    return _newCreateNode;
  },
  modifyName:function(newNode){
    var parent=this.getParent(newNode);

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
    var _newNode=newNode;
    if(parent.get('Children')){
      children=parent.get('Children');
    }
    else {
      children=Immutable.List([]);
    }
      parent=parent.set('Children',children.push(_newNode));
      _parentId=parent.get('Id');
      _changedNode=parent;
      if(_newNode.get('Type')==6){
        let subFolderCount =  _changedNode.get('ChildFolderCount')+1;
         _changedNode=_changedNode.set('ChildFolderCount',subFolderCount);
      }
      else {
        let subWidgetCount  =  _changedNode.get('ChildWidgetCount')+1;
         _changedNode=_changedNode.set('ChildWidgetCount',subWidgetCount );
      }
      _folderTree=this.modifyTreebyNode(_folderTree);
      _selectedNode=newNode;
  },
  insertItem:function(nextItem,newNode){
    var parent=this.getParent(nextItem);
    var children=parent.get('Children');
    var index=children.indexOf(nextItem);
    var pre=children.filter((item,i)=>(i<index)),
        next=children.filter((item,i)=>(i>=index));
    var temp=pre.push(newNode).concat(next);
      parent=parent.set('Children',temp);
      _parentId=parent.get('Id');
      _changedNode=parent;
      if(newNode.get('Type')==6){
        let subFolderCount =  _changedNode.get('ChildFolderCount')+1;
         _changedNode=_changedNode.set('ChildFolderCount',subFolderCount);
      }
      else {
        let subWidgetCount  =  _changedNode.get('ChildWidgetCount')+1;
         _changedNode=_changedNode.set('ChildWidgetCount',subWidgetCount );
      }
      _folderTree=this.modifyTreebyNode(_folderTree);
      _selectedNode=newNode;
  },
  deleteItem:function(deleteNode,isLoadByWidget){
    //如果左边选中的是一个widget，在右边执行删除后，左边焦点项下移
    var parent=this.getParent(deleteNode);

    var children=parent.get('Children');
    var index=children.findIndex(item=>item.get('Id')==deleteNode.get('Id'));
    parent=parent.set('Children',children.delete(index));
    _parentId=parent.get('Id');
    _changedNode=parent;
    if(deleteNode.get('Type')==6){
      let subFolderCount =  _changedNode.get('ChildFolderCount')-1;
       _changedNode=_changedNode.set('ChildFolderCount',subFolderCount);
    }
    else {
      let subWidgetCount  =  _changedNode.get('ChildWidgetCount')-1;
       _changedNode=_changedNode.set('ChildWidgetCount',subWidgetCount );
    }
      _folderTree=this.modifyTreebyNode(_folderTree);
      if(isLoadByWidget){
        if(index==children.size-1){
          _selectedNode=children.find((item,i)=>(i==index-1));
        }
        else {
          _selectedNode=children.find((item,i)=>(i==index+1));
        }

      }
    else {
      _selectedNode=_changedNode;
    }


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
  setMoveItemError:function(node){
    _errorName=node.get('Name');
    if(node.get('Type')==6) {
      _errorType=I18N.Folder.FolderName;
    }
    else {
      _errorType=I18N.Folder.WidgetName;
    }
  },
  getMoveItemError:function(){
    return I18N.format(I18N.Folder.Drag.Error,_errorName,_errorType);
  },
  setSelectedNode:function(selectedNode){
    _selectedNode=selectedNode;
  },
  getSelectedNode:function(){
    return _selectedNode;
  },
  getDefaultName:function(nodeName,parentNode,type){
    var nameArray=[];
    if(parentNode.get('Children')){
      parentNode.get('Children').forEach(function(child){
        if(child.get('Type')==type){
          if(child.get('Name').indexOf(nodeName)>=0){
            nameArray.push(child.get('Name'));
          }
        }
      });
    }
    var name=nodeName;
    for(var i=1;i<=nameArray.length;i++){
      var has=false;
        nameArray.forEach(function(item,i){
          if(item==name){
            has=true;
          }
        }
      )
        if(!has){
          return name;
        }
        else {
          name=I18N.format(I18N.Template.Copy.DefaultName,nodeName)+i;
        }
    }
    return name;
  },
  getCopyLabelName:function(node,type){
    var parent=this.getParent(node);
      return this.getDefaultName(node.get('Name'),parent,type);
  },

  setSendStatus:function(sourceNode,userIds){
    if(userIds.length===0){
      _sendStatus=I18N.format(I18N.Folder.Send.Success,sourceNode.get('Name'));
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
  moveItem:function(sourceNode,parentNode,nextNode,newNode){
    this.deleteItem(sourceNode);
    if(nextNode===null){
      this.copyItem(parentNode,newNode);
    }
    else {
      this.insertItem(nextNode,newNode);
    }
  },
  ModfiyReadingStatus:function(nodeData){
    _parentId=nodeData.get('Id');
    _changedNode=nodeData.set('IsRead',true);
    _folderTree=this.modifyTreebyNode(_folderTree);
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
});

var FolderAction = Folder.Action;

FolderStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case FolderAction.GET_FOLDER_TREE:
         FolderStore.setFolderTree(action.treeNode);
         FolderStore.emitSelectedNodeChange();
         FolderStore.emitFolderTreeChange();
      break;
    case FolderAction.CREATE_FOLDER_OR_WIDGET:
         FolderStore.createFolderOrWidget(action.parentNode,action.newNode);
         FolderStore.emitCreateFolderOrWidgetChange();
         FolderStore.emitSelectedNodeChange();
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
        FolderStore.emitSelectedNodeChange();
      break;
    case FolderAction.COPY_ITEM:
        FolderStore.copyItem(action.destItem,action.newNode);
        FolderStore.emitCopyItemSuccessChange();
        FolderStore.emitSelectedNodeChange();

      break;
    case FolderAction.DELETE_ITEM:
        FolderStore.deleteItem(action.deleteNode,action.isLoadByWidget);
        FolderStore.emitDeleteItemSuccessChange();
         FolderStore.emitSelectedNodeChange();
      break;
    case FolderAction.SEND_ITEM:
        FolderStore.setSendStatus(action.sourceTreeNode,action.userIds);
        FolderStore.emitSendStatusChange();
      break;
    case FolderAction.MOVE_ITEM:
        FolderStore.moveItem(action.sourceNode,action.parentNode,action.nextNode,action.newNode);
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
  }
});

module.exports = FolderStore;
