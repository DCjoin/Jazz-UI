import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List, updater, update, Map } from 'immutable';

import Mail from '../constants/actionType/Mail.jsx';

let _mailUsers = null,
  _platFormUserGroupDto = null,
  _serviceProviders = null,
  _receivers = Immutable.List([]),
  _templateList = [],
  _template = null,
  _dialogInfo = null,
  _dialogType = null,
  _subject = null,
  _content = null,
  _saveNewTemplate = false,
  _newTemplateName = null,
  _msgNoticeFlag = false,
  _errorCode = {
    receiver: null,
    template: null,
    newtemplate: null
  };

let MAIL_USERS_EVENT = 'mailusers',
  MAIL_VIEW_EVENT = 'mailview',
  TEMPLATE_LIST_EVENT = 'templatelist',
  SHOW_DIALOG_EVENT = 'showdialog',
  SEND_ERROR_EVENT = 'senderror';

var MailStore = assign({}, PrototypeStore, {
  setPlatFormUserGroupDto: function(groupDto) {
    var f = function(item) {
      if (!!item.TotalUserCount) {
        item.Name = item.Name + '(' + item.TotalUserCount + ')';
        item.Id = '101' + item.Id;
        item.Children.forEach(child => {
          f(child);
        });
      }
    };
    _serviceProviders = null;
    _platFormUserGroupDto = groupDto;
    f(_platFormUserGroupDto);
    _mailUsers = Immutable.fromJS(_platFormUserGroupDto);
  },
  setServicesProviders: function(providers) {
    _platFormUserGroupDto = null;
    if (providers.length !== 0) {
      _serviceProviders = {
        Name: I18N.Mail.Contactor + '(' + providers.length + ')',
        Children: [],
        Id: -1
      };
      providers.forEach(provider => {
        _serviceProviders.Children.push(provider);
      });
    } else {
      _serviceProviders = null;
    }
    _mailUsers = Immutable.fromJS(_serviceProviders);

  },
  getMailUsers: function() {
    return _mailUsers;
  },
  getPlatFormUserGroupDto: function() {
    return _platFormUserGroupDto;
  },
  getServiceProviders: function() {
    return _serviceProviders;
  },
  addReceiver: function(receiver, fromAddReceivers) {
    var that = this;
    if (_receivers.size === 0) {
      _receivers = _receivers.push(receiver);
    } else {
      if (_receivers.indexOf(receiver) == -1) {
        _receivers = _receivers.push(receiver);
      } else {
        let index = _receivers.indexOf(receiver);
        _receivers = _receivers.delete(index);
        _receivers = _receivers.push(receiver);
      }
    }
    if (!fromAddReceivers) {
      if (_errorCode.receiver !== null) {
        _errorCode.receiver = null;
        that.emitSendErrorChange();
      }
    }

  },
  addReceivers: function(receivers) {
    var that = this;
    var f = function(item) {
      if (!item.get('Children')) {
        that.addReceiver(item, true);
      } else {
        item.get('Children').forEach(child => {
          f(child);
        });
      }
    };
    f(receivers);
    if (_errorCode.receiver !== null) {
      _errorCode.receiver = null;
      that.emitSendErrorChange();
    }
  },
  removeReceiver: function(receiver) {
    var index = _receivers.findIndex(item => item.get('Id') == receiver.get('Id'));
    _receivers = _receivers.delete(index);
  },
  getReceivers: function() {
    return _receivers;
  },
  setTemplateList: function(templateList) {
    _templateList = templateList;
    _templateList.push({
      templateContent: null,
      templateId: -1,
      templateName: I18N.Mail.UserDefined,
      templateNewFlag: 0,
      templatelTitle: null
    }
    );
  },
  getTemplateList: function() {
    return _templateList;
  },
  setTemplate: function(template) {
    _template = template;
    _subject = template.templatelTitle;
    _content = template.templateContent;
    if (_errorCode.template !== null) {
      _errorCode.template = null;
      this.emitSendErrorChange();
    }
  },
  removeTemplate: function(template) {
    var index = _templateList.indexOf(template);
    _templateList.splice(index, 1);
    if (template == _template) {
      _template = null;
      _subject = null;
      _content = null;
      this.emitMailViewChange();
    }
  },
  getMailView: function() {
    return {
      receivers: _receivers,
      template: _template,
      subject: _subject,
      content: _content,
      saveNewTemplate: _saveNewTemplate,
      newTemplateName: _newTemplateName,
      msgNoticeFlag: _msgNoticeFlag
    };
  },
  setDialog: function(dialogType, info) {
    _dialogInfo = info;
    _dialogType = dialogType;
  },
  getDialogInfo: function() {
    return _dialogInfo;
  },
  getDialogType: function() {
    return _dialogType;
  },
  setSubject: function(subject) {
    _subject = subject;
    if (_template === null) {
      _template = {
        templateContent: null,
        templateId: -1,
        templateName: I18N.Mail.UserDefined,
        templateNewFlag: 0,
        templatelTitle: null
      };
      this.emitMailViewChange();
    }
  },
  setContent: function(content) {
    _content = content;
    if (_template === null) {
      _template = {
        templateContent: null,
        templateId: -1,
        templateName: I18N.Mail.UserDefined,
        templateNewFlag: 0,
        templatelTitle: null
      };
      this.emitMailViewChange();
    }
  },
  setNewTemplate: function(flag, name) {
    _saveNewTemplate = flag;
    _newTemplateName = name;
  },
  setMsgNoticee: function(flag) {
    _msgNoticeFlag = flag;
  },
  setErrorText: function(res) {
    var error = eval("(" + res + ")").error.Code;
    var length = error.length;
    var errorCode = error.substring(length - 5, length);
    switch (errorCode) {
      case "03090":
        _errorCode.receiver = I18N.Mail.Error.E090;
        break;
      case "03091":
        _errorCode.template = I18N.Mail.Error.E091;
        break;
      case "03094":
        _errorCode.newtemplate = I18N.Mail.Error.E094;
        break;
      case "03095":
        _errorCode.newtemplate = I18N.Mail.Error.E095;
        break;
      default:
        this.setDialog(errorCode, null);
        this.emitShowDialogChange();
    }
  },
  setErrorTextSuccess: function() {
    _errorCode = {
      receiver: null,
      template: null,
      newtemplate: null
    };
  },
  GetSendError: function() {
    return _errorCode;
  },
  setErrorCode: function(errorCode) {
    _errorCode = errorCode;
  },
  resetSendInfo: function() {
    _templateList = [];
    _receivers = Immutable.List([]);
    _template = null;
    _dialogInfo = null;
    _dialogType = null;
    _subject = null;
    _content = null;
    _saveNewTemplate = false;
    _newTemplateName = null;
    _msgNoticeFlag = false;
    _errorCode = {
      receiver: null,
      template: null,
      newtemplate: null
    };

  },
  emitMailUsersChange: function() {
    this.emit(MAIL_USERS_EVENT);
  },
  addMailUsersListener: function(callback) {
    this.on(MAIL_USERS_EVENT, callback);
  },
  removeMailUsersListener: function(callback) {
    this.removeListener(MAIL_USERS_EVENT, callback);
    this.dispose();
  },
  emitMailViewChange: function() {
    this.emit(MAIL_VIEW_EVENT);
  },
  addMailViewListener: function(callback) {
    this.on(MAIL_VIEW_EVENT, callback);
  },
  removeMailViewListener: function(callback) {
    this.removeListener(MAIL_VIEW_EVENT, callback);
    this.dispose();
  },
  emitTemplateListChange: function() {
    this.emit(TEMPLATE_LIST_EVENT);
  },
  addTemplateListListener: function(callback) {
    this.on(TEMPLATE_LIST_EVENT, callback);
  },
  removeTemplateListListener: function(callback) {
    this.removeListener(TEMPLATE_LIST_EVENT, callback);
    this.dispose();
  },
  emitShowDialogChange: function() {
    this.emit(SHOW_DIALOG_EVENT);
  },
  addShowDialogListener: function(callback) {
    this.on(SHOW_DIALOG_EVENT, callback);
  },
  removeShowDialogListener: function(callback) {
    this.removeListener(SHOW_DIALOG_EVENT, callback);
    this.dispose();
  },
  emitSendErrorChange: function() {
    this.emit(SEND_ERROR_EVENT);
  },
  addSendErroListener: function(callback) {
    this.on(SEND_ERROR_EVENT, callback);
  },
  removeSendErroListener: function(callback) {
    this.removeListener(SEND_ERROR_EVENT, callback);
    this.dispose();
  },
});

