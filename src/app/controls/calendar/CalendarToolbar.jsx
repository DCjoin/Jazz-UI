import React from 'react';
import CalendarI18N from './CalendarI18N.jsx';
import classnames from 'classnames';

export default class CalendarToolbar extends React.Component {
  static propTypes = {
    currentDate: React.PropTypes.object,
    onChange: React.PropTypes.func,
    displayActionButton: React.PropTypes.bool,
    displaySelectButton: React.PropTypes.bool,
    locale: React.PropTypes.string.isRequired
  };

  static defaultProps = {
  	displayActionButton: true,
    displaySelectButton:true
  };

  constructor(props) {
    super(props);
    this._preMonth = this._preMonth.bind(this);
    this._nextMonth = this._nextMonth.bind(this);
    this._preYear = this._preYear.bind(this);
    this._nextYear = this._nextYear.bind(this);
    this._switchYearSelection = this._switchYearSelection.bind(this);
    this._switchMonthSelection = this._switchMonthSelection.bind(this);
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

  _switchMonthSelection(){
    if (this.props.displaySelectButton){
      this.props.onChange(null,"month");
    }
  }

  _switchYearSelection(){
    if (this.props.displaySelectButton){
      this.props.onChange(null,"year");
    }
  }

  _renderActionButton(){
  	var buttons = [];
  	buttons.push(<i key="btn-pre-year" className="pre-year icon-double-arrow-left" onClick={this._preYear} ></i>);
  	buttons.push(<i key="btn-next-year" className="next-year icon-double-arrow-right" onClick={this._nextYear}></i>);
  	buttons.push(<i key="btn-pre-month" className="pre-month icon-arrow-left" onClick={this._preMonth}></i>);
  	buttons.push(<i key="btn-next-month" className="next-month icon-arrow-right" onClick={this._nextMonth}></i>);
  	return this.props.displayActionButton?buttons:null;
  }

  render() {
    var i18 = CalendarI18N(this.props.locale);
  	var year = this.props.currentDate.getFullYear();
    var month = this.props.currentDate.getMonth();
    var yearLabel = year + i18["year"];
    var monthLabel = i18["shortMonthList"][month];

    var yearSelectClazz = classnames({
      "year-select": true,
      "active": this.props.displaySelectButton
    });

    var monthSelectClazz = classnames({
      "month-select": true,
      "active": this.props.displaySelectButton
    });

    return (
    	<div className="calendar-toolbar" >
    		<span className={yearSelectClazz} onClick={this._switchYearSelection}>{yearLabel}</span>
    		<span className={monthSelectClazz} onClick={this._switchMonthSelection}>{monthLabel}</span>
    		{this._renderActionButton()}
		</div>
    );
  }
}
