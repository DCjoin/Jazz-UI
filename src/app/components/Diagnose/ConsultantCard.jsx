import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';

export default function ConsultantCard({
	UserPhoto,
	RealName,
	Telephone,
	Email,
	HierarchyName,
}) {
	return (
		<div style={{zIndex: 1}}>
			<input type='checkbox' id='cardCheckbox' name='cardCheckbox' className='card-checkbox'/>
			<label className='card-overlay' htmlFor='cardCheckbox'/>
			<div className='consultant-card-widgets'>
			<label htmlFor='cardCheckbox' className='card-icon'>
				<FontIcon className='icon-user' style={{color: '#fff'}}/>
			</label>
			<div className='card-info'>
				<img className='card-info-photo' src={UserPhoto}/>
				<div style={{fontSize: 14}}>
					<div className='card-info-title'>
						<span className='card-info-name'>{RealName}</span>
						<span>{'资深咨询顾问'}</span>
					</div>
					<div className='card-info-desc'>{`“您好， 我是${HierarchyName}的专职节能咨询顾问，有任何问题欢迎通过以下方式和我联系”`}</div>
					<div>
						<FontIcon className='icon-customer' style={{fontSize: 14, marginRight: 5}}/>
						{Telephone}
					</div>
					<div>
						<FontIcon className='icon-language' style={{fontSize: 14, marginRight: 5}}/>
						<a className='card-info-email' href={'mailto: ' + Email}>{Email}</a>
					</div>
				</div>
			</div>
		</div>
	</div>)
}
