import React from "react";
import classnames from 'classnames';
import ReactDOM from 'react-dom';

export default class CalendarYearView extends React.Component {
  static propTypes = {
    currentDate: React.PropTypes.object,
    onChange: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this._onSelectYear = this._onSelectYear.bind(this);
  }

  _onSelectYear(year){
  	var date = new Date(this.props.currentDate);
	date.setFullYear(year);
	this.props.onChange(date,"date");
  }

  componentDidMount() {
  	var selectedYear = this.props.currentDate.getFullYear();
  	var yearNode = ReactDOM.findDOMNode(this.refs["year_"+selectedYear]);
	// debugger
	if (yearNode){
		var box = this.refs.year_box;
		box.scrollTop = yearNode.offsetTop - box.offsetHeight/2 + yearNode.offsetHeight/2
	}
  }

  render() {
    var yearList = [];
	var selectedYear = this.props.currentDate.getFullYear();
	var now = new Date();
  // different from Pop year:now-10~now
	for (var i=now.getFullYear()-10;i<=now.getFullYear();i++){
		var clazz = classnames({
			"year-item":true,
			"selected": i===selectedYear
		});
		yearList.push(
			<div key={i}  ref={"year_" + i}>
			<div className={clazz}  onClick={this._onSelectYear.bind(this,i)}>{i}</div>
			</div>
		);
	}
	return (<div ref="year_box" className="calendar-year-view">{yearList}</div>);
  }
}
