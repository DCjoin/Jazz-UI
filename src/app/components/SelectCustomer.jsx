'use strict';

import React from 'react';
import { Navigation, State } from 'react-router';
import classNames from 'classnames';
import _findIndex from 'lodash/array/findIndex';
import assign from 'object-assign';

import BackgroudImage from '../controls/BackgroundImage.jsx';
import CurrentUserCustomerStore from '../stores/CurrentUserCustomerStore.jsx';
import SelectCustomerActionCreator from '../actions/SelectCustomerActionCreator.jsx';
import LoginStore from '../stores/LoginStore.jsx';
import CurrentUserStore from '../stores/CurrentUserStore.jsx';
import CurrentUserAction from '../actions/CurrentUserAction.jsx';
import CommodityStore from '../stores/CommodityStore.jsx';
import HierarchyAction from '../actions/hierarchySetting/HierarchyAction.jsx';
import RoutePath from '../util/RoutePath.jsx';
var timeoutHandler = null;
var _ = {
  findIndex: _findIndex
};

var SelectCustomer = React.createClass({
  propTypes: {
    onClose: React.PropTypes.func,
  },
  contextTypes: {
    router: React.PropTypes.object,
    currentRoute: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      currentIndex: 0,
    };
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

    // this.context.router.
  },
  _onClose() {

    this.setState(this.getInitialState());
    if(this.props.onClose) {
      this.props.onClose();
    }
  },
  _selectCustomerChangeHandler: function(selectedIndex) {
    if (this.state.currentIndex == selectedIndex) {
      CommodityStore.resetHierInfo();
      HierarchyAction.resetAll();

      this.context.router.replace(RoutePath[this._getMenuItems()[0].name](
        assign({}, this.context.currentRoute.params, {
          customerId: CurrentUserCustomerStore.getAll()[selectedIndex].Id
        })
      ));
      this._onClose();
    } else {
      this.setState({
        currentIndex: selectedIndex
      });
    }
  },

  _getCustomerList() {
    var customerList = CurrentUserCustomerStore.getAll();
    if (customerList && customerList.length > 0) {
      customerList = customerList.map(((item, idx) => {
        var style = {
          opacity: 0.95
        };
        var innerStyle = {
          width: '90%',
          height: '90%',
          cursor: 'pointer'
        };
        var baseWidth = this.state.screenWidth / 5.5;
        var baseHeight = baseWidth / 2;
        if (baseWidth < 210)
          baseWidth = 210;
        style.width = baseWidth + 'px';
        style.height = baseHeight + 'px';
        style.minWidth = style.width;
        var gap = this.state.currentIndex - idx;
        var title = null;
        if (this.state.currentIndex != idx) {
          var absGap = Math.abs(gap);
          if (absGap == 1) {
            style.opacity = 0.8;
            innerStyle.width = '48%';
            innerStyle.height = '48%';
          } else if (absGap == 2) {
            style.opacity = 0.65;
            innerStyle.width = '32%';
            innerStyle.height = '32%';
          }
        } else {
          title = item.Name;
        }
        style.left = ((this.state.screenWidth - 150 * 2 - baseWidth) / 2 - this.state.currentIndex * baseWidth) + 'px';

        var imageContent = {
          hierarchyId: item.Id,
        };
        var customerName = item.Name;

        return (
          <div className="jazz-select-customer-ct" style={style} key={idx} onClick={this._selectCustomerChangeHandler.bind(this, idx)} >
                    <div style={innerStyle} title={customerName}>
                      <BackgroudImage imageContent={imageContent} />
                    </div>
                    {customerName && <span className="jazz-select-cusName">{customerName}</span>}
                </div>
          );
      }).bind(this));

      return customerList;
    }
    return
  },

  _prevPage() {
    if (this.state.currentIndex > 0) {
      this.setState({
        currentIndex: this.state.currentIndex - 1
      });
    }
  },
  _nextPage() {
    var customerList = CurrentUserCustomerStore.getAll();
    if (this.state.currentIndex < (customerList.length - 1)) {
      this.setState({
        currentIndex: this.state.currentIndex + 1
      });
    }
  },

  _handleResize() {
    if (timeoutHandler != null) {
      clearTimeout(timeoutHandler);
    }
    timeoutHandler = setTimeout(() => {
      this.setState({
        screenWidth: document.getElementById('emopapp').clientWidth
      });
    }, 400);
  },

  _sysManagement() {
    this.context.router.replace(RoutePath.workday(assign({}, this.context.currentRoute.params, {
      cusnum: CurrentUserCustomerStore.getAll().length
    })));
    this._onClose();
  },

  componentDidMount: function() {
    window.addEventListener('resize', this._handleResize);

    var that = this,
      app = document.getElementById('emopapp');

    this.setState({
      screenWidth: app.clientWidth,
    });

    if (this._getCustomerList()) {
      var customerList = CurrentUserCustomerStore.getAll();
      var idx = _.findIndex(customerList, 'Id', this._getCustomerList() * 1);
      if (idx < 0)
        idx = 0;
      this.setState({
        currentIndex: idx
      });
    }
  },
  componentWillMount: function() {
    window.removeEventListener('resize', this._handleResize);

    if (this._getCustomerList()) {
      var customerList = CurrentUserCustomerStore.getAll();
      var idx = _.findIndex(customerList, 'Id', this._getCustomerList() * 1);
      if (idx < 0)
        idx = 0;
        this.setState({
          currentIndex: idx
        });
    }
  },

  render: function() {
    if ( this._hasClose() ) {
      var closeButton = (
      <em className="icon-close pop-close-overlay-icon" onClick={this._onClose} style={{
        margin: -10,
        padding: 10,
        position: 'absolute',
        zIndex: 100,
        top: '30px',
        right: '30px',
        color: '#fff'
      }}></em>
      );
    }
    var leftHandlerBarStyle = {};
    var rightHandlerBarStyle = {};
    var spManagementStyle = {};
    if (this.state.currentIndex === 0) {
      leftHandlerBarStyle.visibility = 'hidden';
    }
    if (this.state.currentIndex == (CurrentUserCustomerStore.getAll().length - 1)) {
      rightHandlerBarStyle.visibility = 'hidden';
    }
    return (
      <div style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        zIndex: 999,
        left: 0,
        top: 0,
      }}>
                <div className="jazz-selectbg"></div>
                <div className="jazz-mask"></div>
                <div className="jazz-customerList">
                  <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
                    <span style={{
        position: 'fixed',
        width: '100%',
        fontSize: '22px',
        top: "20%",
        textAlign: 'center',
        color: 'white'
      }}>{I18N.SelectCustomer.Title}</span>
                    <div style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column'
      }}>
                      {closeButton}
                      <div style={{
        flex: 1,
        display: 'flex'
      }}>
                        <div className="jazz-select-customer-handler" style={leftHandlerBarStyle} onClick ={this._prevPage} >
                          <em className="icon-arrow-left"></em>
                        </div>
                        <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
                          <div id="pop_select_customer_list" style={{
        flex: 1,
        display: 'flex'
      }}>{this._getCustomerList()}</div>
                        </div>
                        <div className="jazz-select-customer-handler" style={rightHandlerBarStyle} onClick ={this._nextPage}>
                          <em className="icon-arrow-right"></em>
                        </div>
                      </div>
                    </div>
                    {LoginStore.checkHasSpAdmin() && <span title={I18N.SelectCustomer.SysManagementTip} className="jazz-select-sp-manage" style={spManagementStyle}
      onClick={this._sysManagement}>{I18N.SelectCustomer.SysManagement}></span>}
                  </div>
                </div>
            </div>

      );
  }
});

module.exports = SelectCustomer;
