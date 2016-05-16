'use strict';

import React from 'react';
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import MainAppBar from './MainAppBar.jsx';
import SelectCustomer from './SelectCustomer.jsx';
import util from '../util/Util.jsx';

import SelectCustomerActionCreator from '../actions/SelectCustomerActionCreator.jsx';
import { viewState } from '../constants/MainAppStatus.jsx';
import CookieUtil from '../util/cookieUtil.jsx';
import { getCookie } from '../util/Util.jsx';

import lang from '../lang/lang.jsx';
import keyMirror from 'keymirror';
import { LeftNav, CircularProgress } from 'material-ui';
import assign from 'object-assign';
import UOMStore from '../stores/UOMStore.jsx';
import AllCommodityStore from '../stores/AllCommodityStore.jsx';
import MainAction from '../actions/MainAction.jsx';
import NetworkChecker from '../controls/NetworkChecker.jsx';
import ExportChart from './energy/ExportChart.jsx';
import CurrentUserStore from '../stores/CurrentUserStore.jsx';
import CurrentUserCustomerStore from '../stores/CurrentUserCustomerStore.jsx';
import CurrentUserAction from '../actions/CurrentUserAction.jsx';
import LoginActionCreator from '../actions/LoginActionCreator.jsx';
import CusFlatButton from '../controls/FlatButton.jsx';
import Dialog from '../controls/PopupDialog.jsx';


function getCurrentCustomers() {
  return CurrentUserCustomerStore.getAll();
}

function getCurrentCustomer() {
  return CurrentUserCustomerStore.getCurrentCustomer();
}

