import React, { Component } from 'react';
import classnames from 'classnames';

import LinkButton from 'controls/LinkButton.jsx';

export default function SwitchBar(props) {
	let {onLeft, onRight, label, className, iconStyle} = props;
	return (
		<div className={classnames('switch-action-bar', {[className]: className})}>
			<LinkButton iconName={ "icon-arrow-left" } labelStyle={iconStyle} disabled={ !onLeft } onClick={onLeft}/>
			<span className='current-label'>{label}</span>
			<LinkButton iconName={ "icon-arrow-right" } labelStyle={iconStyle} disabled={ !onRight } onClick={onRight}/>
		</div>
	);
}