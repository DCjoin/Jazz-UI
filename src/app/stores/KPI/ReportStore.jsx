
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action,DataStatus } from 'constants/actionType/KPI.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {List} from 'immutable';
import _ from 'lodash';
import CommonFuns from 'util/Util.jsx';

const ReportStore = assign({}, PrototypeStore, {

  dispose(){

  }

});

ReportStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    default:
  }
});

export default ReportStore;
