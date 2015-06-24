import React from 'react';
import mui from 'material-ui';
import classSet from 'classnames';

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
      yearMenuItems.push({text:i+'年',value:i});
    }
    return {
      _yearItems: yearMenuItems,
      yearRange: yearRange
    };
  },
  getInitialState() {
    let date = new Date();
      return {
          selectedYear: date.getFullYear() -1,//默认去年
          yearIndex: this.props.selectedIndex || this.props.yearRange - 1
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
    return <div className={'jazz-alarm-left-panel-year-dropdownmenu-container'}>
      <DropDownMenu menuItems={this.props._yearItems} onChange={this._onYearChanged} selectedIndex={this.state.yearIndex}
      menuItemStyle={this.props.menuItemStyle} underlineStyle={this.props.underlineStyle} style={this.props.style}
      iconStyle={this.props.iconStyle} labelStyle={this.props.labelStyle} />
    </div>;
  }
});

module.exports = YearPicker;
