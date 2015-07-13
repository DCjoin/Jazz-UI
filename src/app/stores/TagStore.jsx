import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import Tag from '../constants/actionType/Tag.jsx';
import AlarmTag from '../constants/actionType/AlarmTag.jsx';

let LOAD_TAG_NODE_EVENT = 'loadtagnode';
let LOAD_ALARM_TAG_NODE_EVENT = 'loadalarmtagnode';
let TAG_TOTAL_EVENT = 'tagtotal';
let TAG_STATUS_EVENT = 'tagstatus';
let CHECKALL_STATUS_EVENT = 'checkallstatus';
let NODE_LOADING_EVENT= 'nodeloading';
var _data = {};
var _totalTagStatus=[];
var _hierId=null;
var _tagTotal=0;
var _tagList=[];
var _checkall_disable_status=null;
var _checkall_checked_status=null;
var _isLoading=false;


var TagStore = assign({},PrototypeStore,{
  setNodeLoading:function(){
    _isLoading=true;
  },
  getNodeLoading:function(){
    return _isLoading;
  },
  setTagStatusByTag:function(node,selected){
    var hasHierId=false;
    //total的加减 emit total change 判断 total>30  和 第一次小于30的情况 都调用emit

      _totalTagStatus.forEach(function(tagNode){
        if(tagNode.hierId==_hierId){
          hasHierId=true;
          if(selected){
              tagNode.tagStatus=tagNode.tagStatus.push(node.Id)
          }
          else {
            let index=tagNode.tagStatus.indexOf(node.Id);
            tagNode.tagStatus=tagNode.tagStatus.delete(index);
          }

        }
      });
      if(!hasHierId){
        _totalTagStatus.push({
          hierId:_hierId,
          tagStatus:Immutable.List.of(node.Id),
        })
      }

   if(selected){
     _tagTotal++;
     if(_tagTotal==30){
       this.emitTagTotalChange();
     }
   }
   else {
     if(_tagTotal==30){
       this.emitTagTotalChange();
     }
     _tagTotal--;
   };
     this.checkAllStatus();
  },
  setTagStatusById:function(hierId,tagId){
    _tagTotal++;
    _totalTagStatus.push({
      hierId:hierId,
      tagStatus:Immutable.List.of(tagId),
    });
    this.setCurrentHierarchyId(hierId);
  },
  setTagStatusByTagList:function(tagList,add){
    var hasHierId=false;
    var tagTotal=_tagTotal;
     var tagStatus=Immutable.List([]);
       _totalTagStatus.forEach(function(tagNode){
         if(tagNode.hierId==_hierId){
           hasHierId=true;
           tagStatus=tagNode.tagStatus;
           tagList.forEach(function(tagNode){
             let index=tagStatus.indexOf(tagNode.Id);
             if(add){
               if(index<0){
                 tagStatus=tagStatus.push(tagNode.Id);
                 _tagTotal++;
               }
             }
             else {
               if(index>=0){
                 tagStatus=tagStatus.delete(index);
                 _tagTotal--;
               }
             }

           });
           tagNode.tagStatus=tagStatus;
         }
       });
    if(!hasHierId){
      tagList.forEach(function(tagNode){
        tagStatus=tagStatus.push(tagNode.Id);
        _tagTotal++;
      });
      _totalTagStatus.push({
        hierId:_hierId,
        tagStatus:tagStatus,
      });
    }
    if(tagTotal==30){
      this.emitTagTotalChange();
    }
  },
  getCurrentHierIdTagStatus:function(){
   var tagStatus=Immutable.List([]);
    _totalTagStatus.forEach(function(tagNode){
  if(tagNode.hierId==_hierId){
    tagStatus=tagNode.tagStatus;
    }
  });
  return tagStatus;
  },
  removeTagStatusByTagId:function(tagId){
    _totalTagStatus.forEach(function(tagNode){
        let index=tagNode.tagStatus.indexOf(tagId);
        if(index>=0){
          tagNode.tagStatus=tagNode.tagStatus.delete(index);
        }
      });
  },
  clearTagStatus:function(){
    _tagTotal=0;
    _totalTagStatus=[];
},
  getTagTotal:function(){
    return _tagTotal
  },
  resetTagInfo:function(){
    _data = {};
    _totalTagStatus=[];
    _hierId=null;
    _tagTotal=0;
    _tagList=[];
  },
  setCurrentHierarchyId:function(hierId){
    _hierId=hierId;
  },
  setCurrentTagList:function(tagList){
    console.log("**wyh**setCurrentTagList");
    _tagList=tagList
  },
  getCurrentHierarchyId:function(hierId){
    return _hierId;
  },
  checkAllStatus:function(){
    console.log("**wyh**checkAllStatus");
    console.log(_tagList);
   var length=_tagList.length;
   var selectedNum=0;
   var tagStatus=Immutable.List([]);
   var checkStauts=null;
   _totalTagStatus.forEach(function(tagNode){
     if(tagNode.hierId==_hierId){
       tagStatus=tagNode.tagStatus;
     }
   });
   _tagList.forEach(function(tagNode){
     if(tagStatus.indexOf(tagNode.Id)>=0){
       selectedNum++;
     }
   });
   if((selectedNum==length) && (length!=0)){
     _checkall_checked_status=true;
   }
   else {
      _checkall_checked_status=false;
   }
   console.log("**wyh**selectedNum="+selectedNum);
  checkStauts=((length-selectedNum+1+_tagTotal)>30);

if(_checkall_checked_status){
  _checkall_disable_status=false
}
else{
  _checkall_disable_status=checkStauts;
}

  },
  getCheckAllDisabledStatus:function(){
    this.checkAllStatus();
    return _checkall_disable_status;
  },
  getCheckAllCheckedStatus:function(){
    return _checkall_checked_status;
  },
  getData(){
    return _data;
  },
  setData(data){
    console.log("**wyh**setData");
    console.log(data);
      _data =  data;
      _isLoading=false;
      this.setCurrentTagList(data.GetTagsByFilterResult);
      //每次load当页的taglist，判断“全选”的状态 disable or not?

      },
  setDataByAlarm(data){
      _data =  data;
      _isLoading=false;
      this.setCurrentTagList(data.GetPageTagDataResult);
  },
  emitTagNodeChange: function() {
        this.emit(LOAD_TAG_NODE_EVENT);
      },

  addTagNodeListener: function(callback) {
        this.on(LOAD_TAG_NODE_EVENT, callback);
      },

  removeTagNodeListener: function(callback) {
        this.removeListener(LOAD_TAG_NODE_EVENT, callback);
        this.dispose();
      },
  emitAlarmTagNodeChange: function() {
            this.emit(LOAD_ALARM_TAG_NODE_EVENT);
          },

  addAlarmTagNodeListener: function(callback) {
            this.on(LOAD_ALARM_TAG_NODE_EVENT, callback);
          },

  removeAlarmTagNodeListener: function(callback) {
            this.removeListener(LOAD_ALARM_TAG_NODE_EVENT, callback);
            this.dispose();
          },
  emitTagTotalChange: function() {
            this.emit(TAG_TOTAL_EVENT);
          },

  addTagTotalListener: function(callback) {
            this.on(TAG_TOTAL_EVENT, callback);
          },

  removeTagTotalListener: function(callback) {
            this.removeListener(TAG_TOTAL_EVENT, callback);
            this.dispose();
          },
  emitTagStatusChange: function() {
            this.emit(TAG_STATUS_EVENT);
          },

  addTagStatusListener: function(callback) {
           this.on(TAG_STATUS_EVENT, callback);
          },

  removeTagStatusListener: function(callback) {
            this.removeListener(TAG_STATUS_EVENT, callback);
            this.dispose();
            },
  emitCheckAllStatusChange: function() {
          this.emit(CHECKALL_STATUS_EVENT);
              },

  addCheckAllStatusListener: function(callback) {
         this.on(CHECKALL_STATUS_EVENT, callback);
          },

  removeCheckAllStatusListener: function(callback) {
        this.removeListener(CHECKALL_STATUS_EVENT, callback);
        this.dispose();
        },
  emitNodeLoadingChange: function() {
        this.emit(NODE_LOADING_EVENT);
        },

  addNodeLoadingListener: function(callback) {
       this.on(NODE_LOADING_EVENT, callback);
        },

  removeNodeLoadingListener: function(callback) {
      this.removeListener(NODE_LOADING_EVENT, callback);
      this.dispose();
        },
});
var TagAction = Tag.Action,
    AlarmTagAction = AlarmTag.Action;
    TagStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.type) {
      case TagAction.LOAD_TAG_NODE:
           TagStore.setData(action.tagList);
           TagStore.emitTagNodeChange();
        break;
      case TagAction.LOAD_ALARM_TAG_NODE:
             TagStore.setDataByAlarm(action.tagList);
             TagStore.emitAlarmTagNodeChange();
        break;
      case TagAction.SET_NODE_LOAGDING:
            TagStore.setNodeLoading();
            TagStore.emitNodeLoadingChange();
          break;
      case TagAction.SET_TAGSTATUS_TAG:
            TagStore.setTagStatusByTag(action.node,action.selected);
            TagStore.emitTagStatusChange();
        break;
      case TagAction.SET_TAGSTATUS_ID:
            TagStore.setTagStatusById(action.hierId,action.tagId);
            TagStore.emitTagStatusChange();
        break;
      case TagAction.SET_TAGSTATUS_TAGLIST:
            TagStore.setTagStatusByTagList(action.tagList,action.add);
            TagStore.emitTagStatusChange();
        break;
      case TagAction.SET_HIERARCHYID:
            TagStore.setCurrentHierarchyId(action.hierId);
        break;
      case AlarmTagAction.REMOVE_SEARCH_TAGLIST_CHANGED:
            TagStore.removeTagStatusByTagId(action.tagNode.tagId);
            TagStore.emitTagStatusChange();
        break;
      case AlarmTagAction.CLEAR_SEARCH_TAGLIST:
            TagStore.clearTagStatus();
            TagStore.emitTagStatusChange();
        break;
      case TagAction.RESET_TAGINFO:
            TagStore.resetTagInfo();
        break;



    }
});

module.exports = TagStore;
