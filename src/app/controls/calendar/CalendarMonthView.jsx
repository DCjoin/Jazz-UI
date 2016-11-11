import React from "react";
import classnames from 'classnames';
import CalendarI18N from './CalendarI18N.jsx';

const CalendarMonthView = ({currentDate, onChange, locale})=>{
	var i18 = CalendarI18N(locale);
	var onSelectMonth = (month)=>{
		var date = new Date(currentDate);
		date.setMonth(month);
		onChange(date,"date");
	};

	var monthList = [];
	var selectedMonth = currentDate.getMonth();
	for (var i=0;i<12;i++){
		var clazz = classnames({
			"month-item":true,
			"selected": i===selectedMonth
		});
		monthList.push(
			<div className={clazz} key={i+1} onClick={onSelectMonth.bind(this,i)}>{i18["shortMonthList"][i]}</div>
		);
	}
	return (<div className="calendar-month-view">{monthList}</div>);
}

export default CalendarMonthView;