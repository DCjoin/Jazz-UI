import React from 'react';
import CalendarView from './CalendarView.jsx';
import CalendarToolbar from './CalendarToolbar.jsx';
import CalendarMonthView from './CalendarMonthView.jsx';
import CalendarYearView from './CalendarYearView.jsx';

export default class Calendar extends React.Component {
  static propTypes = {
    value: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
    locale: React.PropTypes.string
  };

  static defaultProps = {
    locale: navigator.language || "zh-cn"
  };

  constructor(props) {
    super(props);
    this._onDateChange = this._onDateChange.bind(this);
    this._onRangeChange = this._onRangeChange.bind(this);
  }

  state = {
  	currentDate : this.props.value || new Date(),
  	viewMode: "date"
  };

  _onDateChange(selectedDate){
  	this.props.onChange(selectedDate);
  }

  _onRangeChange(currentDate, viewMode){
  	currentDate = currentDate || this.state.currentDate;
  	viewMode = viewMode || this.state.viewMode;
  	this.setState({currentDate, viewMode});
  }

  _renderCalendarView(){
  	if (this.state.viewMode === "date"){
  		return (
  			<CalendarView 
        locale={this.props.locale} 
  			currentDate={this.state.currentDate} 
  			selectedDate={this.props.value} 
  			onChange={this._onDateChange} />
  		);
  	}else if (this.state.viewMode === "month"){
  		return (
  			<CalendarMonthView 
        locale={this.props.locale} 
        onChange={this._onRangeChange} 
        currentDate={this.state.currentDate}  />
  		);
  	}else if (this.state.viewMode === "year"){
  		return (
  			<CalendarYearView 
  			onChange={this._onRangeChange} 
  			currentDate={this.state.currentDate} />
  		);
  	}
  	return null;
  }

  render() {
    return (
      <div className="calendar">
      	<CalendarToolbar 
        displayActionButton={this.state.viewMode === "date"} 
        currentDate={this.state.currentDate} 
        onChange={this._onRangeChange}
        locale={this.props.locale}  ></CalendarToolbar>
      	{this._renderCalendarView()}
      </div>
    );
  }
}
