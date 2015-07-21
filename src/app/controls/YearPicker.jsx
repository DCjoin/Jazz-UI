import React from 'react';
import mui from 'material-ui';
import classNames from 'classnames';

let { DropDownMenu } = mui;

let YearPicker = React.createClass({

  propTypes: {
    selectedIndex: React.PropTypes.number,
    isViewStatus: React.PropTypes.bool,
    onYearPickerSelected: React.PropTypes.func,
    menuItemStyle: React.PropTypes.object,
    underlineStyle:React.PropTypes.object,
    iconStyle:React.PropTypes.object,
    labelStyle:React.PropTypes.object,
  },
  getDefaultProps(){
    let date = new Date();
    let yearMenuItems =[];
    let yearRange = 10;
    for(var thisYear=date.getFullYear(), i = thisYear - yearRange; i<=thisYear; i++){
      yearMenuItems.push({text:i,value:i});
    }
    return {
      noUnderline: false,
      _yearItems: yearMenuItems,
      yearRange: yearRange
    };
  },
  getInitialState() {
    let date = new Date();
    let index;
    if(this.props.selectedIndex === null || this.props.selectedIndex === undefined){
      index = this.props.yearRange - 1;
    }else{
      index = this.props.selectedIndex;
    }
      return {
          selectedYear: date.getFullYear() -1,//默认去年
          yearIndex: index
      };
  },
  getDateValue(year){
    var yearValue = year || this.state.selectedYear;

    return yearValue + '' ;
  },

  _onYearChanged(e, selectedIndex, menuItem){
    if(menuItem){
      this.setState({selectedYear: menuItem.value, yearIndex: selectedIndex});

      if (this.props.onYearPickerSelected) {
        this.props.onYearPickerSelected(this.getDateValue(menuItem.value));
      }
    }
  },
  render(){
    return <DropDownMenu menuItems={this.props._yearItems} onChange={this._onYearChanged} selectedIndex={this.state.yearIndex}
      menuItemStyle={this.props.menuItemStyle} underlineStyle={this.props.underlineStyle} style={this.props.style}
      iconStyle={this.props.iconStyle} labelStyle={this.props.labelStyle} className={classNames({'jazz-year-selector_dropdownmenu_nounderline':this.props.noUnderline})} />;
  }
});

module.exports = YearPicker;
