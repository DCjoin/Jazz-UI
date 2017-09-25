import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from 'constants/actionType/DataAnalysis.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import Path from 'constants/Path.jsx';
import util from 'util/Util.jsx';

const WeatherAction = {
  getCityWeatherTag(cityId){
    Ajax.get(util.replacePathParams(Path.DataAnalysis.getCityWeatherTag, cityId), {
      success: (res) => {
        AppDispatcher.dispatch({
          type: Action.GET_WEATHER_TAG,
          list: res,
        })
      }
    } );
  },
  clearCityWeatherTag(){
      AppDispatcher.dispatch({
          type: Action.CLEAR_WEATHER_TAG,
        })
  },
  clearSelectedTag(){
    AppDispatcher.dispatch({
          type: Action.CLEAR_SELECTED_TAG,
        })
  },
  checkedTag(tag,ischecked){
        AppDispatcher.dispatch({
          type: Action.CHECKED_TAG,
          tag,
          ischecked
        })
  }
}

export default WeatherAction;