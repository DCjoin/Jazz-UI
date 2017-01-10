import React, { Component } from 'react';
import classnames from 'classnames';

import LinkButton from 'controls/LinkButton.jsx';

export default function SwitchBar(props) {
	let {onLeft, onRight, label, className} = props;
	return (
		<div className={classnames('switch-action-bar', {[className]: className})}>
			<LinkButton iconName={ "icon-arrow-left" } disabled={ !onLeft } onClick={onLeft}/>
			<span className='current-label'>{label}</span>
			<LinkButton iconName={ "icon-arrow-right" } disabled={ !onRight } onClick={onRight}/>
		</div>
	);
}