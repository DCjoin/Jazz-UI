'use strict';
import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import { Action } from '../constants/actionType/Mail.jsx';
import Ajax from '../ajax/Ajax.jsx';
import MailStore from '../stores/MailStore.jsx';

let timeoutHandle = null;

let MailAction = {
  GetServiceProviders() {
    Ajax.post('/ServiceProvider/GetServiceProviders', {
      params: {
        dto: {
          StatusFilter: {
            ExcludeStatus: false,
            Statuses: [1]
          }
        }
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
    Ajax.post('/Customer/GetPlatFormUserGroupDto', {
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
  sendEamilOrMessage: function(withoutTitle) {
    var viewParam = MailStore.getMailView();
    if (viewParam.template === null) {
      viewParam.template = {
        templateName: null,
        templateNewFlag: null
      };
    }
    var template = {
      templateName: viewParam.template.templateName,
      templatelTitle: viewParam.subject,
      templateContent: viewParam.content,
      templateNewFlag: viewParam.template.templateNewFlag
    };
    Ajax.post('/Notification/sendEamilOrMessage', {
      params: {
        emailDto: {
          template: template,
          recipientsInfo: viewParam.receivers,
          newTemplateName: viewParam.newTemplateName,
          saveTemplateFlag: viewParam.saveNewTemplate,
          sendMessageFlag: viewParam.msgNoticeFlag,
          sendMessageWithoutTitle: withoutTitle
        }

      },
      commonErrorHandling: false,
      success: function() {
        clearTimeout(timeoutHandle);
        AppDispatcher.dispatch({
          type: Action.SEND_MAIL_SUCCESS,
        });
      },
      error: function(err, res) {
        clearTimeout(timeoutHandle);
        AppDispatcher.dispatch({
          type: Action.SEND_MAIL_ERROR,
          res: res
        });
      }
    });
    timeoutHandle = setTimeout(() => {
      AppDispatcher.dispatch({
        type: Action.SET_DIALOG,
        dialogType: 'loading',
      });
    }, 2000);
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
    Ajax.post('/Notification/getAllNotificationTemplate', {
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
    Ajax.post('/Notification/deleteNotificationTemplate', {
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
    //'0'：delete '1':send success errorcode:send error
    AppDispatcher.dispatch({
      type: Action.SET_DIALOG,
      dialogType: dialogType,
      info: info
    });
  },
  setSubject: function(subject) {
    AppDispatcher.dispatch({
      type: Action.SET_SUBJECT,
      subject: subject
    });
  },
  setContent: function(content) {
    AppDispatcher.dispatch({
      type: Action.SET_CONTENT,
      content: content
    });
  },
  setNewTemplate: function(flag, newTemplateName) {
    AppDispatcher.dispatch({
      type: Action.SET_NEW_TEMPLATE,
      flag: flag,
      newTemplateName: newTemplateName
    });
  },
  setMsgNotice: function(flag) {
    AppDispatcher.dispatch({
      type: Action.SET_MSG_NOTICE,
      flag: flag
    });
  },
  setSendError: function(errorCode) {
    AppDispatcher.dispatch({
      type: Action.SET_ERROR_CODE,
      errorCode: errorCode
    });
  },
  resetSendInfo: function() {
    AppDispatcher.dispatch({
      type: Action.RESET_SEND_INFO,
    });
  },
};

module.exports = MailAction;
