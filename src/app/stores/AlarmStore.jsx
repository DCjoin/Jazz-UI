'use strict';


import PopAppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import {dateType} from '../constants/AlarmConstants.jsx';

var _dateType = dateType.DAY_ALARM;
var _dateValue = null;
var _hierarchyList = null;

var AlarmStore = assign({},PrototypeStore,{});

AlarmStore.dispatchToken = PopAppDispatcher.register(function(action) {
    switch(action.type) {


    }
});

module.exports = AlarmStore;
