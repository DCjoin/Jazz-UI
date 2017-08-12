import React, { Component } from 'react';

import FontIcon from 'material-ui/FontIcon';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import NewDialog from 'controls/NewDialog.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';

// import ListStore from 'stores/save_effect/ListStore.jsx';

const getEnergySystem = () => [
    {label:I18N.Setting.Effect.AirConditioning,value:10},
    {label:I18N.Setting.Effect.Power,value:20},
    {label:I18N.Setting.Effect.Lighting,value:30},
    {label:I18N.Setting.Effect.Product,value:40},
    {label:I18N.Setting.Effect.AirCompressor,value:50},
    {label:I18N.Setting.Effect.Heating,value:60},
    {label:I18N.Setting.Effect.Water,value:70},
    {label:I18N.Setting.Effect.Other,value:200},
];

export default class PreCreate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			val: null
		}
	}
	render() {
		let {onClose, onSubmit, isEdit} = this.props;
		return (
			<NewDialog actionsContainerStyle={{textAlign: 'right', margin: '15px 24px'}} actions={[

				<NewFlatButton label={isEdit?'完成':'开始配置'} primary disabled={!this.state.val} onClick={() => {
					onSubmit(this.state.val);
				}}/>
				]} open={true}>
				<header className='jazz-pre-create-header'>
					<div>
						<span>{'选择方案所属能源系统'}</span>
						<span className='jazz-pre-create-header-mark'>{'(以便汇总统计能源系统的节能量)'}</span>
					</div>
					<FontIcon style={{fontSize: '16px'}} className={'icon-close'} onClose={onClose}/>
				</header>
				<RadioButtonGroup className='jazz-pre-create-content' onChange={(e, v) => {
					this.setState({
						val: v
					});
				}}>
					{getEnergySystem().map(sys => 
					<RadioButton style={{marginBottom: 15}} label={sys.label} value={sys.value}/>)}
				</RadioButtonGroup>
			</NewDialog>
		);
	}
}