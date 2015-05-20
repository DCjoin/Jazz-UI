'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, Dialog, FlatButton, Overlay} from 'material-ui';
import assign from "object-assign";


let ChartPanel = React.createClass({
    mixins:[Navigation,State],

render: function () {

      return (
        <div style={{flex:1}}>
  {'ChartPanel'}
        </div>
      );
  }
});

module.exports = ChartPanel;
