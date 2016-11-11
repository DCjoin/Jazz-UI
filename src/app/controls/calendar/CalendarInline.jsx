import React from 'react';
import CalendarView from './CalendarView.jsx';
import CalendarInlineToolbar from './CalendarInlineToolbar.jsx';

export default class CalendarInline extends React.Component {
  static propTypes = {
    value: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
    onRangeChange: React.PropTypes.func,
    locale: React.PropTypes.string,
    events: React.PropTypes.array
  };

  static defaultProps = {
    locale: navigator.language || "zh-cn",
    onRangeChange: () => {},
    events: [] // [{date: 1, hasEvents: true}, {date: 2, hasEvents: false}, ...]
  };

  constructor(props) {
    super(props);
    this._onDateChange = this._onDateChange.bind(this);
    this._onRangeChange = this._onRangeChange.bind(this);
  }

  state = {
  	currentDate : this.props.value || new Date(),
  	viewMode: "date",
    events: this.props.events
  };

  _onDateChange(selectedDate){
  	this.props.onChange(selectedDate);
  }

  _onRangeChange(currentDate, viewMode){
  	currentDate = currentDate || this.state.currentDate;
  	viewMode = viewMode || this.state.viewMode;
  	this.setState({currentDate, viewMode, events: []}, () => {
      this.props.onRangeChange(currentDate);
    });
  }

  _renderCalendarView(){
  		return (
  			<CalendarView
        locale={this.props.locale}
  			currentDate={this.state.currentDate}
  			selectedDate={this.props.value}
  			onChange={this._onDateChange}
        events={this.state.events} />
  		);
  }

  componentWillMount() {
    this.setState({
      events: this.props.events
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      events: nextProps.events
    })
  }

  render() {
    return (
      <div className="calendar-inline">
      	<CalendarInlineToolbar
        currentDate={this.state.currentDate}
        onChange={this._onRangeChange}
        onDateChange={this._onDateChange}
        locale={this.props.locale}  />
      	{this._renderCalendarView()}
      </div>
    );
  }
}
