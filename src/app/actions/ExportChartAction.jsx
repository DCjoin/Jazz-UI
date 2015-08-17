'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import ActionTypes from '../constants/actionType/Energy.jsx';

let ExportChartAction = {

  getTagsData4Export(tagIds, viewOption, nodeNameAssociation, title, charTypes){
    AppDispatcher.dispatch({
        type: ActionTypes.EXPORT_CHART_ACTION_TYPE,
        params:{
          tagIds: tagIds,
          viewOption: viewOption,
          nodeNameAssociation: nodeNameAssociation,
          title: title,
          charTypes: charTypes
        }
    });
  }

};
module.exports = ExportChartAction;
