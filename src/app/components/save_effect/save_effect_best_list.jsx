import React, { Component } from 'react';
import {getBestSolution} from 'actions/save_effect_action.js';
import BestStore from 'stores/save_effect/bestStore.jsx';
import FontIcon from 'material-ui/FontIcon';
import {LessInvest,HighCost,Easy,HighReturn} from './best/icon.jsx';

const characterType={
			"HighCost":1,
			"LessInvest":2,
			"Easy":3,
			"HighReturn":4
}

function Item(solution,onIgnore,onItemClick){
		var isCharacterSelected=(value)=>(solution.getIn(["BestInfo","Characteristics"]).indexOf(value+'')>-1);

		var highCost=isCharacterSelected(characterType.HighCost),
				lessInvest=isCharacterSelected(characterType.LessInvest),
				easy=isCharacterSelected(characterType.Easy),
				highReturn=isCharacterSelected(characterType.HighReturn);

		return(
			<div className="jazz-effect-best-list-item">
				<div className="jazz-effect-best-list-item-info">
					<div className="jazz-effect-best-list-item-info-side">
						<div className="hierarchy">
						<FontIcon className="icon-building" color="#505559" style={{fontSize:'12px',marginRight:'7px'}}/>
						<div className="hierarchy-font">{solution.get("HierarchyName")}</div>
					</div>
					<div className="name">{solution.getIn(["SolutionInfo","EnergySolutionName"])}</div>			
					<div className="reason">{solution.getIn(["BestInfo","RecommendReason"])}</div>			
				</div>
				<div className="jazz-effect-best-list-item-info-operation" 
						 onClick={(e)=>{e.stopPropagation();
													  onIgnore();
														}}>{I18N.ALarm.IgnoreWindow.Ignore}</div>
			</div>
			<div className="jazz-effect-best-list-item-character">
						{lessInvest && <LessInvest/>}
						{highReturn && <HighReturn/>}
						{highCost && <HighCost/>}
						{easy && <Easy/>}
			</div>
					
			</div>
				)

}

export default class SaveEffectBestList extends Component {

	  constructor(props, ctx) {
        super(props)
        this._onChanged = this._onChanged.bind(this);
  	}

		_onChanged(){
			this.setState({
				best:BestStore.getBest()
			})
		}

	  componentDidMount(){
    getBestSolution(this.props.router.params.customerId);
    BestStore.addChangeListener(this._onChanged);
  }

  componentWillUnmount(){
    BestStore.removeChangeListener(this._onChanged);
  }

	render() {
		return (
			<div className="jazz-effect-overlay">
				<div className="jazz-effect-best-list">
					<div className="jazz-effect-best-list-header">{I18N.SaveEffect.BestLabel}</div>

				</div>
			</div>
		);
	}
}
