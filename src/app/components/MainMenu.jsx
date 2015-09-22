'use strict';

import React from 'react';
import { Link, Navigation, State, RouteHandler } from 'react-router';
import lang from '../lang/lang.jsx';
import GlobalErrorMessageAction from '../actions/GlobalErrorMessageAction.jsx';
var f = lang.f;

var MainMenu = React.createClass({
  mixins: [Navigation, State],
  _onChange: function() {},
  _onClick: function() {
    GlobalErrorMessageAction.ClearGlobalErrorMessage();
  },
  render: function() {

    var params = this.getParams();
    var links = this.props.items.map(item => {
      if (item.disabled) {
        return (<span>{item.title}</span>);
      }
      return (<Link to={item.name} params={params} onClick={this._onClick}>{item.title}</Link>);
    });

    return (
      <div className="jazz-mainmenu">
                <div className="jazz-logo">
                  <div className='jazz_logo_img' style={{
        backgroundImage: 'url(' + this.props.logoUrl + ')'
      }}></div>
                </div>
                <div className="jazz-menu">
                    {links}

                </div>
            </div>

      );
  }

});

module.exports = MainMenu;
