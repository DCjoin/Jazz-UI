'use strict';

import React from 'react';
import classnames from 'classnames';
import assign from 'object-assign';
import {find} from 'lodash-es';
import { CircularProgress } from 'material-ui';
import remove from 'lodash-es/remove';
import PropTypes from 'prop-types';
import PermissionCode from 'constants/PermissionCode.jsx';

import RoutePath from 'util/RoutePath.jsx';
import PrivilegeUtil from 'util/privilegeUtil.jsx';

import BackgroudImage from 'controls/BackgroundImage.jsx';

import CurrentUserCustomerStore from 'stores/CurrentUserCustomerStore.jsx';
import LoginStore from 'stores/LoginStore.jsx';
import UserStore from 'stores/UserStore.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import CommodityStore from 'stores/CommodityStore.jsx';
import HierarchyStore from 'stores/HierarchyStore.jsx';

import HierarchyAction from 'actions/hierarchySetting/HierarchyAction.jsx';
import BaseHierarchyAction from 'actions/HierarchyAction.jsx';
import LoginActionCreator from 'actions/LoginActionCreator.jsx';

function getCustomerPrivilageById(customerId) {
  return UserStore.getUserCustomers().find(customer => customer.get('CustomerId') === customerId * 1 );
}

function isWholeCustomer(customerId) {
  return getCustomerPrivilageById( customerId ) && getCustomerPrivilageById( customerId ).get('WholeCustomer');
}

function getFirstMenuPathFunc(menu) {
  let firstMenu = menu[0];
  if( !firstMenu ) {
    return function() {
      console.err('No has any menu');
    }
  }
  if(firstMenu.children && firstMenu.children.length > 0) {
    let firstChild = firstMenu.children[0];
    if(firstChild.list && firstChild.list.length > 0) {
      return firstChild.list[0].getPath;
    }
  }
  return  firstMenu.getPath;
}

