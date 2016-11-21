'use strict';
import React, {Component} from 'react';
import classNames from 'classnames';
import TagSelectAction from '../../actions/KPI/TagSelectAction.jsx';
import TagSelectStore from '../../stores/KPI/TagSelectStore.jsx';
import Dialog from '../../controls/NewDialog.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import Tree from '../../controls/tree/Tree.jsx';

export default class TagSelect extends Component {

	static propTypes = {
		hierarchyId:React.PropTypes.number,
		hierarchyName:React.PropTypes.String,
		onSave:React.PropTypes.object,
		onCancel:React.PropTypes.object,
	};

	static contextTypes = {
		router: React.PropTypes.object,
		currentRoute: React.PropTypes.object,
	};

	constructor(props) {
		super(props);
		this._onChange = this._onChange.bind(this);
		this._onSelectDimension = this._onSelectDimension.bind(this);
	}

  state = {
		dimensions:null,
		selectedDimension:null,
		tags:null,
		selectedTag:null
  };

	_onChange(){
		this.setState({
			dimensions:TagSelectStore.getDimensions()
		})
	}

	_onSave(){}

	_onSelectDimension(node){
		this.setState({
			selectedDimension:node,
			tags:null,
			selectedTag:null
		},()=>{

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
			disabled={this.state.selectedTagId!==null}
			/>,
			<FlatButton
			label={I18N.Common.Button.Cancel2}
			onTouchTap={this.props.onCancel}
			/>
		];
		let  dialogProps = {
		        ref: 'dialog',
		        title: I18N.Setting.KPI.Tag.Title,
		        actions: actions,
		        modal: true,
		        open: true,
		        // onDismiss: ()=>{
		        //   this._dismiss();
		        //   this.props.onDismiss()},
		        // titleStyle: titleStyle
		      };
		return(
			<Dialog {...dialogProps}>
				<div className='jazz-kpi-tag'>
					{this.state.dimensions && this._renderDimensions()}
				</div>
			</Dialog>
		)
	}


}
