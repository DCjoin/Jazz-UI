import React, { Component ,PropTypes} from 'react';
import {getBestSolution} from 'actions/save_effect_action.js';
import BestStore from 'stores/save_effect/bestStore.jsx';
import {LessInvest,HighCost,Easy,HighReturn} from './icon.jsx';
import {openTab} from 'util/Util.jsx';
import RoutePath from 'util/RoutePath.jsx';
import { CircularProgress} from 'material-ui';
import Detail from '../list/save_effect_detail.jsx';

const characterType={
			"HighCost":1,
			"LessInvest":2,
			"Easy":3,
			"HighReturn":4
}

class Item extends Component {

	render(){
		var {solution,onItemClick}=this.props;

			var isCharacterSelected=(value)=>(solution.getIn(["BestInfo","Characteristics"]).indexOf(value+'')>-1);

		var highCost=isCharacterSelected(characterType.HighCost),
				lessInvest=isCharacterSelected(characterType.LessInvest),
				easy=isCharacterSelected(characterType.Easy),
				highReturn=isCharacterSelected(characterType.HighReturn);

		return(
			<div className="jazz-effect-best-list-ignored-item" onClick={onItemClick}>
      <div className="column1" title={solution.getIn(["SolutionInfo","EnergySolutionName"])}>{solution.getIn(["SolutionInfo","EnergySolutionName"])}</div>
			<div className="column2">
						{lessInvest && <LessInvest/>}
						{highReturn && <HighReturn/>}
						{highCost && <HighCost/>}
						{easy && <Easy/>}
			</div>
					
			</div>
				)

}


}

export default class SaveEffectIgnoredBestList extends Component {

	  constructor(props, ctx) {
        super(props)
        this._onChanged = this._onChanged.bind(this);				
  	}

		state={
			best:null,
			effectDetailShow:false,
			detailEffect:null
		}

		_onChanged(){
			this.setState({
				best:BestStore.getIgnoredBest()
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
		if(this.state.best===null){
      return (
        <div className="jazz-effect-best-list flex-center">
         <CircularProgress  mode="indeterminate" size={80} />
       </div>
      )
    }else if(this.state.effectDetailShow){
      return(
          <Detail effect={this.state.detailEffect.get("SolutionInfo").set("HierarchyName",this.state.detailEffect.get("HierarchyName"))}
						      onBack={()=>{this.setState({effectDetailShow:false,displayEffectProblemId:null},
                                                            ()=>{
                                                              getBestSolution(this.context.hierarchyId)
                                                            })}}
								  customerId={this.props.router.params.customerId}
									hierarchyId={this.state.detailEffect.get("HierarchyId")}
									isFromBestList={true}
                  canEdit={false}/>
      )
    }else{
		return (
			<div className="jazz-effect-overlay">
				<div className="jazz-effect-best-list">
					<div className="jazz-effect-best-list-header">{I18N.SaveEffect.IgnoredSolution}</div>
          <div className="jazz-effect-best-list-ignored-header">
            <div className="column1">{I18N.SaveEffect.SolutionName}</div>
            <div className="column2">{I18N.SaveEffect.SolutionCharacter}</div>
          </div>
					{this.state.best.map(best=>{
						return <Item key={best.getIn(["SolutionInfo","EnergyEffectId"])} solution={best}
							onItemClick={()=>{
								this.setState({
									effectDetailShow:true,
									detailEffect:best
								})
							}}/>})}
				</div>
			</div>
		);
		}

	}
}
