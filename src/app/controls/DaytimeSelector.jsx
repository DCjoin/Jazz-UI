import React from 'react';
import {DropDownMenu} from 'material-ui';
import MenuItem from 'material-ui/MenuItem';
import classSet from 'classnames';
import CommonFuns from '../util/Util.jsx';
var createReactClass = require('create-react-class');
import PropTypes from 'prop-types';
var DaytimeSelector = createReactClass({
  propTypes: {
    from: PropTypes.number,
    step: PropTypes.number,
    to: PropTypes.number,
    minute: PropTypes.number,
    style: PropTypes.object,

    isViewStatus: PropTypes.bool,
    onChange:PropTypes.func
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

  componentWillReceiveProps: function(nextProps){
    if(nextProps && nextProps.minute){
      this.setState({value: nextProps.minute});
    }
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
      dropdownValue:null
    }) ;
  },
  _onChange(e, selectedIndex, value){
    // e.preventDefault();
    // e.stopPropagation();
    var preVal = this.state.value;
    this.setState({
      value:this.props.from + this.props.step * selectedIndex,
      dropdownValue:value
    },()=>{
      if(this.props.onChange){
        this.props.onChange(e, this.state.value, preVal);
      }
    })
    //this.state.value = this.props.from + this.props.step * selectedIndex;

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
      menuItems.push(
        <MenuItem value={i.toString()} primaryText={hmstr} />);
        // { payload: i.toString(), text: hmstr });

      minutes = minutes + this.props.step;
      if(minutes > this.props.to) break;
    }

    var ddmProps=null;

    if(!this.props.isViewStatus){
      ddmProps = {
        onChange: this._onChange,
        // menuItems: menuItems
      };

      var index = 0;
      if(this.state.value){
        index = (this.state.value - this.props.from) / this.props.step;
      }
      ddmProps.selectedIndex = index;

      var ddm = <DropDownMenu ref="DropDownMenu" value={this.state.dropdownValue} style={this.props.style} className="jazz-setting-daytimeSelector"
        {...ddmProps}>
        {menuItems}
      </DropDownMenu>;
      return ddm;
    }
    else{
      var time = CommonFuns.numberToTime(this.state.value);
      return (<span ref="Span">{time}</span>);
    }
  }
});

module.exports = DaytimeSelector;
