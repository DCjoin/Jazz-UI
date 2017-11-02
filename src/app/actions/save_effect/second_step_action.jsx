import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/Effect.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import Path from 'constants/Path.jsx';
import util from 'util/Util.jsx';

const SecondStepAction = {
  getConfigcalendar(hierarchyId,date){

    AppDispatcher.dispatch({
          type: Action.GET_CONFIG_CALENDAR_LOADING,
       })

    var dueDate=util.DataConverter.DatetimeToJson(date);
    Ajax.get(util.replacePathParams(Path.Diagnose.isconfigcalendar, dueDate,hierarchyId), {
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_CONFIG_CALENDAR_FOR_SAVEEFFECT,
          data: res,
        })
      }
    } );
  },
}

export default SecondStepAction;