import React, { Component } from 'react';
import Config from 'config';
import Checkbox from 'material-ui/Checkbox';
import FontIcon from 'material-ui/FontIcon';
import CommonFuns from 'util/Util.jsx';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import BubbleIcon from '../BubbleIcon.jsx';
function getUrl(url) {
	return "url(" + url+")";
	//return "url(" + Config.ServeAddress + url+")";
}
function validValue(value) {
	return value!==null?`${CommonFuns.getLabelData(value*1)} RMB`:'- RMB';
}

class IconText extends Component{
  render(){
    return(
      <div style={{marginLeft:'50px'}}>
        <div style={{display:'flex',flexDirection:'row'}}>
          {this.props.icon}
          <div style={{fontSize:'12px',marginLeft:'5px'}}>{this.props.label}</div>
        </div>
        <div style={{marginTop:'5px'}}>{this.props.value}</div>
      </div>
    )
  }
}

IconText.propTypes = {
  icon:React.PropTypes.string,
  label:React.PropTypes.bool,
  value:React.PropTypes.func,
};

export default class MeasuresItem extends Component {

    constructor(props) {
      super(props);
    }

    getName(){
      var {EnergyProblem,EnergySolution}=this.props.measure.toJS();
      if(EnergySolution.Name!==null){
        return <div>{EnergySolution.Name}</div>
      }
      else {
        let iconStyle = {
            fontSize: '16px'
          },
          style = {
            padding: '0px',
            height: '18px',
            width: '18px',
            fontSize: '18px',
            marginTop:'-5px',
						marginRight:'5px'
          };
        return <div style={{display:"flex",flexDirection:'row',alignItems:'center',marginTop:'-3px'}}>
                <FontIcon className="icon-no_ecm" color="red" iconStyle ={iconStyle} style = {style} />
                <div style={{color:'red'}}>{I18N.Setting.ECM.NoECM}</div>
                <div style={{color:'#abafae',marginLeft:'5px',fontSize:'14px'}}>{`(${I18N.Setting.ECM.EnergyProblem}:${EnergyProblem.Name})`}</div>
              </div>
      }
    }

    _renderContent(){
      var {EnergySolution,EnergyProblem}=this.props.measure.toJS();
      var {ExpectedAnnualCostSaving,InvestmentAmount}=EnergySolution;
			var InvestmentReturnCycle=MeasuresStore.getInvestmentReturnCycle(InvestmentAmount,ExpectedAnnualCostSaving);
      let iconStyle = {
          fontSize: '16px'
        },
        style = {
          padding: '0px',
          height: '18px',
          width: '18px',
          fontSize: '18px',
          marginTop:'-5px'
        };
      var costIcon=<FontIcon className="icon-cost_saving" iconStyle ={iconStyle} style = {style} />,
          sumIcon=<FontIcon className="icon-investment" iconStyle ={iconStyle} style = {style} />,
          periodIcon=<FontIcon className="icon-roi" iconStyle ={iconStyle} style = {style} />;
      return(
        <div className="content">
          <div className="side">
            <div className="image" style={{backgroundImage:getUrl(EnergyProblem.ThumbnailUrl)}}></div>
            <IconText icon={costIcon} label={I18N.Setting.ECM.EstimatedAnnualCostSavings} value={validValue(ExpectedAnnualCostSaving)}/>
            <IconText icon={sumIcon} label={I18N.Setting.ECM.InvestmentAmount} value={validValue(InvestmentAmount)}/>
            <IconText icon={periodIcon} label={I18N.Setting.ECM.PaybackPeriod} value={InvestmentReturnCycle || '-'}/>
            <div style={{marginLeft:'100px'}}>{this.props.personInCharge}</div>
          </div>
          <div className="side">
            {this.props.action}
          </div>
        </div>
      )
    }

    _renderName(){
      var {EnergyProblem}=this.props.measure.toJS();
      return(
        <div className="name">
          <div className="side">
            {this.props.hasCheckBox && <Checkbox disabled={this.props.disabled} checked={this.props.isChecked}
																									onCheck={this.props.onChecked}
																									style={{width:'40px'}}
																									onClick={(e)=>{
																										e.stopPropagation();
																									}}/>}
            {this.getName()}
          </div>
          <div style={{fontSize:'16px'}}>{MeasuresStore.getEnergySys(EnergyProblem.EnergySys)}</div>
        </div>
      )
    }

	render() {
    return(
			<div className="jazz-complex-measuresItem">
				{this.props.displayUnread && !this.props.measure.getIn(['EnergyProblem','IsRead'])?<BubbleIcon style={{width:'5px',height:'5px'}}/>:<div style={{marginRight:'5px'}}/>}
				<div className="jazz-energy-conservation-measuresItem" onClick={this.props.onClick}>
					{this._renderName()}
					{this._renderContent()}
				</div>
			</div>

    )

  }
}
MeasuresItem.propTypes = {
  measure:React.PropTypes.object,
  hasCheckBox:React.PropTypes.bool,
  isChecked:React.PropTypes.bool,
  onChecked:React.PropTypes.func,
	disabled:React.PropTypes.bool,
  personInCharge:React.PropTypes.object,
  action:React.PropTypes.any,
	onClick:React.PropTypes.func,
	displayUnread:React.PropTypes.bool
};

MeasuresItem.defaultProps = {
	hasCheckBox:false,
	disabled:false
}
