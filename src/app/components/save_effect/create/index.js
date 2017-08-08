import React, { Component, PropTypes } from 'react';

import Immutable from 'immutable';

import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import SvgIcon from 'material-ui/SvgIcon';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';

import ReduxDecorator from 'decorator/ReduxDecorator.jsx';

import Step1 from './step1.jsx';
import Step2 from './step2.jsx';

import {getTagsByPlan, updateTags} from 'actions/save_effect_action';

import CreateStore from 'stores/save_effect/create_store';

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

@ReduxDecorator
export default class Create extends Component {
	static calculateState = (state, props, ctx) => {
		return {
			tags: CreateStore.getTagsByPlan()
		}
	};
	static getStores = () => [CreateStore];
	constructor(props) {
		super(props);

		getTagsByPlan(this.props.id);

		this.state = {
			selectedId: null,
			step: 1,
		}
	}
	_isReady() {
		return !!this.state.tags;
	}
	renderContent() {
		let { selectedId, step, tags } = this.state;
		switch(step) {
			case 0:
				return (<Step1
					tags={tags}
					selectedId={selectedId}
					onClickItem={(selectedId) => {
						this.setState((state, props) => {
							return {
								selectedId
							}
						});
					}}
					onDeleteItem={idx => updateTags(this.state.tags.delete(idx))}
					onAddItem={ tag => updateTags(this.state.tags.push(tag))}
				/>);
			case 1:
				return (<Step2
				/>);

		}
	}
	render() {
		if( !this._isReady() ) {
			return (<div className='jazz-save-effect-create flex-center'>
				<CircularProgress  mode="indeterminate" size={80} />
			</div>);
		}
		let {name, id, date} = this.props;
		return (
			<div className='jazz-save-effect-create'>
				<Header name={name} timeStr={date.format('YYYY-MM-DD HH:mm')}/>
				<Nav step={this.state.step}/>
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
