import React, { Component } from 'react';
import {ItemForManager,ItemForConsultant} from './Item.jsx';
import FontIcon from 'material-ui/FontIcon';
import RoutePath from 'util/RoutePath.jsx';
// import _ from 'lodash-es';
import Immutable from "immutable";
import privilegeUtil from 'util/privilegeUtil.jsx';
import PermissionCode from 'constants/PermissionCode.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import FlatButton from "controls/NewFlatButton.jsx";
import {getenergyeffect,saveeffectratetag, configEnergySystem} from 'actions/save_effect_action.js';
import ListStore from '../../../stores/save_effect/ListStore.jsx';
import { CircularProgress,Snackbar} from 'material-ui';
import ConfigRate from './ConfigRate.jsx';
import HierarchyStore from 'stores/HierarchyStore.jsx';
import CurrentUserCustomerStore from 'stores/CurrentUserCustomerStore.jsx';
import {find} from 'lodash-es';
import Detail from './save_effect_detail.jsx';
import Create from '../create';
import PreCreate from '../create/pre_create.jsx';
import util from 'util/Util.jsx';

function privilegeWithSave_Effect( privilegeCheck ) {
   return true
	// return privilegeCheck(PermissionCode.Save_Effect, CurrentUserStore.getCurrentPrivilege());
}
function isFull() {
	return privilegeWithSave_Effect(privilegeUtil.isFull.bind(privilegeUtil));
}

function getCustomerById(customerId) {
	return find(CurrentUserCustomerStore.getAll(), customer => customer.Id === customerId * 1 );
}


export default class EffectList extends Component {

  static contextTypes = {
        hierarchyId: React.PropTypes.string
      };

  constructor(props, ctx) {
        super(props)
        this._onChanged = this._onChanged.bind(this);
        this._onRateTagSave = this._onRateTagSave.bind(this);
        this._onItemClick = this._onItemClick.bind(this);

  }

  state={
    effect:null,
  draftShow:false,
  deleteConfirmShow:false,
  deleteIndex:null,
  configRateShow:false,
  effectDetailShow:false,
  displayEffect:null,
  saveSuccessText:null,
  configEnergyProblemId:null,
  createShow:false
  }

  _getHierarchyId(router, context) {
		return +router.location.query.init_hierarchy_id || +context.hierarchyId || null;
	}
	_getSelectedHierarchy() {
		let selectedHierarchyId = this._getHierarchyId(this.props.router, this.context);
		return find(HierarchyStore.getBuildingList().concat(getCustomerById(this.props.router.params.customerId)), building => building.Id === selectedHierarchyId) || null;
	}
  _onChanged(){
    this.setState({
      effect:ListStore.getEffect()
    })
  }

  _onDraftShow(){
    this.setState({
      draftShow:true
    })
  }

  _onConfigRateShow(){
    this.setState({
      configRateShow:true
    })
  }

  _onRateTagSave(list){
    this.setState({
      configRateShow:false
    },()=>{
        saveeffectratetag(this.props.router.params.customerId,this.context.hierarchyId,list)
    })
  }

  _onItemClick(effect){
    this.setState({
      effectDetailShow:true,
      displayEffect:effect
    })
  }

  _onConfig(id){
      this.setState({
        configEnergyProblemId:id,
        createShow:true
      })
  }

  _onConfigSuccess(){
    this.setState({
      saveSuccessText:I18N.SaveEffect.ConfigSuccess,
      effect:null
    })
  }


  componentDidMount(){
    getenergyeffect(this.context.hierarchyId);
    ListStore.addChangeListener(this._onChanged);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if( !util.shallowEqual(nextContext.hierarchyId, this.context.hierarchyId) ) {
      this.setState({
      effect:null
    },()=>{
      getenergyeffect(nextContext.hierarchyId);
    });
    }
  }

  componentWillUnmount(){
    ListStore.removeChangeListener(this._onChanged);
  }


