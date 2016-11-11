'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import { IconButton, DropDownMenu, DatePicker, FlatButton, FontIcon, Classable } from 'material-ui';


let RightPanel = React.createClass({
  //mixins: [Classable, Navigation, State],

  propTypes: {
    onButtonClick: React.PropTypes.func,
    defaultStatus: React.PropTypes.bool,
    container: React.PropTypes.object
  },
  _onToggle: function() {

    if (this.props.onButtonClick) {
      this.props.onButtonClick();
    }
    ;

    this.setState({
      open: !this.state.open
    });
    return this;
  },

  getInitialState: function() {
    return {
      open: this.props.defaultStatus
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      open: nextProps.defaultStatus
    })
  },

  render: function() {
    var mainpanel;
    if (this.state.open) {
      mainpanel = <div style={{
        display: 'flex',
        width: '320px'
      }}>{this.props.container}</div>;
    } else {
      mainpanel = <div style={{
        display: 'none'
      }}>{this.props.container}</div>;

    }
    var buttonStyle = {

        minWidth: '36px',
        width: '36px',
        height: '36px',
        verticalAlign: 'middle',
        margin: '10px 0 0 -36px',
      },
      iconStyle = {
        fontSize: '36px',
        color: '#abafae'
      };

    return (
      <div className="jazz-dataselectpanel">
            <FlatButton   style={buttonStyle} onClick={this._onToggle}>
              <FontIcon className="icon-taglist-fold" style={iconStyle}/>
            </FlatButton>
          {mainpanel}

        </div>
      )
  }
});
module.exports = RightPanel;
