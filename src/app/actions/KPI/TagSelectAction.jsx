import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/KPI.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import Path from '../../constants/Path.jsx';

const perPage=10000;

const TagSelectAction = {
  getDimension(hierarchyId,hierarchyName) {
		var url = Path.KPI.getDimension;
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
  getTags(allTag, hierarchyId,associationId,customerId,CommodityId){
    var url = Path.KPI.getTags;
    var filter = {
      AlarmStatus:null,
      Association:{
        AssociationId:associationId===-1?hierarchyId:associationId,
        AssociationOption:associationId===-1?2:6
      },
      CustomerId:customerId,
      IncludeAssociationName:true,
      CommodityId
    };
    if( !allTag ) {
      filter.CalculationSteps = [0,1,2,6,7,8,9,10,11,12];
    }
    Ajax.post(url,
      {
      params: {
          filter,
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
