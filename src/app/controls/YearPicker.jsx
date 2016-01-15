import React from 'react';
import mui from 'material-ui';
import classNames from 'classnames';
import ViewableDropDownMenu from './ViewableDropDownMenu.jsx';

let {DropDownMenu} = mui;

let YearPicker = React.createClass({

  propTypes: {
    selectedIndex: React.PropTypes.number,
    selectedYear: React.PropTypes.number,
    isViewStatus: React.PropTypes.bool,
    onYearPickerSelected: React.PropTypes.func,
    menuItemStyle: React.PropTypes.object,
    underlineStyle: React.PropTypes.object,
    iconStyle: React.PropTypes.object,
    labelStyle: React.PropTypes.object,
  },
  getDefaultProps() {
    let date = new Date();
    let yearMenuItems = [];
    let yearRange = 10;
    for (var thisYear = date.getFullYear(), i = thisYear - yearRange; i <= thisYear; i++) {
      yearMenuItems.push({
        payload: i,
        text: i
      });
    }
    return {
      noUnderline: false,
      _yearItems: yearMenuItems,
      yearRange: yearRange
    };
  },
  getInitialState() {
    let date = new Date();
    var thisYear = date.getFullYear();
    let index, selectedYear;
    let yearRange = this.props.yearRange;
    if (this.props.selectedIndex === null || this.props.selectedIndex === undefined) {
      if (this.props.selectedYear === null || this.props.selectedYear === undefined) {
        index = yearRange;
        selectedYear = thisYear;
      } else {
        selectedYear = this.props.selectedYear;
        index = selectedYear - thisYear + yearRange;
      }

    } else {
      index = this.props.selectedIndex;
      selectedYear = thisYear - yearRange + index;
    }
    return {
      selectedYear: selectedYear,
      yearIndex: index
    };
  },
  componentWillReceiveProps: function(nextProps) {
    let date = new Date();
    let thisYear = date.getFullYear();
    let index, selectedYear;
    let yearRange = this.props.yearRange;
    if (this.props.selectedIndex !== nextProps.selectedIndex) {
      if (nextProps.selectedIndex === null || nextProps.selectedIndex === undefined) {
        return;
      } else {
        index = nextProps.selectedIndex;
        selectedYear = thisYear - yearRange + index;
      }
      this.setState({
        selectedYear: selectedYear,
        yearIndex: index
      });
    }
    if (this.props.selectedYear !== nextProps.selectedYear) {
      if (nextProps.selectedYear === null || nextProps.selectedYear === undefined) {
        return;
      } else {
        selectedYear = nextProps.selectedYear;
        index = selectedYear - thisYear + yearRange;
      }
      this.setState({
        selectedYear: selectedYear,
        yearIndex: index
      });
    }
  },
  getDateValue(year) {
    var yearValue = year || this.state.selectedYear;

    return yearValue + '';
  },

  _onYearChanged(value) {
    let date = new Date();
    let thisYear = date.getFullYear();
    let yearRange = this.props.yearRange;
    var index;
    if (value) {
      index = value - thisYear + yearRange;
      this.setState({
        selectedYear: value,
        yearIndex: index
      });

      if (this.props.onYearPickerSelected) {
        this.props.onYearPickerSelected(this.getDateValue(value));
      }
    }
  },
  render() {
    var yearProps = {
      dataItems: this.props._yearItems,
      didChanged: this._onYearChanged,
      isViewStatus: this.props.isViewStatus,
      selectedIndex: this.state.yearIndex,
      menuItemStyle: this.props.menuItemStyle,
      underlineStyle: this.props.underlineStyle,
      style: this.props.style,
      iconStyle: this.props.iconStyle,
      labelStyle: this.props.labelStyle,
      title: '',
      textField: 'text',
      className: classNames({
        'jazz-year-selector_dropdownmenu_nounderline': this.props.noUnderline
      })
    };
    return <ViewableDropDownMenu {...yearProps} />;
  }
});

module.exports = YearPicker;
