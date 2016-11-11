'use strict';

import React from 'react';
import {Mixins,Styles,ClearFix,Toolbar,ToolbarGroup,IconButton} from 'material-ui';
// import NavigationChevronLeft from '../../../node_modules/material-ui/lib/svg-icons/navigation/chevron-left';
// import NavigationChevronRight from '../../../node_modules/material-ui/lib/svg-icons/navigation/chevron-right';
// import SlideInTransitionGroup from '../../../node_modules/material-ui/lib/transition-groups/slide-in.js';

var CalendarYear = React.createClass({
  propTypes: {
    selectedYear: React.PropTypes.number.isRequired,
    onYearChange: React.PropTypes.func,
    prevYear: React.PropTypes.bool,
    nextYear: React.PropTypes.bool
  },
  getDefaultProps() {
    return {
      prevYear: true,
      nextYear: true
    };
  },
  getInitialState() {
    return {
      transitionDirection: 'up',
    };
  },
  componentWillReceiveProps(nextProps) {
    let direction;

    if (nextProps.selectedYear !== this.props.selectedYear) {
      direction = nextProps.selectedYear > this.props.selectedYear ? 'up' : 'down';
      this.setState({
        transitionDirection: direction,
      });
    }
  },

  _styles() {
    return {
      root: {
        position: 'relative',
        padding: 0,
        backgroundColor: 'inherit',
        height: '40px'
      },

      title: {
        position: 'absolute',
        top: '17px',
        lineHeight: '14px',
        fontSize: '14px',
        height: '14px',
        width: '100%',
        fontWeight: '500',
        textAlign: 'center'
      },
    };
  },
  render() {
    let year = this.props.selectedYear;
    let styles = this._styles();

    return (
      <Toolbar className="mui-date-picker-calendar-toolbar" style={styles.root} noGutter={true}>
        <ToolbarGroup key={0} float="left">
          <IconButton
            disabled={!this.props.prevYear}
            onTouchTap={this._prevYearTouchTap}>

          </IconButton>
        </ToolbarGroup>

          style={styles.title}
          direction={this.state.transitionDirection}>
          <div key={year}>{year}</div>




        <ToolbarGroup key={1} float="right">
          <IconButton
            disabled={!this.props.nextYear}
            onTouchTap={this._nextYearTouchTap}>
          </IconButton>
        </ToolbarGroup>
      </Toolbar>
    );
  },
  _prevYearTouchTap() {
    if (this.props.onYearChange && this.props.prevYear) this.props.onYearChange(-1);
  },

  _nextYearTouchTap() {
    if (this.props.onYearChange && this.props.nextYear) this.props.onYearChange(1);
  },
});

module.exports = CalendarYear;
