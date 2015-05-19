
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, Dialog, FlatButton, Overlay} from 'material-ui';
import assign from "object-assign";


let Alarm = React.createClass({
    mixins:[Navigation,State],

render: function () {

      return (
        <div >
            {'alarm page'}
        </div>
      );
  }
});

module.exports = Alarm;
