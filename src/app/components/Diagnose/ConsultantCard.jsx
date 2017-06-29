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
		<div style={{zIndex: 2}}>
			<input type='checkbox' id='cardCheckbox' name='cardCheckbox' className='card-checkbox'/>
			<label className='card-overlay' htmlFor='cardCheckbox'/>
			<div className='consultant-card-widgets'>
				<label htmlFor='cardCheckbox' className='card-icon'/>
				<div className='card-info'>
					<img className='card-info-photo' src={UserPhoto}/>
					<div style={{fontSize: 14}}>
						<div className='card-info-title'>
							<div className='card-info-name'>{RealName}</div>
							<div>{I18N.Consultant.SeniorConsultant}</div>
						</div>
						<div className='card-info-desc'>
							<div>{I18N.format(I18N.Consultant.Description1, HierarchyName)}</div>
							<div>{I18N.Consultant.Description2}</div>
						</div>
						<div>
							<FontIcon className='icon-phone' style={{fontSize: 14, margin: '0 2px'}}/>
							{Telephone}
						</div>
						<div>
							<FontIcon className='icon-email' style={{fontSize: 14, marginRight: 4}}/>
							<a className='card-info-email' href={'mailto: ' + Email}>{Email}</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
