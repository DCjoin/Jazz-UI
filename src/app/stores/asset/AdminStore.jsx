'use strict'

import PopAppDispatcher from '../../dispatcher/PopAppDispatcher.jsx';
import AdminActionType from '../../constants/actionType/Admin.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import Hierarchy from '../../constants/actionType/Hierarchy.jsx';
import assign from 'object-assign';
let {Action} = AdminActionType;
var _data = [];
let HierarchyAction = Hierarchy.Action;

var AdminStore = assign({}, PrototypeStore, {
    initAdmins: function(admins){
        if(Array.isArray(admins)){
            _data = admins;
        } else {
            _data = [];
        }
    },

    getAllAdmins: function(){
        return _data;
    },

    addAdmins: function(admin){
        _data = _data.slice(0);
        _data.push(admin);
    },

    deleteAdmin: function(admin){
        _data = _data.slice(0);
        _data.forEach(function(data, i){
            if(data.Id == admin.Id){
                _data.splice(i, 1);
            }
        });
    },

    updateAdmin: function(admin){
        _data = _data.slice(0);
        _data.forEach(function(data, i ){
            if(data.Id == admin.Id){
                data = assign({}, data, admin);
                _data.splice(i, 1, data);
            }
        });
    }
});

AdminStore.dispatchToken = PopAppDispatcher.register(function(action) {
    switch(action.type) {
        case HierarchyAction.SELECT_NODE:
            break;
        case Action.GET_ALL_ADMINS:
            AdminStore.initAdmins(action.data);
            AdminStore.emitChange();
            break;
        case Action.ADD_ADMIN:
            AdminStore.addAdmins(action.data);
            AdminStore.emitChange();
            break;
        case Action.DELETE_ADMIN:
            AdminStore.deleteAdmin(action.data);
            AdminStore.emitChange();
            break;
        case Action.UPDATE_ADMIN:
            AdminStore.updateAdmin(action.data);
            AdminStore.emitChange();
            break;
        default:
            // do nothing
    }

});

module.exports = AdminStore;
