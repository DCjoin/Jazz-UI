import React, { Component } from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';

import LinkButton from 'controls/LinkButton.jsx';

const SEPARTOR = '-';

function Left(props) {
	return (<div style={{float: 'left', marginTop: 5}}>{props.children}</div>);
}
function Right(props) {
	return (<div style={{float: 'right'}}>{props.children}</div>);
}
function PrevButton(props) {
	return (<LinkButton {...props} label={'<上一步'}/>);
}
function NextButton(props) {
	return (<RaisedButton {...props} label={'下一步'}  primary={true}/>);
}

export default class CreateDiagnose extends Component {
	constructor(props) {
		super(props);
		this._onSaveBack = this._onSaveBack.bind(this);
		this._onSaveRenew = this._onSaveRenew.bind(this);
		this.state = {step: 0};
	}
	_setStep(step) {
		return () => {
			this.setState({step});
		}
	}
	_onSaveBack() {
		
	}
	_onSaveRenew() {
		this._setStep(0)();
	}
	_renderContent() {
		return null;
	}
	_getFooterButton() {
		let {step} = this.state,
		buttons = [];
		switch (step) {
			case 0:
				buttons.push(<Right><NextButton onClick={this._setStep(1)}/></Right>);
				break;
			case 1:
				buttons.push(<Left><PrevButton onClick={this._setStep(0)}/></Left>);
				buttons.push(<Right><NextButton onClick={this._setStep(2)}/></Right>);
				break;
			case 2:
				buttons.push(<Left><PrevButton onClick={this._setStep(1)}/></Left>);
				buttons.push(
					<Right>
						<RaisedButton onClick={this._onSaveBack} label={'保存并返回诊断列表'}/>
						<RaisedButton onClick={this._onSaveRenew} label={'保存并继续添加'} style={{marginLeft: 10}} primary={true}/>
					</Right>
				);
				break;
		}
		return buttons;
	}
	render() {
		let {step} = this.state;
		return (
			<div className='diagonse-overlay'>
				<header className='diagonse-overlay-header'>
					<div>
						<span>{'新建诊断'}</span>
						<span>
							{['基本', '室内环境异常', '公区温度'].join(SEPARTOR)}
						</span>
					</div>
					<IconButton iconClassName='icon-close' />
				</header>
				<nav className='diagonse-create-stepper'>
			        <Stepper activeStep={step}>
			          <Step>
			            <StepLabel style={{height: 60}}>{'选择诊断数据点并配置诊断范围'}</StepLabel>
			          </Step>
			          <Step>
			            <StepLabel style={{height: 60}}>{'编辑诊断条件'}</StepLabel>
			          </Step>
			          <Step>
			            <StepLabel style={{height: 60}}>{'保存诊断'}</StepLabel>
			          </Step>
			        </Stepper>
		        </nav>
		        {this._renderContent()}
		        <nav className='diagonse-create-footer'>{this._getFooter()}</nav>
			</div>
		);
	}
}

