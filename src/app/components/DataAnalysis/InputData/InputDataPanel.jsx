import React, { Component, PropTypes } from 'react';
import TagList from './TagList.jsx';
import InputDataStore from 'stores/DataAnalysis/InputDataStore.jsx';
import RoutePath from 'util/RoutePath.jsx';
import util from 'util/Util.jsx';
import InputDataAction from '../../../actions/DataAnalysis/InputDataAction.jsx';

function getNodeId(props) {
	return +props.params.nodeId;
}

export default class InputDataPanel extends Component {

	static contextTypes = {
		hierarchyId: PropTypes.string
	};

	constructor(props) {
		super(props);
		this._onChange = this._onChange.bind(this);
		this._onSelectedTagChange = this._onSelectedTagChange.bind(this);
		this._onTagChange = this._onTagChange.bind(this);
	}

	state={
		selectedTag:InputDataStore.getTagList()===null?null:InputDataStore.getTagList().getIn([0]),
		preSelectedTag:null
	}

	_changeNodeId(nodeId) {
		if( nodeId !== getNodeId(this.props) ) {
			this.props.router.push(RoutePath.inputData(this.props.params) + '/' + nodeId);
		}
	}

	_onChange(){
		if(this.state.selectedTag===null){
			let tag=InputDataStore.getTagList().getIn([0]);
			if(tag){
				this._changeNodeId(tag.get('Id'))
				this.setState({
					selectedTag:tag
				})
			}
		}
	}

	_onTagChange(){
		this._changeNodeId(this.state.preSelectedTag.get('Id'));
		this.setState({
			selectedTag:this.state.preSelectedTag,
			preSelectedTag:null
		})
	}

	_onSelectedTagChange(tag){
		this.setState({
			preSelectedTag:tag
		},()=>{
			InputDataAction.ifLeave();
		})
	}

	_renderContent(){
		var {selectedTag}=this.state;
		if(selectedTag===null) return null

		return React.cloneElement(this.props.children, {
          	selectedTag,
            hierarchyId: this.context.hierarchyId,
          });
	}

	componentWillMount(){
		if(this.state.selectedTag!==null){
			this._changeNodeId(this.state.selectedTag.get('Id'))
		}else {
			InputDataAction.getTags(this.props.params.customerId,this.context.hierarchyId,1);
		}
	}

	componentDidMount(){
		InputDataStore.addChangeListener(this._onChange);
		InputDataStore.addSelectedTagChangeListener(this._onTagChange);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if( !util.shallowEqual(nextContext.hierarchyId, this.context.hierarchyId) ) {
			this.setState({
			selectedTag:null
		});
			if(this.context.hierarchyId ) {
				nextProps.router.push(RoutePath.inputData(nextProps.params));
			}
		}
	}

	componentWillUnmount(){
		InputDataStore.removeChangeListener(this._onChange);
		InputDataStore.removeSelectedTagChangeListener(this._onTagChange);
	}

  render(){
    return(
      <div style={{display: 'flex', flex: 1,backgroundColor:'#f3f5f7'}}>
				<TagList customerId={this.props.params.customerId}
								 selectedTag={this.state.selectedTag}
								 hierarchyId={this.context.hierarchyId}
								 onSelectedTagChange={this._onSelectedTagChange}/>
				{this._renderContent()}
			</div>
    )
  }
}
