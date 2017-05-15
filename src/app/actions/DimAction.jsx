'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import Dim from '../constants/actionType/Dim.jsx';
import Ajax from '../ajax/Ajax.jsx';

var Action = Dim.Action;

let DimAction = {
  loadall(data){
    Ajax.post('/AreaDimension/GetAreaDimensionTree?', {
        params: {hierarchyId: data},
        success: function(dimList){
          AppDispatcher.dispatch({
              type: Action.LOAD_DIM_NODE,
              dimList: dimList,
              hierarchyId:data
          });
        },
        error: function(err, res){
          console.log(err,res);
        }
    });
  }

};

module.exports = DimAction;
