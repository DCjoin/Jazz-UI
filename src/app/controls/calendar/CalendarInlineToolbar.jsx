import React from 'react';
import CalendarI18N from './CalendarI18N.jsx';

export default class CalendarInlineToolbar extends React.Component {
  static propTypes = {
    currentDate: React.PropTypes.object,
    onChange: React.PropTypes.func,
    onDateChange: React.PropTypes.func,
    locale: React.PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this._preMonth = this._preMonth.bind(this);
    this._nextMonth = this._nextMonth.bind(this);
    this._preYear = this._preYear.bind(this);
    this._nextYear = this._nextYear.bind(this);
    this._goToday = this._goToday.bind(this);
  }

  _preMonth(){
  	var year = this.props.currentDate.getFullYear();
    var month = this.props.currentDate.getMonth();
    var date = new Date(year,month-1);
    this.props.onChange(date);
  }

  _nextMonth(){
  	var year = this.props.currentDate.getFullYear();
    var month = this.props.currentDate.getMonth();
    var date = new Date(year,month+1);
    this.props.onChange(date);
  }

  _preYear(){
  	var year = this.props.currentDate.getFullYear();
    var month = this.props.currentDate.getMonth();
    var date = new Date(year-1, month);
    this.props.onChange(date);
  }

  _nextYear(){
  	var year = this.props.currentDate.getFullYear();
    var month = this.props.currentDate.getMonth();
    var date = new Date(year+1, month);
    this.props.onChange(date);
  }

  _goToday(){
    var today = new Date();
    this.props.onChange(today);
    this.props.onDateChange(today);
  }

  render() {
    var i18 = CalendarI18N(this.props.locale);
  	var year = this.props.currentDate.getFullYear();
    var month = this.props.currentDate.getMonth();
    var yearLabel = year + i18["year"];
    var monthLabel = i18["shortMonthList"][month];
    return (
    	<div className="calendar-toolbar" >
    		<div className="calendar-toolbar-action">
        <i key="btn-pre-year" className="pre-year icon-double-arrow-left" onClick={this._preYear} ></i>
        <i key="btn-pre-month" className="pre-month icon-arrow-left" onClick={this._preMonth}></i>
        <span className="year-select" >{yearLabel} </span>
        <span className="month-select" >{monthLabel}</span>
        <i key="btn-next-month" className="next-month icon-arrow-right" onClick={this._nextMonth}></i>
        <i key="btn-next-year" className="next-year icon-double-arrow-right" onClick={this._nextYear}></i>
        </div>
        <span className="today-select" onClick={this._goToday}>{i18["today"]}</span>
		</div>
    );
  }
}