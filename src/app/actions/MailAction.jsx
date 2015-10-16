'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Mail.jsx';
import Ajax from '../ajax/ajax.jsx';


let MailAction = {
  GetServiceProviders() {
    Ajax.post('/ServiceProvider.svc/GetServiceProviders', {
      params: {
        dto: {}
      },
      success: function(Providers) {
        AppDispatcher.dispatch({
          type: Action.GET_SERVICES_PROVIDERS_SUCCESS,
          providers: Providers,
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  GetPlatFormUserGroupDto() {
    Ajax.post('/Customer.svc/GetPlatFormUserGroupDto', {
      params: {
      },
      success: function(GroupDto) {
        AppDispatcher.dispatch({
          type: Action.GET_PLATFORM_USERS_SUCCESS,
          groupDto: GroupDto
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  AddReceiver: function(receiver) {
    AppDispatcher.dispatch({
      type: Action.ADD_RECEIVER,
      receiver: receiver
    });
  },
  AddReceivers: function(receivers) {
    AppDispatcher.dispatch({
      type: Action.ADD_RECEIVERS,
      receivers: receivers
    });
  },
  RemoveReceiver: function(receiver) {
    AppDispatcher.dispatch({
      type: Action.REMOVE_RECEIVER,
      receiver: receiver
    });
  },

};

module.exports = MailAction;