  render(){
    var style={
      btn:{
        height:'30px',
        width:'100px',
        lineHeight:'30px',
        marginLeft:'15px'
      },
      lable:{
        fontSize: "14px",
        fontWeight: "500",
        padding:'0'
      }
    };

    if(this.state.effect===null){
      return (
        <div className="jazz-effect-list flex-center">
         <CircularProgress  mode="indeterminate" size={80} />
       </div>
      )
    }else if(this.state.effect.get('EnergyEffects').size===0){
      return (
        <div className="jazz-effect-list flex-center">
          <FontIcon className="icon-weather-thunder" style={{fontSize:'60px'}} color="#32ad3d"/>
         <div className="nolist-font">{I18N.SaveEffect.NoEffectList}</div>
       </div>
      )
    }else if(this.state.effectDetailShow){
      return(
          <Detail effect={this.state.displayEffect} onBack={()=>{this.setState({effectDetailShow:false,displayEffect:null},
                                                            ()=>{
                                                              // getenergyeffect(this.context.hierarchyId)
                                                            })}}
                                                    canEdit={isFull()}/>
      )
    }else{
      let disabled=ListStore.getRateBtnDisabled(this.state.effect.get("EnergyEffects"));
      var configEffect;
      if(this.state.configEnergyProblemId){
          configEffect  =this.state.effect.get("EnergyEffects")
                              .find(item=>(item.get("EnergyProblemId")===this.state.configEnergyProblemId));
      }
      return(
        <div className="jazz-effect-overlay">
          <div className="jazz-effect-list">
            {isFull() && !disabled && this.state.effect.get('SavingRateConfigState') && <div className="jazz-effect-list-rateTip">
              {I18N.SaveEffect.EffectRateTip}
            </div>}
            <div className="jazz-effect-list-header">
              <div>
                <div className="jazz-effect-list-title">{I18N.Setting.Effect.List}</div>
                {isFull() && <FlatButton label={I18N.SaveEffect.ConfigSaveRatio} onTouchTap={this._onConfigRateShow.bind(this)}
                            disabled={disabled} style={style.btn} labelStyle={style.lable} secondary={true}/>}
              </div>
              {this.state.effect.get('Drafts').size!==0?<div className="draft-btn" onClick={()=>{
                   this.props.router.push(RoutePath.saveEffect.drafts(this.props.params));
                }}>
                {`${I18N.SaveEffect.Draft} (${this.state.effect.get('Drafts').size})`}
              </div>
            :<div className="draft-btn-disabled">
              {`${I18N.SaveEffect.Draft} (${this.state.effect.get('Drafts').size})`}
            </div>}
            </div>
            <div className="jazz-effect-list-content">
              {this.state.effect.get("EnergyEffects").map(item=>(
                isFull()?<ItemForConsultant effect={item} configEnergyProblemId={this.state.configEnergyProblemId} onClick={this._onItemClick} canEdit={isFull()} onConfig={this._onConfig.bind(this,item.get('EnergyProblemId'))}/>
              :(item.get('ConfigedTagCount')!==0 && <ItemForManager effect={item} onClick={this._onItemClick} canEdit={isFull()}/>)))}
            </div>
            {this.state.configRateShow &&
                <ConfigRate hierarchyName={this._getSelectedHierarchy().Name} hierarchyId={this.context.hierarchyId}
                            onClose={()=>{this.setState({configRateShow:false})}} onSave={this._onRateTagSave}/>}
            <Snackbar ref="snackbar" autoHideDuration={4000} open={!!this.state.saveSuccessText} onRequestClose={()=>{this.setState({saveSuccessText:null})}} message={this.state.saveSuccessText}/>
              {this.state.createShow && true && <Create
    						EnergySolutionName={configEffect.get('EnergySolutionName')}
    						EnergyProblemId={configEffect.get('EnergyProblemId')}
    						EnergyEffectId={configEffect.get('EnergyEffectId')}
    						ExecutedTime={configEffect.get('ExecutedTime')}
    						onSubmitDone={()=>{getenergyeffect(this.context.hierarchyId);}}
    						onClose={()=>{
    							this.setState({
                    createShow:false,
    								saveSuccessText:I18N.SaveEffect.ConfigSuccess,
    								effect:null
    							})
    						}}/>}
              {this.state.createShow && false && <PreCreate onClose={() => {}} onSubmit={(energySys) => {
                configEnergySystem(
                  this.props.router.params.customerId,
                  this.context.hierarchyId,
                  configEffect.get('EnergyProblemId'),
                  energySys)
              }}/>}
        </div>
        </div>

      )
    }

  }
}

EffectList.propTypes = {
  list:React.PropTypes.object,
};