let MainApp = React.createClass({
  mixins: [Navigation, State],
  _onAllUOMSChange() {
    window.uoms = UOMStore.getUoms();
  },
  _onAllCommoditiesChange() {
    window.allCommodities = AllCommodityStore.getAllCommodities();
  },
  _onCurrentrivilegeChanged: function() {
    var _currentUserRivilege = CurrentUserStore.getCurrentPrivilege();
    // console.log('_currentUserRivilege:'+_currentUserRivilege);
    this.setState({
      rivilege: _currentUserRivilege
    });
  },
  getInitialState: function() {
    SelectCustomerActionCreator.getCustomer(window.currentUserId);
    return {
      currentUser: window.currentUser,
      rivilege: CurrentUserStore.getCurrentPrivilege()
    };
  },

  _dismissDialog() {
    LoginActionCreator.logout();
    var _redirectFunc = this.context.router.replaceWith;
    _redirectFunc('login', {
      lang: ((window.currentLanguage === 0) ? 'zh-cn' : 'en-us')
    });
  },
  _renderDialog() {
    if (this.state.viewState == viewState.NO_SELECT_CUSTOMERS) {
      return (
        <MessageDialog onCancel={this._dismissDialog}/>
        );
    } else {
      return null;
    }
  },

  _redirectRouter: function(target, params) {
    if (!target) {
      //this.context.router.replaceWith(NO_PERMISSION_TIP_NAME, params);
      return;
    }
    var _redirectFunc = this.context.router.transitionTo;
    if (this.props.routes.length < 3) {
      _redirectFunc = this.context.router.replaceWith;
    }
    if (target.children && target.children.length > 0) {
      _redirectFunc(target.children[0].name, params);
    } else {
      _redirectFunc(target.name, params);
    }
  },

  _showCustomerList: function(argument) {
    this.setState({
      viewState: viewState.SELECT_CUSTOMER
    });
  },
  _closeSelectCustomer: function() {
    this.setState({
      viewState: viewState.MAIN
    });
  },
  _onChange: function(argument) {
    var params = this.props.params;
    var customerCode = params.customerId;
    var currentCustomer = CurrentUserCustomerStore.getCurrentCustomer();
    var currentUser = JSON.parse(getCookie('UserInfo'));

    if (!customerCode && (currentUser && currentUser.Id !== 1)) {
      // 切换至 Map SelectCustomer
      this.setState({
        viewState: viewState.SELECT_CUSTOMER
      });
    } else if (currentUser && currentUser.Id == 1) {
      //切换至系统管理
      this._redirectRouter({
        name: 'config',
        title: I18N.MainMenu.Config
      }, this.props.params);
      this.setState({
        viewState: viewState.MAIN
      });
    }

    if (currentCustomer && currentCustomer.CustomerId === -1 && !window.toMainApp) {
      //切换至平台管理
      this._redirectRouter({
        name: 'workday',
        title: I18N.MainMenu.Workday
      }, {lang:((window.currentLanguage === 0) ? 'zh-cn' : 'en-us'), cusnum: getCurrentCustomers().length});
      this.setState({
        viewState: viewState.MAIN
      });
      currentCustomer.CustomerId = '';
      return;
    }
    if (!_.isEmpty(currentCustomer)) {
      params.customerId = currentCustomer.Id;
      window.currentCustomerId = currentCustomer.Id;
      this._switchCustomer(currentCustomer);
      window.toMainApp = false;
      return;
    } else {
      var customers = getCurrentCustomers();
      if (!customers.length && (this.state.rivilege && this.state.rivilege.indexOf('1206') < 0 || this.state.rivilege == null)) {
        //当用户既没有平台管理权限，又没有客户列表的时候
        this.setState({
          viewState: viewState.NO_SELECT_CUSTOMERS
        });
        return;
      } else if (customers.length <= 0 && this.state.rivilege && this.state.rivilege.indexOf('1206') > -1) {
        //当用户仅有1206权限时切换至平台管理
        this._redirectRouter({
          name: 'workday',
          title: I18N.MainMenu.Workday,
        }, {lang:((window.currentLanguage === 0) ? 'zh-cn' : 'en-us'), cusnum: customers.length});
        this.setState({
          viewState: viewState.MAIN,
        });
        return;
      }
    }
  },
  _switchCustomer: function(customer) {
    var currentCustomer = getCurrentCustomer();
    var menus = this._getMenuItems();
    //, {'expires':5,'path':'/'}
    CookieUtil.set('currentCustomerId', customer.Id);
    window.currentCustomerId = customer.Id;

    if (menus && menus.length > 0) {
      //after select customer
      this._redirectRouter(menus[0], assign({}, this.props.params, {
        customerId: customer.Id
      }));
    } else {
      //login first time
      this.setState({
        rivilege: CurrentUserStore.getCurrentPrivilege()
      });
      this._redirectRouter({
        name: 'map',
        title: I18N.MainMenu.Map
      }, assign({}, this.props.params, {
        customerId: customer.Id
      }));
    }

    this.setState({
      viewState: viewState.MAIN
    });
  },
  _getMenuItems: function() {
    var menuItems = [];
    if (!this.state.rivilege) return

    if (this.state.rivilege.indexOf('1221') > -1) {
      menuItems = [
        {
          name: 'map',
          title: I18N.MainMenu.Map
        },
        {
          name: 'alarm',
          title: I18N.MainMenu.Alarm
        },
        {
          name: 'setting',
          title: I18N.MainMenu.Energy
        }
      ];
    } else {
      menuItems = [
        {
          name: 'map',
          title: I18N.MainMenu.Map
        },
        {
          name: 'setting',
          title: I18N.MainMenu.Energy
        }
      ];
    }
    if (this.state.rivilege.indexOf('1218') > -1 || this.state.rivilege.indexOf('1219') > -1) {
      menuItems.push(
        {
          name: 'report',
          title: I18N.MainMenu.Report,
          children: [{
            list: [
              {
                name: 'dailyReport',
                title: I18N.MainMenu.DailyReport
              },
              {
                name: 'template',
                title: I18N.MainMenu.Template
              }
            ]
          }]
        }
      );
    }
    if (this.state.rivilege.indexOf('1208') > -1 || this.state.rivilege.indexOf('1207') > -1 || this.state.rivilege.indexOf('1217') > -1) {
      var customerChildren = [];
      if (this.state.rivilege.indexOf('1208') > -1) {
        customerChildren = [{
          title: I18N.MainMenu.TagSetting,
          list: [
            {
              name: 'ptag',
              title: I18N.MainMenu.PTagManagement
            },
            {
              name: 'vtag',
              title: I18N.MainMenu.VTagManagement
            },
            {
              name: 'vee',
              title: I18N.MainMenu.VEEMonitorRule
            },
            {
              name: 'log',
              title: I18N.MainMenu.TagBatchImportLog
            }
          ]
        }];
      }
      if (this.state.rivilege.indexOf('1207') > -1) {
        customerChildren.push({
          title: I18N.MainMenu.HierarchySetting,
          list: [
            {
              name: 'hierNode',
              title: I18N.MainMenu.HierarchyNodeSetting
            },
            {
              name: 'hierLog',
              title: I18N.MainMenu.HierarchyLog
            }
          ]
        });
      }
      if (this.state.rivilege.indexOf('1217') > -1) {
        customerChildren.push({
          title: I18N.MainMenu.CustomSetting,
          list: [
            {
              name: 'customerLabeling',
              title: I18N.MainMenu.CustomizedLabeling
            }
          ]
        });
      }
      menuItems.push({
        name: 'customerSetting',
        title: I18N.MainMenu.CustomerSetting,
        children: customerChildren
      });
    }

    return menuItems;
  },

  render: function() {
    var CustomersList = getCurrentCustomers();
    if (!this.state.rivilege) {
      return (
        <div className='jazz-main'>
            <div style={{ display: 'flex', flex: 1, 'alignItems': 'center', 'justifyContent': 'center' }}>
              <CircularProgress  mode="indeterminate" size={2} />
            </div>
          </div>
        );
    } else {
      if (this.state.viewState == viewState.NO_SELECT_CUSTOMERS) {
        return (
          <div>
            {this._renderDialog()}
          </div>
          );
      } else if (this.state.viewState == viewState.SELECT_CUSTOMER || window.toMainApp) {
        return (
          <SelectCustomer close={this._closeSelectCustomer}
          closable={this.props.params.customerId ? true : false}
          currentCustomerId={parseInt(this.props.params.customerId)}
          params={CustomersList}
          userId={parseInt(window.currentUserId)}/>
          );
      } else if (this.state.rivilege !== null && window.currentCustomerId != '') {
        var menuItems = this._getMenuItems();
        var logoUrl = 'Logo.aspx?hierarchyId=' + this.props.params.customerId;
        return (
          <div className='jazz-main'>
                  <MainAppBar items={menuItems} logoUrl={logoUrl} showCustomerList={this._showCustomerList}/>
                  <RouteHandler {...this.props} />
                  <NetworkChecker></NetworkChecker>
                  <ExportChart></ExportChart>
              </div>
          );
      } else {
        return (
          <div className='jazz-main'>
              <div style={{
            display: 'flex',
            flex: 1,
            'alignItems': 'center',
            'justifyContent': 'center'
          }}>
                <CircularProgress  mode="indeterminate" size={2} />
              </div>
            </div>
          );
      }
    }


  },
  componentDidMount() {
    UOMStore.addChangeListener(this._onAllUOMSChange);
    AllCommodityStore.addChangeListener(this._onAllCommoditiesChange);
    MainAction.getAllUoms();
    MainAction.getAllCommodities();
    CurrentUserStore.addCurrentrivilegeListener(this._onCurrentrivilegeChanged);

    CurrentUserCustomerStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    UOMStore.removeChangeListener(this._onAllUOMSChange);
    AllCommodityStore.removeChangeListener(this._onAllCommoditiesChange);
    CurrentUserStore.removeCurrentrivilegeListener(this._onCurrentrivilegeChanged);

    CurrentUserCustomerStore.removeChangeListener(this._onChange);
  }
});

var MessageDialog = React.createClass({
  _cancelApply: function() {
    this.props.onCancel();
  },
  render: function() {
    let cancelProps = {
      onClick: this._cancelApply,
      label: '返回登录页面' //I18N.Common.Button.Cancel
    };
    let actions = [<CusFlatButton {...cancelProps} />];
    return (
      <Dialog title={'无法登录云能效管理平台'} actions={actions} modal={true} openImmediately={true}  contentStyle={{
        width: '600px'
      }}>
				<div>您的帐号没有任何数据权限，请联系您的服务商管理员。</div>
			</Dialog>
      );
  }

});

module.exports = MainApp;
