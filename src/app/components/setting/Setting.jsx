import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {SvgIcon, IconButton, DropDownMenu, TextField, Dialog, FlatButton, Overlay} from 'material-ui';
import assign from "object-assign";
import AlarmSetting from './AlarmSetting.jsx';
import BaselineModify from './BaselineModify.jsx';

let Setting = React.createClass({
    mixins:[Navigation,State],
    handleAlarmSetting: function(e){

  				console.log(e.nativeEvent);
          this.refs.alarmSetting.showDialog();
  			},
        handleModify: function(e){
              console.log("handleModify");
              this.refs.baselineModify.showDialog();
            },
render: function () {

      return (
        <div >
          {'setting page'}
          <AlarmSetting  ref="alarmSetting"/>
          <BaselineModify  ref="baselineModify"/>
          <br/>
          <button  onClick={this.handleAlarmSetting}> >AlarmSetting</button>
          <button  onClick={this.handleModify}> >BaselineModify</button>
        </div>
      );
  }
});

module.exports = Setting;
