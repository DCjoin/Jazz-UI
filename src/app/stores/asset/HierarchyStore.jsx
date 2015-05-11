import PopAppDispatcher from '../../dispatcher/PopAppDispatcher.jsx';
import Hierarchy from '../../constants/actionType/Hierarchy.jsx';
import AssetConstants from '../../constants/AssetConstants.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
// import events from 'events';
import assign from 'object-assign';
import Util from '../../util/util.jsx';

var _data = {};
var _list = [];
var _customerId = "";
var _fullNodeList=[];
var selectedNode = null;
var lastSelectedNode = null;

var findNodeFromData = function(array, targetNode, callback){
  if(Array.isArray(array)){
    array.forEach(function(node, i){
      if(targetNode.Id == node.Id){
        if(callback && typeof callback == "function"){
          callback(array, i, node);
          return;
        }
      }
      if(Array.isArray(node.Children) && node.Children.length > 0){
        findNodeFromData(node.Children, targetNode, callback);
      }
    });
  }
}

var HierarchyStore = assign({}, PrototypeStore, {

  init: function(results) {
    _data = results;
    _list = [];
    var traverse = function(data){
      if(Array.isArray(data)){
        data.forEach(function(node, i){
          // can custome make self Id
          node.nodeId = node.Id || (new Date()).valueOf() + "",
          node.Id = node.Id || (new Date()).valueOf() + "",
          node.Type = node.Type || AssetConstants.nodeType.Organization
          if(Array.isArray(node.Children)){
            traverse(node.Children);
          }
        });
      } else if(data) {
        data.nodeId = data.Id || (new Date()).valueOf() + "",
        data.Id = data.Id || (new Date()).valueOf() + "",
        data.Type = data.Type || AssetConstants.nodeType.Organization
        if(Array.isArray(data.Children)){
          traverse(data.Children);
        }
      }
    }
    traverse(_data);
    console.log(_data);
    // _data = data;
  },
  getRootNode(){
    return _data;
  },
  setCustomerId: function(Id){
    _customerId = Id;
  },

  getCustomerId: function(){
    return _customerId;
  },
  getNodeByCode:function (code) {
      var list =this.getNodeList().filter((node)=>{return node.Code==code;});
      if(list.length==1){
          return list[0];
      }

      return null;
  },
  getNodeById:function (id) {
      var list =this.getNodeList().filter((node)=>{return node.Id==id;});
      if(list.length==1){
          return list[0];
      }

      return null;
  },
  getFullNodeById(id){
      var list =_fullNodeList.filter((node)=>{return node.Id==id;});
      if(list.length>=1){
          return list[0];
      }

      return null;
  },
  selectNode: function(node){
    if(!selectedNode){
      lastSelectedNode = node;
    } else {
      lastSelectedNode = selectedNode;
    }
    selectedNode = node;
  },

  selectLastNode: function(){
    selectedNode = lastSelectedNode;
  },

  unselectAllNode: function(){
    lastSelectedNode = selectedNode;
    selectedNode = null;
  },

  getSelectedNode: function(){
    return selectedNode;
  },

  getLastSelectedNode: function(){
    return lastSelectedNode;
  },

  getAll: function() {
    return _data;
  },

  addNode:function(newNode, parentNode) {
    if(_data.Id == parentNode.Id){
      if(!Array.isArray(_data.Children)){
        _data.Children = [];
      }
      _data.Children.push(newNode);
    } else {
      findNodeFromData(_data.Children, parentNode, function(array, i, node){
        if(!Array.isArray(node.Children)){
          node.Children = [];
        }
        node.Children.push(newNode);
      });
    }
    this.selectNode(newNode);
  },

  removeNode: function(targetNode) {
    findNodeFromData(_data.Children, targetNode, function(array, i, node){
      array.splice(i, 1);
    });
    _list=[];
  },

  updateNode: function(targetNode){
    findNodeFromData(_data.Children, targetNode, function(array, i, node){
      node = assign(node, targetNode);
    });
    this.selectNode(targetNode);
  },

  getAncestorNodes(node) {
    var ancestors = [];

    var current = node;
    while(current.ParentId) {
      var parent = this.getParentNode(current);
      ancestors.splice(0,0,parent);
      current = parent;
    }

    return ancestors;
  },

  getParentNode(node) {
    var all = this.getNodeList();
    var parent = null;
    for (var i=0;i<all.length;i++){
      var item = all[i];
      if(item.Id == node.ParentId) {
        parent = item;
        break;
      }
    }

    return parent;
  },

  getNodeList() {
    if(!_list || _list.length <= 0){
      this.collect(_data);
    }

    return _list;
  },
  loadFullNode(node){
      _fullNodeList.push(node);
  },
  collect(root) {
    _list.push(root);
    var that = this;
    if (root.Children && root.Children.length > 0) {
      root.Children.forEach(function(item){
        //console.log(item);
        that.collect(item);
      });
    }
  }


});

var actionType = Hierarchy.Action;

HierarchyStore.dispatchToken = PopAppDispatcher.register(function(action) {
  switch(action.type) {
    case actionType.RECEIVE_RAW_MESSAGES:
      HierarchyStore.setCustomerId(action.customerId);
      HierarchyStore.init(action.data);
      HierarchyStore.emitChange();
      break;
    case actionType.ADD_NODE:
      HierarchyStore.addNode(action.node ,action.parentNode);
      HierarchyStore.emitChange();
      break;
    case actionType.DELETE_NODE:
      HierarchyStore.removeNode(action.node);
      HierarchyStore.emitChange();
      break;
    case actionType.UPDATA_NODE:
      HierarchyStore.updateNode(action.node);
      HierarchyStore.emitChange();
      break;
    case actionType.CLICK_NODE:
      HierarchyStore.selectNode(action.node);
      HierarchyStore.emitChange();
      break;
      case actionType.SELECT_NODE:
        HierarchyStore.selectNode(action.node);
        HierarchyStore.emitChange();
        break;
  case actionType.LOAD_NODE:
    HierarchyStore.loadFullNode(action.node);
    HierarchyStore.emitChange();
    break;
    case actionType.UNSELECT_NODE:
      HierarchyStore.unselectAllNode();
      HierarchyStore.emitChange();
      break;
    case actionType.SELECT_LAST_NODE:
      HierarchyStore.selectLastNode();
      HierarchyStore.emitChange();
      break;
    default:
      // do nothing
  }

});

module.exports = HierarchyStore;
