import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List, Map } from 'immutable';
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
let CHANGE_EVENT = 'change',
  ERROR_CHANGE_EVENT = 'errorchange';

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
  clearAll: function() {
    _tariffs = emptyList();
    _persistedTariff = emptyMap();
    _updatingTariff = emptyMap();
    _selectedId = null;
  },
  checkError: function(path) {
    if (path == 'TouTariffItems') {
      var errors = Immutable.fromJS({
        Peak: [],
        Valley: []
      });
      var touTariff = _updatingTariff.get('TouTariffItems'),
        items = new List();
      for (let i = 1; i <= 3; i++) {
        if (i != 2) {
          var priceItem = touTariff.find(item => item.get("ItemType") == i);
          if (!!priceItem) {
            var timeRange = priceItem.get('TimeRange');
            if (!!timeRange) {
              timeRange.forEach((time, index) => {
                var item = time;
                item = item.set('TimeType', i);
                item = item.set('index', index);
                items = items.push(item);
              });

            }
          }
        }
      }
      for (let i = 0; i < items.size - 1; i++) {
        for (let j = i + 1; j <= items.size - 1; j++) {
          let a = parseFloat(items.get(i).get('m_Item1')),
            b = parseFloat(items.get(i).get('m_Item2')),
            c = parseFloat(items.get(j).get('m_Item1')),
            d = parseFloat(items.get(j).get('m_Item2'));
          if ((a < 0 && b < 0) || (c < 0 && d < 0)) {
          } else {
            if ((a <= c && b <= c) || (a >= c && a >= d)) {
            } else {
              errors = items.get(i).get('TimeType') == 1 ? errors.setIn(['Peak', items.get(i).get('index')], I18N.Setting.CarbonFactor.Conflict) :
                errors.setIn(['Valley', items.get(i).get('index')], I18N.Setting.CarbonFactor.Conflict);
              errors = items.get(j).get('TimeType') == 1 ? errors.setIn(['Peak', items.get(j).get('index')], I18N.Setting.CarbonFactor.Conflict) :
                errors.setIn(['Valley', items.get(j).get('index')], I18N.Setting.CarbonFactor.Conflict);
            }
          }
        }
      }
      if (errors.get('Valley').size > 0 || errors.get('Peak').size > 0) {
        _updatingTariff = _updatingTariff.set('Errors', errors);
      } else {
        _updatingTariff = _updatingTariff.set('Errors', null);
      }
    } else {
      var errors = Immutable.fromJS({
        Date: [],
        Time: []
      });
      var timeRanges = _updatingTariff.getIn(['PeakTariff', 'TimeRanges']);
      for (let i = 0; i < timeRanges.size - 1; i++) {
        for (let j = i + 1; j <= timeRanges.size - 1; j++) {
          let a = timeRanges.getIn([i]),
            b = timeRanges.getIn([j]);
          if ((a.get('StartTime') < 0 && a.get('EndTime') < 0) || (b.get('StartTime') < 0 && b.get('EndTime') < 0)) {
          } else {
            if ((a.get('StartTime') <= b.get('StartTime') && a.get('EndTime') <= b.get('StartTime')) || (a.get('StartTime') >= b.get('StartTime') && a.get('StartTime') >= b.get('EndTime'))) {
            } else {
              errors = errors.setIn(['Time', i], I18N.Setting.CarbonFactor.Conflict);
              errors = errors.setIn(['Time', j], I18N.Setting.CarbonFactor.Conflict);
            }
          }
          if ((a.get('StartDay') < 0 && a.get('StartMonth') < 0) || (a.get('EndMonth') < 0 && a.get('EndDay') < 0) ||
            (b.get('EndMonth') < 0 && b.get('EndDay') < 0) || (b.get('StartDay') < 0 && b.get('StartMonth') < 0)) {
          } else {
            if (((a.get('StartMonth') < b.get('StartMonth') || (a.get('StartMonth') == b.get('StartMonth') && a.get('StartDay') <= b.get('StartDay'))) &&
              (a.get('EndMonth') < b.get('StartMonth') || (a.get('EndMonth') == b.get('StartMonth') && a.get('EndDay') <= b.get('StartDay'))))
              || ((a.get('StartMonth') > b.get('StartMonth') || (a.get('StartMonth') == b.get('StartMonth') && a.get('StartDay') >= b.get('StartDay'))) &&
              (a.get('StartMonth') > b.get('EndMonth') || (a.get('StartMonth') == b.get('EndMonth') && a.get('StartDay') >= b.get('EndMonth'))))) {
            } else {
              errors = errors.setIn(['Date', i], I18N.Setting.CarbonFactor.Conflict);
              errors = errors.setIn(['Date', j], I18N.Setting.CarbonFactor.Conflict);
            }
          }
        }
      }
      if (errors.get('Date').size > 0 || errors.get('Time').size > 0) {
        _updatingTariff = _updatingTariff.set('Errors', errors);
      } else {
        _updatingTariff = _updatingTariff.set('Errors', null);
      }
    }

  },
  merge: function(data) {
    var that = this;
    if (data.path == 'Name') {
      _updatingTariff = _updatingTariff.set('Name', data.value);
    } else {
      if (data.path == 'TouTariffItems') {
        var touTariff = _updatingTariff.get('TouTariffItems');
        switch (data.value.ItemType) {
          case 2:
            let value = data.value.value;
            if (!!touTariff) {
              let plainPriceItem = touTariff.find(item => item.get("ItemType") == 2);
              if (!!plainPriceItem) {
                if (!!value) {
                  plainPriceItem = plainPriceItem.set('Price', value);
                  _updatingTariff = _updatingTariff.set('TouTariffItems', touTariff.update(touTariff.findIndex(item => item.get('ItemType') == 2), (item) => {
                    return plainPriceItem;
                  }));
                } else {
                  _updatingTariff = _updatingTariff.set('TouTariffItems', touTariff.delete(touTariff.findIndex(item => item.get("ItemType") == 2)));
                }

              } else {
                touTariff = touTariff.push(Immutable.fromJS({
                  ItemType: 2,
                  Price: value,
                  TimeRange: [],
                  TouTariffId: 0
                }));
                _updatingTariff = _updatingTariff.set('TouTariffItems', touTariff);
              }
            } else {
              let plainPriceItem = Immutable.fromJS([{
                ItemType: 2,
                Price: value,
                TimeRange: [],
                TouTariffId: 0
              }]);
              _updatingTariff = _updatingTariff.set('TouTariffItems', plainPriceItem);
            }
            break;
          case 1:
          case 3:
            let value = data.value.value;
            if (data.value.path == 'Price') {
              if (!!touTariff) {
                let priceItem = touTariff.find(item => item.get("ItemType") == data.value.ItemType);
                if (!!priceItem) {
                  priceItem = priceItem.set('Price', value);
                  _updatingTariff = _updatingTariff.set('TouTariffItems', touTariff.update(touTariff.findIndex(item => item.get('ItemType') == data.value.ItemType), (item) => {
                    return priceItem;
                  }));
                } else {
                  touTariff = touTariff.push(Immutable.fromJS({
                    ItemType: data.value.ItemType,
                    Price: value,
                    TimeRange: [{
                      m_Item1: -1,
                      m_Item2: -1
                    }],
                    TouTariffId: 0
                  }));
                  _updatingTariff = _updatingTariff.set('TouTariffItems', touTariff);
                }
              } else {
                let priceItem = Immutable.fromJS([{
                  ItemType: data.value.ItemType,
                  Price: value,
                  TimeRange: [{
                    m_Item1: -1,
                    m_Item2: -1
                  }],
                  TouTariffId: 0
                }]);
                _updatingTariff = _updatingTariff.set('TouTariffItems', priceItem);
              }
            } else {
              if (!!touTariff) {
                let priceItem = touTariff.find(item => item.get("ItemType") == data.value.ItemType);
                if (!!priceItem) {
                  let timeRange = priceItem.get('TimeRange');
                  timeRange = timeRange.setIn([data.value.index], Immutable.fromJS({
                    m_Item1: value[0],
                    m_Item2: value[1]
                  }));
                  priceItem = priceItem.set('TimeRange', timeRange);
                  _updatingTariff = _updatingTariff.set('TouTariffItems', touTariff.update(touTariff.findIndex(item => item.get('ItemType') == data.value.ItemType), (item) => {
                    return priceItem;
                  }));
                } else {
                  touTariff = touTariff.push(Immutable.fromJS({
                    ItemType: data.value.ItemType,
                    Price: null,
                    TimeRange: [{
                      m_Item1: value[0],
                      m_Item2: value[1]
                    }],
                    TouTariffId: 0
                  }));
                  _updatingTariff = _updatingTariff.set('TouTariffItems', touTariff);
                }
              } else {
                let priceItem = Immutable.fromJS([{
                  ItemType: data.value.ItemType,
                  Price: null,
                  TimeRange: [{
                    m_Item1: value[0],
                    m_Item2: value[1]
                  }],
                  TouTariffId: 0
                }]);
                _updatingTariff = _updatingTariff.set('TouTariffItems', priceItem);
              }
            }
            that.checkError('TouTariffItems');
            break;
        }
      } else {
        switch (data.value.path) {
          case 'onOff':
            _updatingTariff = _updatingTariff.set('onOff', data.value.value);
            if (data.value.value) {
              _updatingTariff = _updatingTariff.set('PeakTariff', Immutable.fromJS({
                Price: null,
                TimeRanges: [{
                  EndDay: -1,
                  EndMonth: -1,
                  EndTime: -1,
                  StartDay: -1,
                  StartMonth: -1,
                  StartTime: -1
                }]
              }));
            } else {
              _updatingTariff = _updatingTariff.set('PeakTariff', null);
            }
            break;
          case 'Price':
            _updatingTariff = _updatingTariff.setIn(['PeakTariff', 'Price'], data.value.value);
            break;
          case 'Date':
            let timeRange = _updatingTariff.getIn(['PeakTariff', 'TimeRanges', data.value.index]);
            timeRange = timeRange.set('StartMonth', data.value.value[0]);
            timeRange = timeRange.set('StartDay', data.value.value[1]);
            timeRange = timeRange.set('EndMonth', data.value.value[2]);
            timeRange = timeRange.set('EndDay', data.value.value[3]);

            _updatingTariff = _updatingTariff.setIn(['PeakTariff', 'TimeRanges', data.value.index], timeRange);
            that.checkError('PeakTariff');
            break;
          case 'Time':
            let timeRange = _updatingTariff.getIn(['PeakTariff', 'TimeRanges', data.value.index]);
            timeRange = timeRange.set('StartTime', data.value.value[0]);
            timeRange = timeRange.set('EndTime', data.value.value[1]);

            _updatingTariff = _updatingTariff.setIn(['PeakTariff', 'TimeRanges', data.value.index], timeRange);
            that.checkError('PeakTariff');
            break;
        }
      }
    }


  },
  addTimeRange: function(itemType) {
    var touTariff = _updatingTariff.get('TouTariffItems');
    if (!!touTariff) {
      let priceItem = touTariff.find(item => item.get("ItemType") == itemType);
      if (!!priceItem) {
        let timeRange = priceItem.get('TimeRange');
        timeRange = timeRange.unshift(Immutable.fromJS({
          m_Item1: -1,
          m_Item2: -1
        }));
        priceItem = priceItem.set('TimeRange', timeRange);
        _updatingTariff = _updatingTariff.set('TouTariffItems', touTariff.update(touTariff.findIndex(item => item.get('ItemType') == itemType), (item) => {
          return priceItem;
        }));
      } else {
        touTariff = touTariff.push(Immutable.fromJS({
          ItemType: itemType,
          Price: null,
          TimeRange: [{
            m_Item1: -1,
            m_Item2: -1
          },
            {
              m_Item1: -1,
              m_Item2: -1
            }],
          TouTariffId: 0
        }));
        _updatingTariff = _updatingTariff.set('TouTariffItems', touTariff);
      }
    } else {
      _updatingTariff = _updatingTariff.set('TouTariffItems', Immutable.fromJS([{
        ItemType: itemType,
        Price: null,
        TimeRange: [{
          m_Item1: -1,
          m_Item2: -1
        },
          {
            m_Item1: -1,
            m_Item2: -1
          }],
        TouTariffId: 0
      }])
      );
    }

  },
  addPulsePeakDate: function() {
    var PeakTariff = _updatingTariff.get('PeakTariff'),
      timerange = PeakTariff.get('TimeRanges');
    timerange = timerange.unshift(Immutable.fromJS({
      EndDay: -1,
      EndMonth: -1,
      EndTime: -1,
      StartDay: -1,
      StartMonth: -1,
      StartTime: -1
    }));
    _updatingTariff = _updatingTariff.setIn(['PeakTariff', 'TimeRanges'], timerange);

  },
  deleteTimeRange(itemType, index) {
    var touTariff = _updatingTariff.get('TouTariffItems'),
      priceItem = touTariff.find(item => item.get("ItemType") == itemType),
      timeRange = priceItem.get('TimeRange');
    priceItem = priceItem.set('TimeRange', timeRange.delete(index));
    _updatingTariff = _updatingTariff.set('TouTariffItems', touTariff.update(touTariff.findIndex(item => item.get('ItemType') == itemType), (item) => {
      return priceItem;
    }));
    this.checkError('TouTariffItems');
  },
  deletePulsePeakDate: function(index) {
    var timeRange = _updatingTariff.getIn(['PeakTariff', 'TimeRanges']);

    timeRange = timeRange.delete(index);
    _updatingTariff = _updatingTariff.setIn(['PeakTariff', 'TimeRanges'], timeRange);
    this.checkError('PeakTariff');
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
  reset: function() {
    _updatingTariff = _persistedTariff;
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
    case TariffAction.MERGE_TARIFF:
      TariffStore.merge(action.data);
      TariffStore.emitChange();
      break;
    case TariffAction.ADD_PEAK_TIMERANGE:
      TariffStore.addTimeRange(1);
      TariffStore.emitChange();
      break;
    case TariffAction.ADD_VALLEY_TIMERANGE:
      TariffStore.addTimeRange(3);
      TariffStore.emitChange();
      break;
    case TariffAction.ADD_PULSE_PEAK_DATE:
      TariffStore.addPulsePeakDate();
      TariffStore.emitChange();
      break;
    case TariffAction.DELETE_PEAK_TIMERANGE:
      TariffStore.deleteTimeRange(1, action.index);
      TariffStore.emitChange();
      break;
    case TariffAction.DELETE_VALLEY_TIMERANGE:
      TariffStore.deleteTimeRange(3, action.index);
      TariffStore.emitChange();
      break;
    case TariffAction.DELETE_PULSE_PEAK_TIMERANGE:
      TariffStore.deletePulsePeakDate(action.index);
      TariffStore.emitChange();
      break;

    case TariffAction.SAVE_TARIFF_SUCCESS:
      TariffStore.setSelectedId(action.id);
      break;
    case TariffAction.RESET_TARIFF:
      TariffStore.reset();
      break;
    case TariffAction.TARIFF_ERROR:
      TariffStore.emitErrorhange({
        title: action.title,
        content: action.content
      });
      break;
    case TariffAction.DELETE_TARIFF_SUCCESS:
      var selecteId = TariffStore.deleteTariff(action.id);
      TariffStore.setSelectedId(selecteId);
      TariffStore.emitChange(selecteId);
      break;
    case TariffAction.CLEAR_ALL:
      TariffStore.clearAll();
      TariffStore.emitChange();
      break;

  }
});
module.exports = TariffStore;
