import React from "react";
import classnames from "classnames";
import CalendarI18N from './CalendarI18N.jsx';
import _ from 'lodash';

function daysInMonth(year, month) {
	return new Date(year, month + 1, 0).getDate();
}

function weekday(year, month, dayOfMonth = 1){
	return new Date(year, month, dayOfMonth).getDay();
}

const CalendarView = ({currentDate, selectedDate, onChange, locale, events})=>{
	var days = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
	// map days to [{date: 1, hasEvent: true}, {date: 2, hasEvent: false}, ...]
	days = _.range(days).map((day, idx) => {
		return {date: idx + 1, hasEvent: _.chain(events).filter(function (event) {
			return event.date === idx + 1;
		}).head().get('hasEvent', false).value()}
	});
	var items = [];
	var now = new Date();
	for (let dayOfMonth = 1; dayOfMonth <= days.length; dayOfMonth++){
		var date = new Date();
		date.setFullYear(currentDate.getFullYear(), currentDate.getMonth(), dayOfMonth);

		var selected = (
			selectedDate &&
			date.getFullYear() === selectedDate.getFullYear() &&
			date.getMonth() === selectedDate.getMonth() &&
			date.getDate() === selectedDate.getDate()
		);

		var isToday = (
			date.getFullYear() === now.getFullYear() &&
			date.getMonth() === now.getMonth() &&
			date.getDate() === now.getDate()
		);

		let currDay = _.chain(days).filter(function (day) {
			return day.date === dayOfMonth;
		}).head().value();
		let hasEvent = currDay ? currDay.hasEvent : false;

		items.push(
			<DateItem
			onChange={onChange}
			date={date}
			selected={selected}
			isToday={isToday}
			hasEvent={hasEvent}
			key={date.getFullYear() + "_" + date.getMonth() + "_" + dayOfMonth} />
		);
	}
	var dayListLabel = CalendarI18N(locale)["shortDayList"];
	return (<div className="calendar-view">
				<div className="label-box">
				{
					dayListLabel.map((day,index)=>{
						return (<div key={index} className="label-item">{day}</div>);
					})
				}
				</div>
				<div className="date-box" >{items}</div>
			</div>);
}

const DateItem = ({date, selected, onChange, isToday, hasEvent}) => {
	var dayOfMonth = date.getDate();
	var month = date.getMonth();
	var year = date.getFullYear();
	let firstDayOfWeek=null;
	if (dayOfMonth === 1){
		firstDayOfWeek = weekday(year, month);
	}
	let clazz = classnames({
		"date-item": true,
		["weekday-"+firstDayOfWeek]: (firstDayOfWeek!==null),
		selected,
		"today": isToday
	});
	return (
		<div className={clazz} onClick={()=>{
			onChange(date)
		}} >
			<div className="date-number">{dayOfMonth}</div>
			<div className={classnames({
					"date-event": true,
					"has-event": hasEvent
				})}>.</div>
		</div>);
}

export default CalendarView;
