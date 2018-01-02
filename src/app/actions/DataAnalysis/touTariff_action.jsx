import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/DataAnalysis.jsx';
import Ajax from '../../ajax/Ajax.jsx';

const TouTariffAction = {
  getTagsInfo(ids){
    Ajax.post('/Tag/GetTagsByFilter?', {
      params: {
        filter: {
          Ids: ids,
          IncludeAssociationName: true
        },
        limit: 20*10000,
        page: 1,
        size: 20*10000,
        start: 0
      },
      success: function(tagData) {
        AppDispatcher.dispatch({
          type: Action.GET_TOU_TAGS_INFO,
          tagData:tagData.Data
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  }
}

export default TouTariffAction;