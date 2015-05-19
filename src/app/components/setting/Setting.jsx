import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, Dialog, FlatButton, Overlay} from 'material-ui';
import assign from "object-assign";


let Setting = React.createClass({
    mixins:[Navigation,State],

render: function () {

      return (
        <div >
          {'setting page'}
        </div>
      );
  }
});

module.exports = Setting;
