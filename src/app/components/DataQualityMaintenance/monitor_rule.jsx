import React, { Component } from 'react';
import DataQualityMaintenanceAction from 'actions/data_quality_maintenance.jsx';
import DataQualityMaintenanceStore from 'stores/data_quality_maintenance.jsx';
import CurrentUserStore from 'stores/CurrentUserStore.jsx';
import { FontIcon} from 'material-ui';
import PropTypes from 'prop-types';
import Spin from '@emop-ui/piano/spin';


const TextStyle={
  fontSize: '14px',
  color: '#626469'
},SubTextStyle={
  fontSize: '14px',
  color: '#9fa0a4'
};
export default class MonitorRule extends Component {

  static contextTypes = {
    router: PropTypes.object,
  };
  
  constructor(props) {
    super(props);

    this.state = {
      rule:null
    };
    this._onChanged = this._onChanged.bind(this);
  }

  _onChanged(){
    this.setState({
      rule:DataQualityMaintenanceStore.getRule()
    })
  }

  _renderNullValue(){
    var {NotifyConsecutiveHours,IsAutoRepairNull}=this.state.rule.toJS();
    return(
      <div className="data-quality-rule-section">
        <div className="data-quality-rule-section-title">
          <FontIcon className='icon-check-mark' color={"#32AD3C"} style={{fontSize:'18px'}}/>
          <div className="text">{I18N.Setting.VEEMonitorRule.NullValue}</div>
        </div>
        <div className="row" style={TextStyle}>{I18N.format(I18N.VEE.Rule.NotifyConsecutiveHours,NotifyConsecutiveHours)}</div>
        {IsAutoRepairNull && <div className="row" style={{display:'flex'}}>
          <div style={TextStyle}>{I18N.VEE.Rule.AutoRepairNullTip1}</div>
          <div style={SubTextStyle}>{I18N.VEE.Rule.AutoRepairNullTip2}</div>
        </div>}
      </div>
    )
  }

  _renderNegativeValue(){
    return(
      <div className="data-quality-rule-section">
        <div className="data-quality-rule-section-title">
          <FontIcon className='icon-check-mark' color={"#32AD3C"} style={{fontSize:'18px'}}/>
          <div className="text">{I18N.Setting.VEEMonitorRule.NegativeValue}</div>
        </div>
      </div>
    )
  }

  _renderJumpingValue(){
    var {JumpingRate}=this.state.rule.toJS();
    return(
      <div className="data-quality-rule-section">
        <div className="data-quality-rule-section-title">
          <FontIcon className='icon-check-mark' color={"#32AD3C"} style={{fontSize:'18px'}}/>
          <div className="text">{I18N.Setting.VEEMonitorRule.JumpValue}</div>
        </div>
        <div className="row" style={TextStyle}>{I18N.format(I18N.VEE.Rule.JumpValueTip,JumpingRate)}</div>
      </div>
    )
  }

  componentDidMount() {
    DataQualityMaintenanceStore.addChangeListener(this._onChanged);
    DataQualityMaintenanceAction.getrulebyid({
      CustomerId:parseInt(this.context.router.params.customerId),
      UserId: CurrentUserStore.getCurrentUser().Id,
      TagId:this.props.selectTag.get("Id")
    })
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
          <div className="data-quality-rule">
            <div style={SubTextStyle}>{I18N.VEE.Rule.Tip}</div>
            {CheckNull && this._renderNullValue()}
            {CheckNegative && this._renderNegativeValue()}
            {CheckJumping && this._renderJumpingValue()}
          </div>
        )
      }

    }
  }
}