import React, { Component, PropTypes } from 'react';
import TagList from './TagList.jsx';
import InputDataStore from 'stores/DataAnalysis/InputDataStore.jsx';
import RoutePath from 'util/RoutePath.jsx';
import util from 'util/Util.jsx';

export default class InputDataPanel extends Component {

	static contextTypes = {
		hierarchyId: PropTypes.string
	};

	constructor(props) {
		super(props);
		this._onChange = this._onChange.bind(this);
		this._onSelectedTagChange = this._onSelectedTagChange.bind(this);
	}

	state={
		selectedTag:InputDataStore.getTagList()===null?null:InputDataStore.getTagList().getIn([0])
	}

	_onChange(){
		if(this.state.selectedTag===null){
			this.setState({
				selectedTag:InputDataStore.getTagList().getIn([0])
			})
		}
	}

	_onSelectedTagChange(tag){
		this.setState({
			selectedTag:tag
		})
	}

	componentDidMount(){
		InputDataStore.addChangeListener(this._onChange);

	}

	componentWillReceiveProps(nextProps, nextContext) {
		if( !util.shallowEqual(nextContext.hierarchyId, this.context.hierarchyId) ) {
			this.setState({
			selectedNode:null
			});
			if( this.context.hierarchyId ) {
				nextProps.router.push(RoutePath.inputData(nextProps.params));
			}
		}
	}

	componentWillUnmount(){
		InputDataStore.removeChangeListener(this._onChange);
	}

  render(){
    return(
      <div style={{display: 'flex', flex: 1,backgroundColor:'#f3f5f7'}}>
				<TagList customerId={this.props.params.customerId}
								 selectedTag={this.state.selectedTag}
								 hierarchyId={this.context.hierarchyId}
								 onSelectedTagChange={this._onSelectedTagChange}/>
			</div>
    )
  }
}
