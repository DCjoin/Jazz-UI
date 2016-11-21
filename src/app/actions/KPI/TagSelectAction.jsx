import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/KPI.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import Path from '../../constants/Path.jsx';

const perPage=10000;

const TagSelectAction = {
  getDimension(hierarchyId,hierarchyName) {
		var url = Path.APISubPaths.KPI.getDimension;
		Ajax.post(url,
      {
      params: {
          hierarchyId
        },
			success: function(resBody) {
				AppDispatcher.dispatch({
          type: Action.GET_KPI_DIMENSION_SUCCESS,
          data: resBody,
          hierarchyName
        });
			},
			error: function() {}
		});
	},
  getTags(hierarchyId,associationId,customerId){
    var url = Path.APISubPaths.KPI.getTags;
    Ajax.post(url,
      {
      params: {
          filter:{
            AlarmStatus:null,
            Association:{
              AssociationId:associationId===-1?hierarchyId:associationId,
              AssociationOption:associationId===-1?2:6
            },
            CustomerId:customerId,
            IncludeAssociationName:true
          },
          filters:null,
          limit:perPage,
          page:1,
          size:perPage,
          start:0
        },
      success: function(resBody) {
        AppDispatcher.dispatch({
          type: Action.GET_KPI_TAGS_SUCCESS,
          data: resBody.Data,
        });
      },
      error: function() {}
    });
  }
}

export default TagSelectAction;
