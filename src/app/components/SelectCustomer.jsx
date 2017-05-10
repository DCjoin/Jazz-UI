'use strict';

import React from 'react';
import classNames from 'classnames';
import assign from 'object-assign';

import RoutePath from 'util/RoutePath.jsx';

import BackgroudImage from 'controls/BackgroundImage.jsx';

import CurrentUserCustomerStore from 'stores/CurrentUserCustomerStore.jsx';
import LoginStore from 'stores/LoginStore.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import CommodityStore from 'stores/CommodityStore.jsx';

import HierarchyAction from 'actions/hierarchySetting/HierarchyAction.jsx';

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

const SelectCustomer = React.createClass({
  propTypes: {
    onClose: React.PropTypes.func,
  },
  contextTypes: {
    router: React.PropTypes.object,
    currentRoute: React.PropTypes.object,
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
  _getMenuItems() {
    return CurrentUserStore.getMainMenuItems();
  },
  _selectCustomer() {
    let customerId = this._getCurrentCustomerId() * 1,
    pathname = '';
    if( customerId === -1 ) {
      pathname = RoutePath.workday(assign({}, this.context.currentRoute.params, {
        cusnum: CurrentUserCustomerStore.getAll().length
      }));
    } else {
      let menus = CurrentUserStore.getMainMenuItems();
      pathname = RoutePath[menus[0].name](assign({}, this.context.currentRoute.params, {customerId}));
    }
    this.context.router.replace(pathname);

  },
  _onClose() {
    if(this.props.onClose) {
      this.props.onClose();
    }
  },
  _selectCustomerChangeHandler: function(customerId) {
    CommodityStore.resetHierInfo();
    HierarchyAction.resetAll();

    this.context.router.replace(getFirstMenuPathFunc( this._getMenuItems() )(
      assign({}, this.context.currentRoute.params, {
        customerId
      })
    ));
    this._onClose();
  },

  _sysManagement() {
    this.context.router.replace(RoutePath.workday(assign({}, this.context.currentRoute.params, {
      cusnum: CurrentUserCustomerStore.getAll().length
    })));
    this._onClose();
  },

  render: function() {
    return (
      <div className='jazz-select-customer'>
        {this._hasClose() && <em onClick={this._onClose} className='icon-close'/>}
        <header className="jazz-select-customer-header">
          <span className='step'>{I18N.SelectCustomer.Title}</span>
          {LoginStore.checkHasSpAdmin() && 
          <a href='javascript:void(0)' 
            className="jazz-select-customer-sp-manage"
            title={I18N.SelectCustomer.SysManagementTip} 
            onClick={this._sysManagement}>
            {I18N.SelectCustomer.SysManagement}
            <em className='icon-setting'/>
          </a>}
        </header>

        <ul className='jazz-select-customer-list'>
          {CurrentUserCustomerStore.getAll().map( cus => 
            <li className='jazz-select-customer-item'>
              <a href='javascript:void(0)' className='jazz-select-customer-item-content' onClick={() => this._selectCustomerChangeHandler(cus.Id)}>
                <div className='jazz-select-customer-item-logo'><BackgroudImage imageContent={{hierarchyId: cus.Id}}/></div>
                {cus.Name}
              </a>
            </li>
           )}
        </ul>
      </div>
    );
  }
});

module.exports = SelectCustomer;
