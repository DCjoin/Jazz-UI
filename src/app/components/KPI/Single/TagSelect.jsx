'use strict';
import React, {Component} from 'react';
import classNames from 'classnames';
import TagSelectAction from 'actions/KPI/TagSelectAction.jsx';
import TagSelectStore from 'stores/KPI/TagSelectStore.jsx';
import Dialog from 'controls/NewDialog.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import Tree from 'controls/tree/Tree.jsx';
import CommonFuns from 'util/Util.jsx';

export default class TagSelect extends Component {

	static propTypes = {
		hierarchyId:React.PropTypes.number,
		hierarchyName:React.PropTypes.String,
		onSave:React.PropTypes.func,
		onCancel:React.PropTypes.func,
		tag:React.PropTypes.object,
	};

	static contextTypes = {
		router: React.PropTypes.object,
	};

	constructor(props) {
		super(props);
		this._onChange = this._onChange.bind(this);
		this._onSelectDimension = this._onSelectDimension.bind(this);
		this._onSelectTag = this._onSelectTag.bind(this);
		this._onSave = this._onSave.bind(this);
	}

  state = {
		dimensions:null,
		selectedDimension:null,
		tags:null,
		selectedTag:null
  };

	_onChange(){
		this.setState({
			dimensions:TagSelectStore.getDimensions(),
			tags:TagSelectStore.getTags()
		})
	}

	_getTags(id){
		if(!this.props.tag){
			TagSelectAction.getTags(this.props.hierarchyId,id,this.context.router.params.customerId)
		}
		else {
			TagSelectAction.getTags(this.props.hierarchyId,id,this.context.router.params.customerId,
				this.props.tag.get('CommodityId'),this.props.tag.get('UomId'))
		}

	}

	_onSave(){
		this.props.onSave(this.state.selectedTag);
	}

	_onSelectDimension(node){
		this.setState({
			selectedDimension:node,
			tags:[],
			selectedTag:null
		},()=>{
			this._getTags(node.get('Id'))
		})
		}

	_onSelectTag(tag){
		this.setState({
			selectedTag:tag
		})
	}

	_renderDimensions(){
		let treeProps={
			key: 'tagtree',
			collapsedLevel: 0,
			allNode: this.state.dimensions,
			allHasCheckBox: false,
			allDisabled: false,
			onSelectNode: this._onSelectDimension,
			selectedNode: this.state.selectedDimension,
			treeNodeClass: 'jazz-copy-tree'
		}
		return(
			<div className='jazz-kpi-tag-dimension'>
				<Tree {...treeProps}/>
			</div>
		)
	}

	_renderTags(){
		var header=(
			<table className="jazz-kpi-tag-tags-header">
				<tbody>
					<tr>
						<td className="column1">{I18N.Common.Glossary.Name}</td>
						<td className="column2">{I18N.Common.Glossary.Commodity}</td>
						<td className="column3">{I18N.Common.Glossary.UOM}</td>
					</tr>
				</tbody>
			</table>
		);
		var content=(this.state.tags===null)?<div className="flex-center">{I18N.Setting.KPI.Tag.NoTags}</div>
																				: <table className='jazz-kpi-tag-tags-body'>
																						<tbody>
																							{
																								this.state.tags.map(tag=>{
																									return(
																										<tr className={classNames({
		        																		'selected': this.state.selectedTag && tag.get('Id')===this.state.selectedTag.get('Id'),
		      															})} onClick={this._onSelectTag.bind(this,tag)}>
																				<td className="column1">{tag.get('Name')}</td>
																				<td className="column2">{CommonFuns.getCommodityById(tag.get('CommodityId')).Comment}</td>
																				<td className="column3">{CommonFuns.getUomById(tag.get('UomId')).Code}</td>
																			</tr>
																		)
																	})
																}
															</tbody>
														</table>

		return(
			<div className='jazz-kpi-tag-tags'>
				{header}
				{content}
			</div>
		)
	}

	componentWillMount(){
		TagSelectAction.getDimension(this.props.hierarchyId,this.props.hierarchyName);
	}

	componentDidMount(){
		TagSelectStore.addChangeListener(this._onChange);
	}

	componentWillUnmount() {
		TagSelectStore.removeChangeListener(this._onChange);
	}

	render(){
		let actions = [
			<FlatButton
			label={I18N.Common.Button.Save}
			onTouchTap={this._onSave}
			disabled={this.state.selectedTag===null}
			/>,
			<FlatButton
			label={I18N.Common.Button.Cancel2}
			onTouchTap={this.props.onCancel}
			/>
		];
		let  dialogProps = {
		        ref: 'tag_dialog',
		        title: I18N.Setting.KPI.Tag.Title,
		        actions: actions,
		        modal: true,
		        open: true,
						wrapperStyle:{
							width:'852px',
							maxWidth:'852px'
						}
		      };
		return(
			<Dialog {...dialogProps}>
				<div className='jazz-kpi-tag'>
					{this.state.dimensions && this._renderDimensions()}
					{this.state.dimensions && this._renderTags()}
				</div>
			</Dialog>
		)
	}


}
