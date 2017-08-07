import React, { Component, PropTypes } from 'react';

import Immutable from 'immutable';

import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import SvgIcon from 'material-ui/SvgIcon';
import IconButton from 'material-ui/IconButton';

import Step1 from './step1.jsx';

import {getTagsByPlan} from 'actions/save_effect_action';

function stepLabelProps(stepValue, currentStep) {
	let props = {
		style: {
			height: 50,
			fontSize: 14,
			color: '#0f0f0f',
		},
	},
	iconColor = '#32ad3d';
	if( currentStep < stepValue ) {
		props.style.color = '#9fa0a4';
		iconColor = '#a3e7b0';
	}
	props.icon = (
		<SvgIcon color={iconColor} style={{
		      display: 'block',
		      fontSize: 24,
		      width: 24,
		      height: 24,
		      color: iconColor,
		  }}>
		<circle cx={12} cy={12} r={10}/>
		<text x={12} y={17} fill='#ffffff' fontSize='12px' textAnchor='middle'>{stepValue + 1}</text>
	</SvgIcon>);
	return props;
}

function Header({name, timeStr, onShowDetail, onClose}) {
	return (	
		<header style={{marginLeft: 30,marginTop: 20, marginBottom: 10}}>
			<div>
				<div>{I18N.SaveEffect.CreateTitle + ' ' + name}</div>
				<div style={{marginTop: 10}}>
					{I18N.SaveEffect.Runtime + ': ' + timeStr}
					<a style={{marginLeft: 30, color: '#32ad3d'}} href='javascript:void(0)'>{I18N.SaveEffect.ShowSavePlanDetail}</a>
				</div>
			</div>
			<IconButton style={{position: 'fixed', right: 14, top: 14}} iconClassName='icon-close' onClick={onClose}/>
		</header>
	);
}

function Nav({step}) {
	return (
		<nav className='create-block'>
	        <Stepper activeStep={step}>
	          <Step>
	            <StepLabel {...stepLabelProps(0, step)}>{I18N.SaveEffect.Step1}</StepLabel>
	          </Step>
	          <Step>
	            <StepLabel {...stepLabelProps(1, step)}>{I18N.SaveEffect.Step2}</StepLabel>
	          </Step>
	          <Step>
	            <StepLabel {...stepLabelProps(2, step)}>{I18N.SaveEffect.Step3}</StepLabel>
	          </Step>
	          <Step>
	            <StepLabel {...stepLabelProps(3, step)}>{I18N.SaveEffect.Step4}</StepLabel>
	          </Step>
	        </Stepper>
	    </nav>
	);
}


export default class Create extends Component {
	constructor(props) {
		super(props);
		getTagsByPlan(this.props.id);
	}
	renderContent() {
		return (<Step1
			tags={Immutable.fromJS([
				{Id: 1, Name: 'tag1', Configed: false, isNew: false},
				{Id: 2, Name: 'tag2', Configed: true, isNew: false},
				{Id: 3, Name: 'tag3', Configed: true, isNew: false},
				{Id: 4, Name: 'tag4', Configed: false, isNew: true},
				{Id: 5, Name: 'tag5', Configed: false, isNew: true},
			])}
			selectedId={5}
			onClickItem={(id) => {
				console.log('click: ' + id);
			}}
			onDeleteItem={(id) => {
				console.log('delete: ' + id);
			}}
			onAddItem={(tag) => {

			}}
		/>);
	}
	render() {
		let {name, id, date} = this.props
		return (
			<div className='jazz-save-effect-create'>
				<Header name={name} timeStr={date.format('YYYY-MM-DD HH:mm')}/>
				<Nav step={0}/>
				{this.renderContent()}
			</div>
		);
	}
}
Create.PropTypes = {
	id: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	date: PropTypes.object.isRequired, //moment
};