var MailAction = Mail.Action;

MailStore.dispatchToken = AppDispatcher.register(function(action) {
  switch (action.type) {
    case MailAction.GET_PLATFORM_USERS_SUCCESS:
      MailStore.setPlatFormUserGroupDto(action.groupDto);
      MailStore.emitMailUsersChange();
      break;
    case MailAction.GET_SERVICES_PROVIDERS_SUCCESS:
      MailStore.setServicesProviders(action.providers);
      MailStore.emitMailUsersChange();
      break;
    case MailAction.ADD_RECEIVER:
      MailStore.addReceiver(action.receiver);
      MailStore.emitMailViewChange();
      break;
    case MailAction.ADD_RECEIVERS:
      MailStore.addReceivers(action.receivers);
      MailStore.emitMailViewChange();
      break;
    case MailAction.REMOVE_RECEIVER:
      MailStore.removeReceiver(action.receiver);
      MailStore.emitMailViewChange();
      break;
    case MailAction.SET_TEMPLATE:
      MailStore.setTemplate(action.template);
      MailStore.emitMailViewChange();
      break;
    case MailAction.REMOVE_TEMPLATE:
      MailStore.removeTemplate(action.template);
      MailStore.emitTemplateListChange();
      break;
    case MailAction.GET_TEMPLATE_LIST_SUCCESS:
      MailStore.setTemplateList(action.templateList);
      MailStore.emitTemplateListChange();
      break;
    case MailAction.SET_DIALOG:
      MailStore.setDialog(action.dialogType, action.info);
      MailStore.emitShowDialogChange();
      break;
    case MailAction.SET_SUBJECT:
      MailStore.setSubject(action.subject);
      break;
    case MailAction.SET_CONTENT:
      MailStore.setContent(action.content);
      break;
    case MailAction.SET_NEW_TEMPLATE:
      MailStore.setNewTemplate(action.flag, action.newTemplateName);
      break;
    case MailAction.SET_MSG_NOTICE:
      MailStore.setMsgNoticee(action.flag);
      break;
    case MailAction.SEND_MAIL_ERROR:
      MailStore.setDialog('-1', null);
      MailStore.emitShowDialogChange();
      MailStore.setErrorText(action.res.text);
      MailStore.emitSendErrorChange();
      MailStore.emitMailViewChange();

      break;
    case MailAction.SEND_MAIL_SUCCESS:
      MailStore.setErrorCode({
        receiver: null,
        template: null,
        newtemplate: null
      });
      MailStore.emitSendErrorChange();
      MailStore.setDialog('1', null);
      MailStore.emitShowDialogChange();
      break;
    case MailAction.SET_ERROR_CODE:
      MailStore.setErrorCode(action.errorCode);
      MailStore.emitSendErrorChange();
      break;
    case MailAction.RESET_SEND_INFO:
      MailStore.resetSendInfo();
      MailStore.emitMailViewChange();
      break;
  }
});
module.exports = MailStore;
