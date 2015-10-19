import AppDispatcher from '../dispatcher/AppDispatcher.jsx';
import PrototypeStore from './PrototypeStore.jsx';
import assign from 'object-assign';
import Immutable from 'immutable';
import { List, updater, update, Map } from 'immutable';

import Mail from '../constants/actionType/Mail.jsx';

let _mailUsers = null,
  _platFormUserGroupDto = null,
  _serviceProviders = null,
  _receivers = Immutable.List([]);

let MAIL_USERS_EVENT = 'mailusers',
  MAIL_VIEW_EVENT = 'mailview';

var MailStore = assign({}, PrototypeStore, {
  setPlatFormUserGroupDto: function(groupDto) {
    var f = function(item) {
      if (!!item.TotalUserCount) {
        item.Name = item.Name + '(' + item.TotalUserCount + ')';
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
  addReceiver: function(receiver) {
    if (_receivers.size === 0) {
      _receivers = _receivers.push(receiver);
    } else {
      if (_receivers.indexOf(receiver) == -1) {
        _receivers = _receivers.push(receiver);
      }
    }
  },
  addReceivers: function(receivers) {
    var that = this;
    var f = function(item) {
      if (!item.get('Children')) {
        that.addReceiver(item);
      } else {
        item.get('Children').forEach(child => {
          f(child)
        })
      }
    };
    f(receivers)
  },
  removeReceiver: function(receiver) {
    var index = _receivers.findIndex(item => item.get('Id') == receiver.get('Id'));
    _receivers = _receivers.delete(index);
  },
  getReceivers: function() {
    return _receivers;
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
  }
});
module.exports = MailStore;
