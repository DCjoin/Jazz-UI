import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import _isEmpty from 'lodash/lang/isEmpty';
import { List, updater, update, Map } from 'immutable';
import { dataStatus } from '../constants/DataStatus.jsx';
import Customer from '../constants/actionType/Customer.jsx';

var _ = {
  isEmpty: _isEmpty
};

function emptyList() {
  return new List();
}
function emptyMap() {
  return new Map();
}

let _customers = emptyList(),
  _persistedCustomer = emptyMap(),
  _updatingCustomer = emptyMap(),
  _selectedId = null,
  _persistedEnergyInfo = null,
  _updatingEnergyInfo = null;

let CHANGE_EVENT = 'change',
  ERROR_CHANGE_EVENT = 'errorchange',
  ENERGY_INFO_CHANGE_EVENT = 'energyinfochange';

var CustomerStore = assign({}, PrototypeStore, {
  setCustomers: function(customers) {
    _customers = Immutable.fromJS(customers);
  },
  getCustomers: function() {
    return _customers;
  },
  setSelectedId: function(id) {
    _selectedId = id;
    _persistedEnergyInfo = _updatingEnergyInfo = null;
    if (!!id) {
      var filterCustomer = Immutable.fromJS(_customers).filter(item => item.get("Id") == id);
      _persistedCustomer = _updatingCustomer = filterCustomer.first();
    } else {
      _persistedCustomer = _updatingCustomer = emptyMap();
    }
  },
  getPersistedCustomer: function() {
    return _persistedCustomer;
  },
  getUpdatingCustomer: function() {
    return _updatingCustomer;
  },
  setEnergyInfo: function(energyInfo) {
    if (!energyInfo.EnergyInfoIds) {
      energyInfo.EnergyInfoIds = [-2, -1, 1, 2];
    }
    _persistedEnergyInfo = _updatingEnergyInfo = Immutable.fromJS(energyInfo);
  },
  getUpdatingEnergyInfo: function() {
    return _updatingEnergyInfo;
  },
  getPersistedEnergyInfo: function() {
    return _persistedEnergyInfo;
  },
  getEnergyList: function() {
    var array = [],
      index = -1,
      list = [I18N.Setting.CustomerManagement.Label.CarbonEmission, I18N.Setting.CustomerManagement.Label.Cost, I18N.Setting.CustomerManagement.Label.Electricity,
        I18N.Setting.CustomerManagement.Label.Water,
        I18N.Setting.CustomerManagement.Label.Gas,
        I18N.Setting.CustomerManagement.Label.SoftWater,
        I18N.Setting.CustomerManagement.Label.Petrol,
        I18N.Setting.CustomerManagement.Label.LowPressureSteam,
        I18N.Setting.CustomerManagement.Label.DieselOi,
        I18N.Setting.CustomerManagement.Label.HeatQ,
        I18N.Setting.CustomerManagement.Label.CoolQ,
        I18N.Setting.CustomerManagement.Label.Coal,
        I18N.Setting.CustomerManagement.Label.CoalOil];
    for (var i = -2; i <= 11; i++) {
      if (i !== 0) {
        index++;
        array[i + 2] = list[index];
      }
    }
    return array;
  },
  getEnergyInfo: function(isView) {
    var list = this.getEnergyList(),
      ids = (isView) ? _persistedEnergyInfo.toJS().EnergyInfoIds : _updatingEnergyInfo.toJS().EnergyInfoIds,
      energyInfo = [{
        Id: 1,
        Name: list[3],
        isChecked: (!!ids) ? ids.indexOf(1) > -1 : false,
      }];
    list.forEach((item, index) => {
      if (index != 3) {
        if (!!ids) {
          energyInfo.push({
            Id: index - 2,
            Name: item,
            isChecked: ids.indexOf(index - 2) > -1
          });
        } else {
          energyInfo.push({
            Id: index - 2,
            Name: item,
            isChecked: false
          });
        }
      }
    });
    return energyInfo;
  },
  merge: function(data) {
    if (_.isEmpty(data)) {
      _updatingCustomer = emptyMap();
      return;
    }

    var {status, path, value, index} = data,
      paths = path.split("."),
      value = Immutable.fromJS(value);
    if (status === dataStatus.DELETED) {
      _updatingCustomer = _updatingCustomer.deleteIn(paths);
    } else if (status === dataStatus.NEW) {
      var children = _updatingCustomer.getIn(paths);
      if (!children) {
        children = emptyList();
      }
      if (Immutable.List.isList(children)) {
        if (index) {
          paths.push(index);
        } else {
          value = children.push(value);
        }
      }
      _updatingCustomer = _updatingCustomer.setIn(paths, value);
    } else {
      _updatingCustomer = _updatingCustomer.setIn(paths, value);
    }
  },
  mergeEnergy: function(data) {
    var value = parseInt(data.value);
    var index = _updatingEnergyInfo.get('EnergyInfoIds').findIndex(item => {
      return (item == value);
    });
    if (index > -1) {
      _updatingEnergyInfo = _updatingEnergyInfo.set('EnergyInfoIds', _updatingEnergyInfo.get('EnergyInfoIds').delete(index));
    } else {
      _updatingEnergyInfo = _updatingEnergyInfo.set('EnergyInfoIds', _updatingEnergyInfo.get('EnergyInfoIds').push(value));
    }
  },
  deleteCustomer(deletedId) {
    var deletedIndex = -1;

    if (_customers.size < 2) {
      _customers = emptyList();
      return 0;
    }

    var nextSelectedId = 0;

    _customers.every((item, index) => {
      if (item.get("Id") == deletedId) {
        deletedIndex = index;
        if (index == _customers.size - 1) {
          nextSelectedId = _customers.getIn([index - 1, "Id"]);
        } else {
          nextSelectedId = _customers.getIn([index + 1, "Id"]);
        }
        return false;
      }
      return true;
    });
    _customers = _customers.deleteIn([deletedIndex]);
    this.setCustomers(_customers.toJS());
    return nextSelectedId;
  },
  reset: function() {
    _updatingCustomer = _persistedCustomer;
    _updatingEnergyInfo = _persistedEnergyInfo;
  },
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  emitChange(args) {
    this.emit(CHANGE_EVENT, args);
  },
  addErrorChangeListener(callback) {
    this.on(ERROR_CHANGE_EVENT, callback);
  },

  removeErrorChangeListener(callback) {
    this.removeListener(ERROR_CHANGE_EVENT, callback);
  },

  emitErrorhange(args) {
    this.emit(ERROR_CHANGE_EVENT, args);
  },
  addEnergyInfoChangeListener(callback) {
    this.on(ENERGY_INFO_CHANGE_EVENT, callback);
  },

  removeEnergyInfoListener(callback) {
    this.removeListener(ENERGY_INFO_CHANGE_EVENT, callback);
  },

  emitEnergyInfohange(args) {
    this.emit(ENERGY_INFO_CHANGE_EVENT, args);
  },
});
var CustomerAction = Customer.Action;

CustomerStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case CustomerAction.GET_CUSTOMERS:
      var pre = _customers;
      CustomerStore.setCustomers(action.customers);
      if (pre.size === 0) {
        CustomerStore.setSelectedId(_customers.getIn([0, "Id"]));
        CustomerStore.emitChange(_customers.getIn([0, "Id"]));
      } else {
        CustomerStore.setSelectedId(_selectedId);
        CustomerStore.emitChange(_selectedId);
      }
      break;
    case CustomerAction.SET_SELECTED_COSTOMER_ID:
      CustomerStore.setSelectedId(action.id);
      break;
    case CustomerAction.MERGE_CUSTOMER:
      CustomerStore.merge(action.data);
      CustomerStore.emitChange();
      break;
    case CustomerAction.GET_ENERGY_INFO:
      CustomerStore.setEnergyInfo(action.energyInfo);
      CustomerStore.emitEnergyInfohange();
      break;
    case CustomerAction.MERGE_CUSTOMER_ENERGYINFO:
      CustomerStore.mergeEnergy(action.data);
      CustomerStore.emitEnergyInfohange();
      break;
    case CustomerAction.RESET_CUSTOMER:
      CustomerStore.reset();
      break;
    case CustomerAction.SAVE_CUATOMER_ENERGYINFO_SUCCESS:
      CustomerStore.setEnergyInfo(action.energyInfo);
      CustomerStore.emitEnergyInfohange();
      CustomerStore.emitChange(_selectedId);
      break;
    case CustomerAction.CUSTOMER_ERROR:
      CustomerStore.emitErrorhange({
        title: action.title,
        content: action.content
      });
      break;
    case CustomerAction.DELETE_CUSTOMER_SUCCESS:
      var selecteId = CustomerStore.deleteCustomer(action.id);
      CustomerStore.setSelectedId(selecteId);
      CustomerStore.emitChange(selecteId);
      break;
  }
});
module.exports = CustomerStore;
