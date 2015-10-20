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
  addReceiver: function(receiver) {
    AppDispatcher.dispatch({
      type: Action.ADD_RECEIVER,
      receiver: receiver
    });
  },
  addReceivers: function(receivers) {
    AppDispatcher.dispatch({
      type: Action.ADD_RECEIVERS,
      receivers: receivers
    });
  },
  removeReceiver: function(receiver) {
    AppDispatcher.dispatch({
      type: Action.REMOVE_RECEIVER,
      receiver: receiver
    });
  },
  getAllNotificationTemplate: function() {
    Ajax.post('/Notification.svc/getAllNotificationTemplate', {
      params: {
      },
      success: function(templateList) {
        AppDispatcher.dispatch({
          type: Action.GET_TEMPLATE_LIST_SUCCESS,
          templateList: templateList
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  setTemplate: function(template) {
    AppDispatcher.dispatch({
      type: Action.SET_TEMPLATE,
      template: template
    });
  },
  deleteNotificationTemplate: function(template) {
    Ajax.post('/Notification.svc/deleteNotificationTemplate', {
      params: {
        templateID: template.templateId
      },
      success: function() {
        AppDispatcher.dispatch({
          type: Action.REMOVE_TEMPLATE,
          template: template
        });
      },
      error: function(err, res) {
        console.log(err, res);
      }
    });
  },
  setDialog: function(dialogType, info) {
    //dialogType
    //0：delete 1:send 2:send without title
    AppDispatcher.dispatch({
      type: Action.SET_DIALOG,
      dialogType: dialogType,
      info: info
    });
  },

};

module.exports = MailAction;
