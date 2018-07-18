import React, { Component } from 'react';
import DataQualityMaintenanceAction from 'actions/data_quality_maintenance.jsx';
import DataQualityMaintenanceStore from 'stores/data_quality_maintenance.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import PropTypes from 'prop-types';
import Spin from '@emop-ui/piano/spin';
import { formStatus } from 'constants/FormStatus.jsx';
import ViewedRule from './viewed_rule.jsx';
import EditedRule from './edited_rule.jsx';

export default class MonitorRule extends Component {

  static contextTypes = {
    router: PropTypes.object,
  };
  
  constructor(props) {
    super(props);

    this.state = {
      rule:null,
      formStatus:formStatus.VIEW
    };
    this._onChanged = this._onChanged.bind(this);
  }

  _onChanged(){
    this.setState({
      rule:DataQualityMaintenanceStore.getRule()
    })
  }

  componentDidMount() {
    DataQualityMaintenanceStore.addChangeListener(this._onChanged);
    DataQualityMaintenanceAction.getrulebyid({
      CustomerId:parseInt(this.context.router.params.customerId),
      UserId: CurrentUserStore.getCurrentUser().Id,
      TagId:this.props.selectTag.get("Id")
    })
  }

  componentWillReceiveProps(nextProps){
    if(this.props.selectTag.get("Id")!==nextProps.selectTag.get("Id")){
      this.setState({
        rule:null,
        formStatus:formStatus.VIEW
      },()=>{
        DataQualityMaintenanceAction.getrulebyid({
          CustomerId:parseInt(this.context.router.params.customerId),
          UserId: CurrentUserStore.getCurrentUser().Id,
          TagId:this.props.selectTag.get("Id")
        })
      })

    }
  }

  componentWillUnmount() {
    DataQualityMaintenanceStore.removeChangeListener(this._onChanged);
  }

  render(){
    if(this.state.rule===null){
      return(
        <div style={{
          display: 'flex',
          flex: 1,
          'alignItems': 'center',
          'justifyContent': 'center'
        }}>
                    <Spin/>
                  </div>
      )
    }else{
      var {CheckNull,CheckNegative ,CheckJumping }=this.state.rule.toJS();
      if(!CheckNull && !CheckNegative && !CheckJumping){
        return(
          <div className="data-quality-rule" style={{display:'flex',flex:'1',justifyContent:'center',alignItems:'center'}}>
            {I18N.VEE.Rule.NoRule}
          </div>
        )
      }else{
        return(
            this.state.formStatus===formStatus.VIEW?
                  <ViewedRule rule={this.state.rule} onEdited={()=>{this.setState({formStatus:formStatus.EDIT})}}/>
                  :<EditedRule rule={this.state.rule} 
                               hasBar={true} 
                               onSave={()=>{this.setState({
                                 formStatus:formStatus.VIEW
                               },()=>{
                                 var {JumpingRate,NotifyConsecutiveHours}=this.state.rule.toJS();
                                DataQualityMaintenanceAction.updateRule({
                                  Rule:this.state.rule.set("JumpingRate",JumpingRate*1)
                                                      .set("NotifyConsecutiveHours",NotifyConsecutiveHours*1).toJS(),
                                  TagIds:[this.props.selectTag.get("Id")]
                                })
                               })}}
                               onCancel={()=>this.setState({
                                rule:DataQualityMaintenanceStore.getRule(),
                                formStatus:formStatus.VIEW
                               })}
                               onChange={(path,value)=>{
                                 var rule=this.state.rule.set(path,value);
                                 if(path==='CheckNull'){
                                  rule=rule.set("NotifyConsecutiveHours",8);
                                  rule=rule.set("IsAutoRepairNull",true);
                                 }
                                 if(path==='CheckJumping'){
                                  rule=rule.set("JumpingRate",500);
                                 }
                                 this.setState({
                                  rule:rule
                                 })
                               }}/>         
        )
      }

    }
  }
}