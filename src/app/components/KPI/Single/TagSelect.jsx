'use strict';
import React, {Component} from 'react';
import classNames from 'classnames';
import TagSelectAction from 'actions/KPI/TagSelectAction.jsx';
import TagSelectStore from 'stores/KPI/TagSelectStore.jsx';
import Dialog from 'controls/NewDialog.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';
import Tree from 'controls/tree/Tree.jsx';
import CommonFuns from 'util/Util.jsx';

export default class TagSelect extends Component {

	static propTypes = {
		hierarchyId:React.PropTypes.number,
		hierarchyName:React.PropTypes.String,
		onSave:React.PropTypes.func,
		onCancel:React.PropTypes.func,
		tag:React.PropTypes.object,
		title:React.PropTypes.String,
		filterTagIds:React.PropTypes.array,
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
			tags:TagSelectStore.getTags(),
			selectedDimension:this.state.selectedDimension?this.state.selectedDimension:TagSelectStore.getSelectedTreeNode()
		})
	}

	_getTags(id){
		if(!this.props.tag){
			TagSelectAction.getTags(!!this.props.allTag, this.props.hierarchyId,id,this.context.router.params.customerId)
		}
		else {
			TagSelectAction.getTags(!!this.props.allTag, this.props.hierarchyId,id,this.context.router.params.customerId,
				this.props.tag.get('CommodityId'),this.props.tag.get("UomId"))
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
			<table className="jazz-kpi-tag-tags-header" style={{borderSpacing:'0px'}}>
				<tbody>
					<tr>
						<td className="column1">{I18N.Common.Glossary.Name}</td>
						<td className="column2" style={{display:'inline-block'}}>{I18N.Common.Glossary.Commodity}</td>
						<td className="column3" style={{display:'inline-block'}}>{I18N.Common.Glossary.UOM}</td>
					</tr>
				</tbody>
			</table>
		);
		let tags = this.state.tags,
		filterTagIds = this.props.filterTagIds;
		if( tags && filterTagIds ) {
			tags = tags.filter(tag => filterTagIds.indexOf(tag.get('Id')) === -1);
		}
		var content=(tags===null)?<div className="flex-center">{I18N.Setting.KPI.Tag.NoTags}</div>
																				: <table className='jazz-kpi-tag-tags-body'>
																						<tbody style={{height:'320px'}}>
																							{
																								tags.map(tag=>{
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

	componentDidMount(){
		TagSelectStore.addChangeListener(this._onChange);
		if(this.props.tag && this.props.tag.get("Id")){
			TagSelectAction.getTagInfo(this.props.tag.get("Id"),(id)=>{
				this._getTags(id);
			});
			
		}
		TagSelectAction.getDimension(this.props.hierarchyId,this.props.hierarchyName);
	}

	componentWillUnmount() {
		TagSelectStore.removeChangeListener(this._onChange);
	}

	render(){
		let actions = [
			<NewFlatButton style={{marginLeft: 24,float:'right'}} secondary label={I18N.Common.Button.Cancel2} onClick={this.props.onCancel}/>,
			<NewFlatButton primary label={I18N.Common.Button.Select} disabled={this.state.selectedTag===null} onClick={this._onSave} style={{float:'right'}}/>	
		];
		let  dialogProps = {
		        ref: 'tag_dialog',
		        title: this.props.title?this.props.title:I18N.Setting.KPI.Tag.Title,
		        actions: actions,
		        modal: true,
		        open: true,
						wrapperStyle:{
							width:'852px',
							maxWidth:'852px'
						},
						actionsContainerStyle:{
							margin:'24px'
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
