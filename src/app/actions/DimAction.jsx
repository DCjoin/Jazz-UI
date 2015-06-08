'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import Dim from '../constants/actionType/Dim.jsx';
import Ajax from '../ajax/ajax.jsx';

var Action = Dim.Action;

let DimAction = {
  loadall(date){
    Ajax.post('/AreaDimension.svc/GetAreaDimensionTree?_dc=1433490536301', {
        params: {hierarchyId: date},
        success: function(dimList){
          AppDispatcher.dispatch({
              type: Action.LOAD_DIM_NODE,
              dimList: dimList
          });
        },
        error: function(err, res){
          console.log(err,res);
        }
    });
  }

};

module.exports = DimAction;
