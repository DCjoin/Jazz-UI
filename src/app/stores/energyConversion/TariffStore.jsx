import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List, updater, update, Map } from 'immutable';
import Tariff from '../../constants/actionType/energyConversion/Tariff.jsx';

function emptyList() {
  return new List();
}
function emptyMap() {
  return new Map();
}

let _tariffs = emptyList(),
  _persistedTariff = emptyMap(),
  _updatingTariff = emptyMap(),
  _selectedId = null;
let CHANGE_EVENT = 'change';

var TariffStore = assign({}, PrototypeStore, {

  setTariffs: function(tariffs) {
    _tariffs = Immutable.fromJS(tariffs);
  },
  getTariffs: function() {
    return _tariffs;
  },
  setSelectedId: function(id) {
    _selectedId = id;
    if (!!id) {
      var filterTariff = Immutable.fromJS(_tariffs).filter(item => item.get("Id") == id);
      _persistedTariff = _updatingTariff = filterTariff.first();
    } else {
      _persistedTariff = _updatingTariff = emptyMap();
    }
  },
  getPersistedTariff: function() {
    return _persistedTariff;
  },
  getUpdatingTariff: function() {
    return _updatingTariff;
  },
  getPeakTariff: function(isView) {
    if (isView) {
      return _persistedTariff.get('PeakTariff');
    } else {
      return _updatingTariff.get('PeakTariff');
    }
  },
  getTouTariff: function(isView) {
    if (isView) {
      return _persistedTariff.get('TouTariffItems');
    } else {
      return _updatingTariff.get('TouTariffItems');
    }
  },
  clearAll: function() {
    _tariffs = emptyList();
    _persistedTariff = emptyMap();
    _updatingTariff = emptyMap();
    _selectedId = null;
  },
  checkError: function(index) {
    var factors = _updatingTariff.get('Factors'),
      factor = factors.getIn([index]),
      errors = emptyList();
    factors.forEach((item, id) => {
      if (id != index && item.get('EffectiveYear') == factor.get('EffectiveYear')) {
        errors = errors.setIn([index], I18N.Setting.TariffFactor.Conflict);
        errors = errors.setIn([id], I18N.Setting.TariffFactor.Conflict);
      }
    });
    _updatingTariff = _updatingTariff.set('Errors', errors);
  },
  merge: function(data) {
    switch (data.path) {
      case 'ConversionPair':
        var index = data.value.value;
        if (index !== 0) {
          _updatingTariff = _updatingTariff.set(data.path, _selectableTariffs.getIn([index - 1]));
        }
        break;
      case 'EffectiveYear':
        var year = data.value.titleItems[data.value.value],
          factorIndex = data.value.factorIndex,
          that = this;
        var factors = _updatingTariff.get('Factors');
        _updatingTariff = _updatingTariff.set('Factors', factors.update(factorIndex, (item) => {
          return factors.getIn([factorIndex]).set('EffectiveYear', year.text);
        }));
        that.checkError(factorIndex);
        break;
      case 'FactorValue':
        var value = data.value.value,
          factorIndex = data.value.factorIndex;
        var factors = _updatingTariff.get('Factors');
        _updatingTariff = _updatingTariff.set('Factors', factors.update(factorIndex, (item) => {
          return factors.getIn([factorIndex]).set('FactorValue', value);
        }));
        break;
    }

  },
  addFactor: function() {
    var factors = _updatingTariff.get('Factors');
    factors = factors.unshift(Immutable.fromJS({
      EffectiveYear: 0
    }));
    _updatingTariff = _updatingTariff.set('Factors', factors);
  },
  deleteFactor: function(index) {
    var factors = _updatingTariff.get('Factors');
    _updatingTariff = _updatingTariff.set('Factors', factors.delete(index));
  },
  deleteTariff(deletedId) {
    var deletedIndex = -1;

    if (_tariffs.size < 2) {
      _tariffs = emptyList();
      return 0;
    }

    var nextSelectedId = 0;

    _tariffs.every((item, index) => {
      if (item.get("Id") == deletedId) {
        deletedIndex = index;
        if (index == _tariffs.size - 1) {
          nextSelectedId = _tariffs.getIn([index - 1, "Id"]);
        } else {
          nextSelectedId = _tariffs.getIn([index + 1, "Id"]);
        }
        return false;
      }
      return true;
    });
    _tariffs = _tariffs.deleteIn([deletedIndex]);
    this.setTariffs(_tariffs.toJS());
    return nextSelectedId;
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
});
var TariffAction = Tariff.Action;

TariffStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case TariffAction.GET_TOU_TARIFFS:
      var pre = _tariffs;
      TariffStore.setTariffs(action.tariffs);
      if (pre.size === 0) {
        TariffStore.setSelectedId(_tariffs.getIn([0, "Id"]));
        TariffStore.emitChange(_tariffs.getIn([0, "Id"]));
      } else {
        TariffStore.setSelectedId(_selectedId);
        TariffStore.emitChange(_selectedId);
      }
      break;
    case TariffAction.SET_SELECTED_TARTIFF_ID:
      TariffStore.setSelectedId(action.id);
      break;
    case TariffAction.CLEAR_ALL:
      TariffStore.clearAll();
      break;
    case TariffAction.MERGE_CARBON:
      TariffStore.merge(action.data);
      TariffStore.emitChange();
      break;
    case TariffAction.ADD_FACTOR:
      TariffStore.addFactor();
      TariffStore.emitChange();
      break;
    case TariffAction.DELETE_FACTOR:
      TariffStore.deleteFactor(action.index);
      TariffStore.emitChange();
      break;
    case TariffAction.SAVE_FACTOR_SUCCESS:
      TariffStore.setSelectedId(action.id);
      break;
    case TariffAction.DELETE_FACTOR_SUCCESS:
      var selecteId = TariffStore.deleteTariff(action.id);
      TariffStore.setSelectedId(selecteId);
      TariffStore.emitChange(selecteId);
      break;

  }
});
module.exports = TariffStore;
