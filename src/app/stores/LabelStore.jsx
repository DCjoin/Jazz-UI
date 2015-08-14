'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';

import {Action} from '../constants/actionType/Labeling.jsx';

var LabelStore = assign({},PrototypeStore,{
});

module.exports = LabelStore;