let selectCustomerId = null;
var createReactClass = require('create-react-class');
const SelectCustomer = createReactClass({
  propTypes: {
    onClose: PropTypes.func,
  },
  contextTypes: {
    router: PropTypes.object,
    currentRoute: PropTypes.object,
  },
  componentWillMount() {
    HierarchyStore.addBuildingListListener(this._onChange);
    window.addEventListener('resize', this._handleResize);
  },
  componentWillUnmount: function() {
    HierarchyStore.removeBuildingListListener(this._onChange);
    window.removeEventListener('resize', this._handleResize);
  },
  getInitialState() {
    selectCustomerId = null;
    return {
      step: 1,
      hierarchyList: null,
      selectCustomerId: null,      
    }
  },
  _handleResize() {
    this.forceUpdate();
  },
  _onChange() {
    let hierarchyList = HierarchyStore.getBuildingList();

    if( hierarchyList.length === 0 ) {
      return this._selectCustomerDone(selectCustomerId, selectCustomerId);
    } else if(hierarchyList.length === 1 && !isWholeCustomer(selectCustomerId) ) {
      let firstHierarchyId = hierarchyList[0].Id;
      return this._selectCustomerDone(selectCustomerId, firstHierarchyId);
    } else {
      this.setState({
        hierarchyList,
      });
    }
  },
  _hasClose() {
    return this._getCurrentCustomerId() || this._getCusNum();
  },
  _getCurrentCustomerId() {
    return this.context.currentRoute.params.customerId || '';
  },
  _getCusNum() {
    return this.context.currentRoute.params.cusnum || '';
  },
  _getMenuItems(customerId, hierarchyId) {
    let menuItems = CurrentUserStore.getMainMenuItems();

    if( !hierarchyId || customerId == hierarchyId ||
      ( !PrivilegeUtil.canView(PermissionCode.PUSH_SOLUTION, CurrentUserStore.getCurrentPrivilege())
          && !PrivilegeUtil.isFull(PermissionCode.SOLUTION_FULL, CurrentUserStore.getCurrentPrivilege()) ) ) {
      remove(menuItems, (item) => {
        return item.title === I18N.MainMenu.SaveSchemeTab
      });
    }
    if(!hierarchyId || customerId == hierarchyId){
      remove(menuItems, (item) => {
        return item.title === I18N.MainMenu.SmartDiagnose
      });
    }
    return menuItems;
  },
  _onClose(hierarchyId) {
    if(this.props.onClose) {
      this.props.onClose(hierarchyId);
    }
  },
  _selectCustomerChangeHandler: function(customerId) {
    selectCustomerId = customerId;
    this.setState({
      selectCustomerId: customerId * 1,
      step: 2,
    });
    setTimeout(() => {
      BaseHierarchyAction.getBuildingListByCustomerId(customerId)
    }, 0);
  },

  _selectCustomerDone(customerId, hierarchyId) {
    CommodityStore.resetHierInfo();
    HierarchyAction.resetAll();
    let mainItems = this._getMenuItems(customerId, hierarchyId);
    if( mainItems.length === 0 ) {
      this.context.router.replace(RoutePath.blankPage(
        assign({}, this.context.currentRoute.params, {
          customerId
        })
      ) + '?init_hierarchy_id=' + hierarchyId);
    } else {      
      this.context.router.replace(getFirstMenuPathFunc( mainItems )(
        assign({}, this.context.currentRoute.params, {
          customerId
        })
      ) + '?init_hierarchy_id=' + hierarchyId);
    }
    this._onClose(hierarchyId);
  },

  _sysManagement() {
    this.context.router.replace(RoutePath.workday(assign({}, this.context.currentRoute.params, {
      cusnum: CurrentUserCustomerStore.getAll().length
    })));
    this._onClose();
  },

  _renderContent() {
    let {step, hierarchyList, selectCustomerId} = this.state;
    if( CurrentUserCustomerStore.getAll().length === 0 && !LoginStore.checkHasSpAdmin() ) {
      return (
        <div className='jazz-select-customer-no-pril-tip'>
          <div>抱歉，您没有任何查看权限，</div>
          <div>请退出后联系您的管理员</div>
          <button onClick={() => {
            LoginActionCreator.logout();
            location.href = RoutePath.logout(this.context.router.params, encodeURIComponent(location.origin));
          }}>退出</button>
        </div>
      );
    }
    if( step === 1 ) {
      return (
        <ul className='jazz-select-customer-list' style={{height: document.body.clientHeight - 82}}>
          {CurrentUserCustomerStore.getAll().map( cus => 
            <li className='jazz-select-customer-item' style={{width: (document.body.clientWidth - 20) / 3, height: document.body.clientHeight / 3}}>
              <a href='javascript:void(0)' className='jazz-select-customer-item-content' onClick={() => this._selectCustomerChangeHandler(cus.Id)}>
                <div className='jazz-select-customer-item-logo'><BackgroudImage imageContent={{hierarchyId: cus.Id}}/></div>
                <div style={{textAlign: 'center'}}>{cus.Name}</div>
              </a>
            </li>
           )}
        </ul>
      );
    } else {
      if(!hierarchyList || !(hierarchyList instanceof Array)) {
        return (<div className='flex-center jazz-select-customer-hierarchy-list-wrapper'><CircularProgress size={80} /></div>)
      }
      return (
        <div className='jazz-select-customer-hierarchy-list-wrapper'>          
          <div className='jazz-select-customer-hierarchy-list'>
            {isWholeCustomer(selectCustomerId) && <div className='jazz-select-customer-hierarchy-list-header'>{I18N.SelectCustomer.Group}</div>}
            {isWholeCustomer(selectCustomerId) && <a href='javascript:void(0)' className='jazz-select-customer-hierarchy-list-item' onClick={() => {
              this._selectCustomerDone(selectCustomerId, selectCustomerId);
            }}>{find(CurrentUserCustomerStore.getAll(), cus => cus.Id === selectCustomerId).Name}</a>}
            <div className='jazz-select-customer-hierarchy-list-header'>{I18N.SelectCustomer.Single}</div>
            {hierarchyList.map( hier => 
            <a href='javascript:void(0)' className='jazz-select-customer-hierarchy-list-item' onClick={() => {
              this._selectCustomerDone(selectCustomerId, hier.Id);
            }}>{hier.Name}</a> )}
          </div>
        </div>
      );
    }
  },

  render: function() {
    let {step} = this.state;
    return (
      <div className='jazz-select-customer'>
        {this._hasClose() && <em onClick={this._onClose.bind(this, '')} className='icon-close'/>}
        <header className="jazz-select-customer-header">
          <div>
            <span className={classnames('step', {link: step === 2})} onClick={() => {
              if(step === 2) {
                selectCustomerId = null;
                this.setState({
                  step: 1,
                  selectCustomerId: null,
                  hierarchyList: null,
                });
              }
            }}>{I18N.SelectCustomer.Title}</span>
            {step === 2 && 
            <span>
              >> <span className='step'>{I18N.SelectCustomer.SubTitle}</span>
            </span>}
          </div>
          {LoginStore.checkHasSpAdmin() && 
          <a href='javascript:void(0)' 
            className="jazz-select-customer-sp-manage"
            title={I18N.SelectCustomer.SysManagementTip} 
            onClick={this._sysManagement}>
            {I18N.SelectCustomer.SysManagement}
            <em className='icon-setting'/>
          </a>}
        </header>
        {this._renderContent()}
      </div>
    );
  }
});

module.exports = SelectCustomer;
