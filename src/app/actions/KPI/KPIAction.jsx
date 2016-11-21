import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import { Action } from 'constants/actionType/KPI.jsx';
import Path from 'constants/Path.jsx';
import util from 'util/Util.jsx';


const KPIAction = {
  getQuotaperiod(customerId) {
		Ajax.get(util.replacePathParams(Path.APISubPaths.KPI.getQuotaperiod, customerId),
    	{
			success: function(resBody) {
				AppDispatcher.dispatch({
					type: Action.GET_QUOTAPERIOD,
					data: resBody
				});
			},
			error: function() {}
		});
	},
}

export default KPIAction;
