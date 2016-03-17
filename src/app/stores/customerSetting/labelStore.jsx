'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import CommonFuns from '../../util/Util.jsx';
import { Action } from '../../constants/actionType/customerSetting/Label.jsx';

let _labelList = Immutable.fromJS([]),
  _selectedLabelIndex = null,
  _selectedLabel = null,
  _errorCode = null,
  _errorMessage = null;

let CHANGE_LABEL_EVENT = 'changelabel';
let CHANGE_SELECTED_LABEL_EVENT = 'changeselectedlabel';
let ERROR_CHANGE_EVENT = 'errorchange';


var LabelStore = assign({}, PrototypeStore, {
  getLabelList() {
    return _labelList;
  },
  setLabelList(labelList) {
    _labelList = Immutable.fromJS(labelList);
    if (_labelList && _labelList.size !== 0) {
      if (_selectedLabelIndex === null) {
        _selectedLabelIndex = 0;
        _selectedLabel = _labelList.get(0);
      } else {
        var index = _labelList.findIndex((item) => {
          if (item.get('Id') === _selectedLabel.get('Id')) {
            return true;
          }
        });
        if (index !== -1 && _selectedLabelIndex !== index) {
          _selectedLabelIndex = index;
        }
      }
    } else {
      _selectedLabelIndex = null;
      _selectedLabel = null;
    }
  },
  deleteLabel() {
    _labelList = _labelList.delete(_selectedLabelIndex);
    var length = _labelList.size;
    if (length !== 0) {
      if (_selectedLabelIndex === length) {
        _selectedLabelIndex = length - 1;
      }
      _selectedLabel = _labelList.get(_selectedLabelIndex);
    } else {
      _selectedLabelIndex = null;
      _selectedLabel = null;
    }
  },
  setSelectedLabel(label) {
    _selectedLabel = Immutable.fromJS(label);
    _labelList = _labelList.set(_selectedLabelIndex, _selectedLabel);
  },
  addSelectedLabel(label) {
    _selectedLabel = Immutable.fromJS(label);
    _labelList = _labelList.unshift(_selectedLabel);
    _selectedLabelIndex = 0;
  },
  getSelectedLabel() {
    return _selectedLabel;
  },
  getSelectedLabelIndex() {
    return _selectedLabelIndex;
  },
  setSelectedLabelIndex(index) {
    if (index === null) {
      _selectedLabelIndex = null;
      _selectedLabel = null;
    } else {
      _selectedLabelIndex = index;
      _selectedLabel = _labelList.get(_selectedLabelIndex);
    }
  },
  getErrorMessage() {
    return _errorMessage;
  },
  getErrorCode() {
    return _errorCode;
  },
  initErrorText(errorText) {
    let error = JSON.parse(errorText).error;
    let errorCode = CommonFuns.processErrorCode(error.Code).errorCode;
    _errorCode = errorCode;
    _errorMessage = error.Messages;
  },
  emitLabelListChange: function() {
    this.emit(CHANGE_LABEL_EVENT);
  },
  addLabelListChangeListener: function(callback) {
    this.on(CHANGE_LABEL_EVENT, callback);
  },
  removeLabelListChangeListener: function(callback) {
    this.removeListener(CHANGE_LABEL_EVENT, callback);
  },
  emitSelectedLabelChange: function() {
    this.emit(CHANGE_SELECTED_LABEL_EVENT);
  },
  addSelectedLabelChangeListener: function(callback) {
    this.on(CHANGE_SELECTED_LABEL_EVENT, callback);
  },
  removeSelectedLabelChangeListener: function(callback) {
    this.removeListener(CHANGE_SELECTED_LABEL_EVENT, callback);
  },
  addErrorChangeListener(callback) {
    this.on(ERROR_CHANGE_EVENT, callback);
  },
  removeErrorChangeListener(callback) {
    this.removeListener(ERROR_CHANGE_EVENT, callback);
  },
  emitErrorChange() {
    this.emit(ERROR_CHANGE_EVENT);
  }
});
LabelStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_LABEL_LIST_SUCCESS:
      LabelStore.setLabelList(action.labelList);
      LabelStore.emitLabelListChange();
      LabelStore.emitSelectedLabelChange();
      break;
    case Action.GET_TAG_LIST_ERROR:
      LabelStore.setLabelList(null);
      LabelStore.emitLabelListChange();
      LabelStore.emitSelectedLabelChange();
      break;
    case Action.SET_SELECTED_LABEL:
      LabelStore.setSelectedLabelIndex(action.index);
      LabelStore.emitSelectedLabelChange();
      break;
    case Action.CANCEL_SAVE_LABEL:
      LabelStore.emitSelectedLabelChange();
      break;
    case Action.MODIFT_LABEL_SUCCESS:
      LabelStore.setSelectedLabel(action.label);
      LabelStore.emitLabelListChange();
      LabelStore.emitSelectedLabelChange();
      break;
    case Action.CREATE_LABEL_SUCCESS:
      LabelStore.addSelectedLabel(action.label);
      LabelStore.emitLabelListChange();
      LabelStore.emitSelectedLabelChange();
      break;
    case Action.DELETE_LABEL_SUCCESS:
      LabelStore.deleteLabel();
      LabelStore.emitLabelListChange();
      LabelStore.emitSelectedLabelChange();
      break;
    case Action.MODIFT_TAG_ERROR:
    case Action.CREATE_TAG_ERROR:
    case Action.DELETE_TAG_ERROR:
      LabelStore.initErrorText(action.errorText);
      LabelStore.emitErrorChange();
      break;
  }
});

module.exports = LabelStore;
