'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import { Checkbox } from 'material-ui';
import classnames from 'classnames';
import TagAction from '../../actions/TagAction.jsx';
import LabelMenuAction from '../../actions/LabelMenuAction.jsx';
var createReactClass = require('create-react-class');
import PropTypes from 'prop-types';
var TagItem = createReactClass({
  //mixins: [Navigation, State],
  propTypes: {
    title: PropTypes.string.isRequired,
    label: PropTypes.number,
    nodeData: PropTypes.object,
    status: PropTypes.bool,
    disable: PropTypes.bool,
    widgetType: PropTypes.string
  },
  _onClick: function(disabled) {
    if(!disabled){
        TagAction.setTagStatusByTag(this.props.nodeData, !this.props.status);
    }

  },
  getInitialState: function() {
    return {
      disable: false
    };
  },
  render: function() {
    var alarm, baseline, checkBox,
      boxDisabledStatus = false;
    switch (this.props.label) {
      case 0:
        alarm = <div className="disable">{I18N.Tag.AlarmStatus1},</div>;
        baseline = <div className="disable">{I18N.Tag.AlarmStatus3}</div>;
        break;
      case 1:
        alarm = <div className="able">{I18N.Tag.AlarmStatus2},</div>;
        baseline = <div className="disable">{I18N.Tag.AlarmStatus3}</div>;
        break;
      case 2:
        alarm = <div className="able">{I18N.Tag.AlarmStatus2},</div>;
        baseline = <div className="able">{I18N.Tag.AlarmStatus4}</div>;
        break;
    }
    ;
    var boxStyle = {
        marginLeft: '20px',
        width: '24px'
      },
      iconstyle = {
        width: '24px'
      },
      labelstyle = {
        width: '0px',
        height: '0px'
      };
    if ((this.props.status == false) && (this.props.disable == true)) {
      boxDisabledStatus = true
    }

    var alarmInfo = (this.props.widgetType == 'Energy' || !this.props.widgetType) ? (<div className="font">
                                                    {alarm}
                                                    {baseline}
                                                  </div>) : null;
    return (
      <div className="taglist"  onClick={()=>{this._onClick(boxDisabledStatus)}} title={this.props.title}>
        <Checkbox
      checked={this.props.status}
      disabled={boxDisabledStatus}
      style={boxStyle}
      iconStyle={iconstyle}
      labelStyle={labelstyle}
      />
          <div className="label">
            <div className="title">
            {this.props.title}
            </div>
            {alarmInfo}

          </div>



      </div>
      )
  }
});
module.exports = TagItem;
