import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/DataAnalysis.jsx';
import {Collect} from '../../constants/actionType/customerSetting/Tag.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import Path from 'constants/Path.jsx';

const BasicAnalysisAction = {
  getTags(CustomerId,HierarchyId,page){
    Ajax.post('/Tag/GetTagsByFilter', {
      params: {
        filter:{
          CustomerId:parseInt(CustomerId),
          HierarchyId,
          Type:1,
          CollectionMethod:Collect.Manual
        },
        page: page,
        size: 20,
        start: 20 * (page - 1)
      },
      success: function(tagData) {
        AppDispatcher.dispatch({
          type: Action.GET_MANUAL_TAGS,
          tagData: tagData
        });
      },
      error: function(err, res) {
        AppDispatcher.dispatch({
          type: Action.GET_TAG_LIST_ERROR
        });
      }
    })
}
}

export default BasicAnalysisAction;
