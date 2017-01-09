
'use strict';

import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action,DataStatus } from 'constants/actionType/KPI.jsx';
import PrototypeStore from '../PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import {List} from 'immutable';
import _ from 'lodash';
import CommonFuns from 'util/Util.jsx';

let _templateList=null;
const ReportStore = assign({}, PrototypeStore, {
  getTemplateList() {
    return _templateList;
  },
  setTemplateList(templateList) {
      _templateList = Immutable.fromJS(templateList);
  },
  getTemplateItems: function(templateList) {
    var Items=[];
  if (templateList && templateList.size !== 0) {
    Items=templateList.map(function(item) {
      return {
        payload: item.get('Id'),
        text: item.get('Name')
      };
    }).toJS();
  }
  Items.unshift({
    payload: -1,
    text:I18N.EM.Report.Select
  });
  return Items
  },
  dispose(){
    _templateList=null;
  }

});

ReportStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case Action.GET_REPORT_TEMPLATE_LIST_SUCCESS:
      ReportStore.setTemplateList(action.templateList);
      ReportStore.emitChange();
      break;
    case Action.GET_REPORT_TEMPLATE_LIST_ERROR:
      ReportStore.setTemplateList([]);
      ReportStore.emitChange();
      break;
    default:
  }
});

export default ReportStore;
