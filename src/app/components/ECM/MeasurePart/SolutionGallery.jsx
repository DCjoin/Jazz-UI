import React, { Component, PropTypes } from 'react';
import Dialog from 'controls/NewDialog.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import {Gallery} from 'components/DataAnalysis/Basic/GenerateSolution.jsx';

export default class SolutionGallery extends Component {
	constructor(props) {
		super(props);
		this._setIdx = this._setIdx.bind(this);
		this._renderChart = this._renderChart.bind(this);
		this._onDelete = this._onDelete.bind(this);
		this.state = {
			idx: 0,
			showDelete: false,
		}
	}
	_setIdx(idx) {
		if(idx < 0) {
			idx = 0;
		}
		if(idx >= this._getImages().length) {
			idx = this._getImages().length - 1;
		}
		return () => {
			this.setState({idx});
		};
	}
	_getImages() {
		return this.props.measure.getIn(['EnergyProblem', 'EnergyProblemImages']).toJS();
	}
	_onDelete() {
		let onDelete = this.props.onDelete;
		if( onDelete && typeof onDelete === 'function' ) {
			onDelete(this.state.idx);
		}
		let idx = this.state.idx;
		if( idx >= this._getImages().length - 1 ) {
			idx = idx - 1;
		}
		this.setState({
			idx,
			showDelete: false
		});
	}
	_renderChart() {
		return (<img src={this._getImages()[this.state.idx].ImageUrl}/>);
	}
	_renderDeleteDialog() {
		let {showDelete, idx} = this.state;
		return (<Dialog open={showDelete} actions={[
					(<FlatButton label={I18N.Common.Button.Delete} onClick={this._onDelete} primary={true}/>),
					(<FlatButton label={I18N.Common.Button.Cancel2} onClick={()=>{this.setState({showDelete: false})}}/>)
				]}>
				{I18N.Setting.DataAnalysis.SaveScheme.DeleteChart.replace(/{\w*}/, this._getImages()[idx].Name)}
			</Dialog>);
	}
	render() {
		return (
			<div style={{margin: '10px 0'}}>
				<Gallery 
					names={this._getImages().map(image => image.Name)}
					selectedIdx={this.state.idx}
					onLeft={this._setIdx(this.state.idx - 1)}
					onRight={this._setIdx(this.state.idx + 1)}
					onDelete={() => {
						this.setState({
							showDelete: true
						});
					}}
					renderContent={this._renderChart}/>
				{this._renderDeleteDialog()}
			</div>
		);
	}
}

SolutionGallery.propTypes = {
	measure: PropTypes.object.isRequired,
	onDelete: PropTypes.func.isRequired,
}