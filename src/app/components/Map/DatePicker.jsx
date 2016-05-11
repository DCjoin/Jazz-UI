'use strict';
import React from "react";
import moment from 'moment';
import classNames from 'classnames';
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import { Paper, FlatButton, FontIcon, Mixins } from 'material-ui';
import CommonFuns from '../../util/Util.jsx';
import MapAction from '../../actions/MapAction.jsx';
import MapStore from '../../stores/MapStore.jsx';
import LanguageStore from '../../stores/LanguageStore.jsx';

let DatePicker = React.createClass({
  mixins: [Navigation, State, Mixins.ClickAwayable],
  propTypes: {
    onMenuItemClick: React.PropTypes.func
  },
  getInitialState: function() {
    MapStore.setSelectedDate(5);
    return {
      isDateMenuShow: false,
      dateMenu: MapStore.getDateMenu(),
      dateSelected: MapStore.getSelectedDate()
    };
  },
  _onDateMenuClick: function() {
    this.setState({
      isDateMenuShow: !this.state.isDateMenuShow
    });
  },
  _onMenuItemClick: function(e) {
    this.props.onMenuItemClick(parseInt(e.target.id));
    MapAction.setSelectedDate(parseInt(e.target.id));
    this.setState({
      isDateMenuShow: false
    });
  },
  _generateMenu: function() {
    var menu = [];
    if (this.state.dateMenu.length !== 0) {
      this.state.dateMenu.forEach(item => {
        menu.push(<div id={item.id} className={classNames({
          "menuitem": true,
          "selected": (item.selected)
        })} onClick={this._onMenuItemClick}>
                    {item.text}
                  </div>)
      })
    }
    return menu
  },
  _onDateMenuChanged: function() {
    this.setState({
      dateMenu: MapStore.getDateMenu(),
      dateSelected: MapStore.getSelectedDate()
    });
  },
  componentDidMount: function() {
    MapStore.addDateMenuListener(this._onDateMenuChanged);
  //LanguageStore.addSwitchLanguageListener(this._onLanguageSwitch);
  //setTimeout('MapAction.setSelectedDate(5)',0);
  //this month
  },
  componentWillReceiveProps: function(nextProps) {
    // if (nextProps.lang !== this.props.lang) {
    //   MapAction.setSelectedDate(MapStore.getSelectedDateType()); //this month
    //
    // }

  },
  componentWillUnmount: function() {
    MapStore.removeDateMenuListener(this._onDateMenuChanged);
  //LanguageStore.removeSwitchLanguageListener(this._onLanguageSwitch);
  },
  componentClickAway: function() {
    if (this.state.isDateMenuShow) {
      this.setState({
        isDateMenuShow: false
      })
    }

  },
  render() {
    var dropdownmenu;
    var paperStyle = {
      backgroundColor: '#ffffff',
      zIndex: '100',
      width: '220px',
      padding: '8px 0',
      position: 'absolute',
      // right: '10px',
      left: (document.body.offsetWidth - 220) / 2 + 10,
      top: '110px',
      border: '1px solid #c9c8c8',
    };
    if (this.state.isDateMenuShow) {
      dropdownmenu = <Paper style={paperStyle}>
                      {this._generateMenu()}
                     </Paper>
    }
    return (
      <div className='datepicker'>
          <FlatButton label={this.state.dateSelected}  labelStyle={{
        color: '#767a7a'
      }} onTouchTap={this._onDateMenuClick}>
            <FontIcon className="icon-arrow-down" hoverColor='#1ca8dd' style={{
        fontSize: '12px',
        marginLeft: '-6px'
      }}/>
          </FlatButton>
          {dropdownmenu}
      </div>
      )
  }

});
module.exports = DatePicker;
