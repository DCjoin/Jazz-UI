import React, { Component, PropTypes } from 'react';

import find from 'lodash-es/find';

import { RadioButton } from 'material-ui/RadioButton';

import HierarchyStore from 'stores/HierarchyStore.jsx';

import TagSelect from 'components/KPI/Single/TagSelect.jsx';

import LinkButton from 'controls/LinkButton.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';

function TagItem({tag, selectedId, onClick, onDelete}) {
	if( tag.get('Configed') ) {
		return (<div className='tag-configed'>
			<span>{tag.get('Name')}</span>
			<span style={{marginLeft: 14}}>{I18N.SaveEffect.Configed}</span>
		</div>)
	}
	return (
		<div style={{display: 'flex', marginBottom: 5}}>
			<RadioButton 
				checked={selectedId === tag.get('Id')}
				style={{display: 'inline-block', width: 'auto', fontSize: '14px'}} 
				labelStyle={{color: '#434343'}}
				label={tag.get('Name')} 
				onClick={() => {
					onClick(tag.get('Id'));
				}}
			/>
			{tag.get('isNew') && 
			<a href='javascript:void(0)' style={{
					color: '#32ad3d', 
					marginLeft: 14,
					fontSize: '14px',
					lineHeight: '24px',
				}} 
				onClick={() => {
					onDelete(tag.get('Id'));
				}}
			>{I18N.Common.Button.Delete}</a>}
		</div>
	)
}

export default class Step1 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showSeleteTagDlg: false
		};
		this._onOpenSeleteTagDlg = this._onOpenSeleteTagDlg.bind(this);
		this._onCloseSeleteTagDlg = this._onCloseSeleteTagDlg.bind(this);
	}
	static contextTypes = {
		hierarchyId: PropTypes.string
	};
	_onOpenSeleteTagDlg() {
		this.setState((state, props) => {return {showSeleteTagDlg: true}});
	}
	_onCloseSeleteTagDlg() {
		this.setState((state, props) => {return {showSeleteTagDlg: false}});
	}
	render() {
		let { tags, selectedId, onClickItem, onDeleteItem, onAddItem } = this.props;
		return (
			<div className='create-block'>
				<header className='step1-header'>
					<span>{I18N.EM.Report.SelectTag}</span>
					<NewFlatButton 
						style={{marginLeft: 10, height: 30, lineHeight: 'normal'}} secondary 
						label={I18N.SaveEffect.AddTag}
						onClick={this._onOpenSeleteTagDlg}/>
				</header>
				<div className='step1-content'>
					{tags.map( tag => 
					<TagItem 
						key={tag.get('Id')} 
						tag={tag} 
						selectedId={selectedId}
						onClick={onClickItem}
						onDelete={onDeleteItem}
					/>)}
				</div>
				{this.state.showSeleteTagDlg && 
				<TagSelect
					hierarchyId={this.context.hierarchyId * 1}
					hierarchyName={
						find(HierarchyStore.getBuildingList(), hier => hier.Id === this.context.hierarchyId * 1).Name}
					onCancel={this._onCloseSeleteTagDlg}
					onSave={(selectedTag) =>{
						onAddItem(selectedTag);
						this._onCloseSeleteTagDlg();
					}}
				/>}
			</div>
		);
	}
}
