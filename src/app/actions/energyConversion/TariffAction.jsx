'use strict';
import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/energyConversion/Tariff.jsx';
import Ajax from '../../ajax/Ajax.jsx';
import CommonFuns from '../../util/Util.jsx';
let TariffAction = {
  GetTouTariff: function() {
    Ajax.post('/Administration/GetTouTariff', {
      params: {
        limit: 25,
        page: 1,
        propertyOption: 3,
        start: 0
      },
      success: function(tariffs) {
        AppDispatcher.dispatch({
          type: Action.GET_TOU_TARIFFS,
          tariffs: tariffs
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  SaveTouTariff: function(tariffData) {
    var that = this;
    Ajax.post('/Administration/SaveTouTariff', {
      params: {
        dto: tariffData
      },
      commonErrorHandling: false,
      success: function(tariff) {
        AppDispatcher.dispatch({
          type: Action.SAVE_TARIFF_SUCCESS,
          id: tariff.Id
        });
        that.GetTouTariff();

      },
      error: function(err, res) {
        let ErrorMsg = CommonFuns.getErrorMessageByRes(res.text);
        AppDispatcher.dispatch({
          type: Action.TARIFF_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
        console.log(err, res);
      }
    });
  },
  SavePeakTariff: function(tariffData) {
    var that = this;
    Ajax.post('/Administration/SavePeakTariff', {
      params: {
        dto: tariffData
      },
      commonErrorHandling: false,
      success: function(tariff) {
        AppDispatcher.dispatch({
          type: Action.SAVE_TARIFF_SUCCESS,
          id: tariffData.TouTariffId
        });
        that.GetTouTariff();
      },
      error: function(err, res) {
        let ErrorMsg = CommonFuns.getErrorMessageByRes(res.text);
        AppDispatcher.dispatch({
          type: Action.TARIFF_ERROR,
          title: I18N.Platform.ServiceProvider.ErrorNotice,
          content: ErrorMsg,
        });
        console.log(err, res);
      }
    });
  },
  setCurrentSelectedId: function(id) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_TARTIFF_ID,
      id: id
    });
  },
  reset: function() {
    AppDispatcher.dispatch({
      type: Action.RESET_TARIFF,
    });
  },
  merge: function(data) {
    AppDispatcher.dispatch({
      type: Action.MERGE_TARIFF,
      data: data
    });
  },
  addPeakTimeRange: function() {
    AppDispatcher.dispatch({
      type: Action.ADD_PEAK_TIMERANGE
    });
  },
  addValleyTimeRange: function() {
    AppDispatcher.dispatch({
      type: Action.ADD_VALLEY_TIMERANGE
    });
  },
  addPulsePeakDateTimeRange: function() {
    AppDispatcher.dispatch({
      type: Action.ADD_PULSE_PEAK_DATE
    });
  },
  deletePeakTimeRange: function(index) {
    AppDispatcher.dispatch({
      type: Action.DELETE_PEAK_TIMERANGE,
      index: index
    });
  },
  deleteValleyTimeRange: function(index) {
    AppDispatcher.dispatch({
      type: Action.DELETE_VALLEY_TIMERANGE,
      index: index
    });
  },
  deletePulsePeakDateTimeRange: function(index) {
    AppDispatcher.dispatch({
      type: Action.DELETE_PULSE_PEAK_TIMERANGE,
      index: index
    });
  },
  deleteTariff: function(dto) {
    var that = this;
    Ajax.post('/Administration/DeleteTouTariff', {
      params: {
        dto: dto
      },
      success: function() {
        AppDispatcher.dispatch({
          type: Action.DELETE_TARIFF_SUCCESS,
          id: dto.Id
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  ClearAll: function() {
    AppDispatcher.dispatch({
      type: Action.CLEAR_ALL,
    });
  },

};
module.exports = TariffAction;
