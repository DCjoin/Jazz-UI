import React, { Component ,PropTypes} from 'react';
import {getBestSolution,ignoreBestForList} from 'actions/save_effect_action.js';
import BestStore from 'stores/save_effect/bestStore.jsx';
import FontIcon from 'material-ui/FontIcon';
import {LessInvest,HighCost,Easy,HighReturn} from './best/icon.jsx';
import {openTab} from 'util/Util.jsx';
import RoutePath from 'util/RoutePath.jsx';
import { CircularProgress,Snackbar} from 'material-ui';
import Detail from './list/save_effect_detail.jsx';

const characterType={
			"HighCost":1,
			"LessInvest":2,
			"Easy":3,
			"HighReturn":4
}

class Item extends Component {

	render(){
		var {solution,onItemClick,onIgnore}=this.props;

			var isCharacterSelected=(value)=>(solution.getIn(["BestInfo","Characteristics"]).indexOf(value+'')>-1);

		var highCost=isCharacterSelected(characterType.HighCost),
				lessInvest=isCharacterSelected(characterType.LessInvest),
				easy=isCharacterSelected(characterType.Easy),
				highReturn=isCharacterSelected(characterType.HighReturn);

		return(
			<div className="jazz-effect-best-list-item" onClick={onItemClick}>
				<div className="jazz-effect-best-list-item-info">
					<div className="jazz-effect-best-list-item-info-side">
						<div className="hierarchy">
						<FontIcon className="icon-building" color="#505559" style={{fontSize:'12px',marginRight:'7px'}}/>
						<div className="font">{`${I18N.SaveEffect.HierarchyFrom}${solution.get("HierarchyName")}`}</div>
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


}

export default class SaveEffectBestList extends Component {

	static contextTypes = {
		hierarchyId: PropTypes.string,
	};

	  constructor(props, ctx) {
        super(props)
        this._onChanged = this._onChanged.bind(this);
				this._onIgnoreSuccessd = this._onIgnoreSuccessd.bind(this);
				
  	}

		state={
			best:null,
			saveSuccessText:null,
			effectDetailShow:false,
			detailEffect:null
		}

		_onChanged(){
			this.setState({
				best:BestStore.getUsedBest()
			})
		}

		_onIgnoreSuccessd(){
			this.setState({
				saveSuccessText:I18N.SaveEffect.IgnoreSuccess
			})
		}

	componentDidMount(){
    getBestSolution(this.props.router.params.customerId);
    BestStore.addChangeListener(this._onChanged);
		BestStore.addIgnoreSuccessListener(this._onIgnoreSuccessd);
  }

  componentWillUnmount(){
    BestStore.removeChangeListener(this._onChanged);
		BestStore.removeIgnoreSuccessListener(this._onIgnoreSuccessd);
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
						      onBack={()=>{this.setState({effectDetailShow:false,detailEffect:null},
                                                            ()=>{
                                                              getBestSolution(this.props.router.params.customerId);
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
					<div className="jazz-effect-best-list-header">{I18N.SaveEffect.BestLabel}</div>
					{this.state.best.map(best=> <Item key={best.getIn(["SolutionInfo","EnergyEffectId"])} solution={best}
							onIgnore={()=>{ignoreBestForList(best.getIn(["SolutionInfo","EnergyEffectId"]),this.props.router.params.customerId)}}
							onItemClick={()=>{
								this.setState({
									effectDetailShow:true,
									detailEffect:best
								})}}/>)}
					{BestStore.getIgnoredBest().size!==0 && <div className="jazz-effect-best-list-ignored-btn" 
					onClick={()=>{
						openTab(RoutePath.saveEffect.ignoredbBest(this.props.params)+'?init_hierarchy_id='+this.context.hierarchyId);
						}}>{I18N.SaveEffect.IgnoredSolution}</div>}
				</div>
				<Snackbar ref="snackbar" autoHideDuration={4000} open={!!this.state.saveSuccessText} onRequestClose={()=>{this.setState({saveSuccessText:null})}} message={this.state.saveSuccessText}/>
			</div>
		);
		}

	}
}
