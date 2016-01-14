'use strict';
import AppDispatcher from '../../dispatcher/AppDispatcher.jsx';
import { Action } from '../../constants/actionType/energyConversion/Tariff.jsx';
import Ajax from '../../ajax/ajax.jsx';
import Immutable from 'immutable';
let TariffAction = {
  GetTouTariff: function() {
    Ajax.post('/Administration.svc/GetTouTariff', {
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
  setCurrentSelectedId: function(id) {
    AppDispatcher.dispatch({
      type: Action.SET_SELECTED_TARTIFF_ID,
      id: id
    });
  },

};
module.exports = TariffAction;
