'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';

import CommonFuns from '../util/Util.jsx';
import {Action} from '../constants/actionType/Labeling.jsx';
import {DataConverter} from '../util/Util.jsx';
import Ajax from '../ajax/ajax.jsx';

let getTagIdsFromTagOptions = function(tagOptions){
  let tagIds =[];
  for(let i=0,len=tagOptions.length; i<len; i++){
    tagIds.push(tagOptions[i].tagId);
  }

  return tagIds;
};

let LabelAction = {
  //for select tags from taglist and click search button.
  getLabelChartData(viewOption, tagOptions, benchmarkOption, labelingType){
    var tagIds = getTagIdsFromTagOptions(tagOptions);

    var submitParams = { tagIds:tagIds,
                         viewOption:viewOption,
                         benchmarkOption: benchmarkOption,
                         labelingType: labelingType
                       };

    AppDispatcher.dispatch({
         type: Action.GET_Label_DATA_LOADING,
         submitParams: submitParams,
         tagOptions: tagOptions,
         labelingType: labelingType
    });

    Ajax.post('/Energy.svc/LabelingGetTagsData', {
         params:submitParams,
         commonErrorHandling: false,
         success: function(energyData){
           AppDispatcher.dispatch({
               type: Action.GET_LABEL_DATA_SUCCESS,
               energyData: energyData,
               submitParams: submitParams
           });
         },
         error: function(err, res){
           AppDispatcher.dispatch({
               type: Action.GET_LABEl_DATA_ERROR,
               errorText: res.text,
               submitParams: submitParams
           });
         }
       });
  }
};

module.exports = LabelAction;
