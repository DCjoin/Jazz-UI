import React from 'react';
import {DropDownMenu} from 'material-ui';
import classSet from 'classnames';
import CommonFuns from '../util/Util.jsx';

var DaytimeSelector = React.createClass({
  propTypes: {
    from: React.PropTypes.number,
    step: React.PropTypes.number,
    to: React.PropTypes.number,
    minute: React.PropTypes.number,
    style: React.PropTypes.object,

    isViewStatus: React.PropTypes.bool,
    onChange:React.PropTypes.func
  },
  getDefaultProps: function() {
    return {
      from: 0,
      step: 30,
      to: 0,
      isViewStatus: true
    };
  },
  getInitialState: function() {
    return {
      value: this.props.minute || this.props.from || 0
    };
  },
  shouldComponentUpdate: function(nextProps, nextState){
    var p = this.props, n = nextProps;
    return n.from != p.from || n.to != p.to || n.minute != p.minute || n.isViewStatus != p.isViewStatus;
  },
  componentDidUpdate: function () {
    this.setState({
      value: this.props.minute,
      from: this.props.start,
      to: this.props.end,
    }) ;
  },
  _onChange(e, selectedIndex, menuItem){
    // e.preventDefault();
    // e.stopPropagation();
    var preVal = this.state.value;
    this.state.value = this.props.from + this.props.step * selectedIndex;
    if(this.props.onChange){
      this.props.onChange(e, this.state.value, preVal);
    }
  },
  getValue: function(){
    return this.state.value;
  },
  setValue: function(val){
    this.setState({value: val});
  },
  render: function(){
    var menuItems = [];
    var minutes = this.props.from;

    for (var i = 1; ; i++) {
      var hmstr = CommonFuns.numberToTime(minutes);
      menuItems.push({ payload: i.toString(), text: hmstr });

      minutes = minutes + this.props.step;
      if(minutes > this.props.to) break;
    }

    var ddmProps=null;

    if(!this.props.isViewStatus){
      ddmProps = {
        onChange: this._onChange,
        menuItems: menuItems
      };
      var index = 0;
      if(this.state.value){
        index = (this.state.value - this.props.from) / this.props.step;
      }
      ddmProps.selectedIndex = index;

      var ddm = <DropDownMenu ref="DropDownMenu" style={this.props.style}
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
