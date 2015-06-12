import React from 'react';
import {DropDownMenu} from 'material-ui';
import classSet from 'classnames';
import CommonFuns from '../util/Util.jsx';

var DaytimeSelector = React.createClass({
  propTypes: {
    start: React.PropTypes.number,
    step: React.PropTypes.number,
    end: React.PropTypes.number,
    defaultMinute: React.PropTypes.number,

    isViewStatus: React.PropTypes.bool,
    onChange:React.PropTypes.func
  },
  getDefaultProps: function() {
    return {
      start: 0,
      step: 30,
      end: 0,
      isViewStatus: true
    };
  },
  getInitialState: function() {
    return {
      value: this.props.defaultMinute || this.props.start || 0
    };
  },
  componentWillReceiveProps: function (nextProps) {
    this.setState({value:nextProps.value}) ;
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if(this.props.isViewStatus == nextProps.isViewStatus
      && this.props.value == nextProps.value
      && this.state == nextState){
      return false;
    }
    return true;
  },

  _onChange(e, selectedIndex, menuItem){
    var preVal = this.state.value;
    this.state.value = this.props.start + this.props.step * selectedIndex;
    if(this.props.onChange){
      this.props.onChange(e, this.state.value, preVal);
    }
  },
  getValue: function(){
    return this.state.value;
  },
  setValue: function(val){
    if(val){
      if(this.props.isViewStatus == nextProps.isViewStatus){
        this.refs.Span.text = CommonFuns.numberToTime(val);
      }else{
        this.refs.DropDownMenu.selectedIndex = (val - this.props.start) / this.props.step;
      }
    }
  },


  render: function(){
    var menuItems = [];
    var minutes = this.props.start;

    for (var i = 1; ; i++) {
      var hmstr = CommonFuns.numberToTime(minutes);
      menuItems.push({ payload: i.toString(), text: hmstr });

      minutes = minutes + this.props.step;
      if(minutes > this.props.end) break;
    }

    var ddmProps=null;

    if(!this.props.isViewStatus){
      ddmProps = {
        onChange: this._onChange,
        menuItems: menuItems
      };
      var index = 0, defaultMinute = 0;
      if(this.props.defaultMinute){
        index = (this.state.value - this.props.start) / step;
      }
      ddmProps.selectedIndex = index;

      var ddm = <DropDownMenu ref="DropDownMenu"
        {...ddmProps} />;
      return ddm;
    }
    else{
      var time = CommonFuns.numberToTime(this.state.value);
      return (<span ref="Span">{time}</span>);
    }
  }
});

module.exports = DaytimeSelector;
