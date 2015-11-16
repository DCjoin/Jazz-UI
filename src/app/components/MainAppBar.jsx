'use strict';

import React from 'react';
import { Link, Navigation, State, RouteHandler } from 'react-router';
import lang from '../lang/lang.jsx';
import ButtonMenu from '../controls/ButtonMenu.jsx';
import MainMenu from '../controls/MainMenu.jsx';
import GlobalErrorMessageAction from '../actions/GlobalErrorMessageAction.jsx';
let MenuItem = require('material-ui/lib/menus/menu-item');
var f = lang.f;
var title;

var MainAppBar = React.createClass({
  mixins: [Navigation, State],
  _onChange: function() {},
  _onClick: function() {
    GlobalErrorMessageAction.ClearGlobalErrorMessage();
  },
  render: function() {

    var params = this.getParams();

    return (
      <div className="jazz-mainmenu">
                <div className="jazz-logo">
                  <div className='jazz_logo_img' style={{
        backgroundImage: 'url(' + this.props.logoUrl + ')'
      }}></div>
                </div>
                <div className="jazz-menu">
                    <MainMenu items={this.props.items} params={params}  onClick={this._onClick}/>
                </div>
            </div>

      );
  }

});

module.exports = MainAppBar;
