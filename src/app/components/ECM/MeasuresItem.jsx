import React, { Component } from 'react';
import assign from 'lodash-es/assign';
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
	return value!==null?CommonFuns.getLabelData(value*1):'-';
}

export class IconText extends Component{
  render(){
		var style= assign({
      width:"145px",
    }, this.props.style);
    return(
      <div style={style}>
        <div style={{display:'flex',flexDirection:'row'}}>
          {this.props.icon}
          <div style={{fontSize:'12px',marginLeft:'5px',color:"#626469"}}>{this.props.label}</div>
        </div>
				{(this.props.value || this.props.uom) && <div style={{display:'flex',flexDirection:'row',marginTop:'10px',alignItems:'center',height:"32px"}}>
					<div style={{fontSize: '25px',fontWeight: '500',color: '#0f0f0f'}}>{this.props.value}</div>
					<div style={{fontSize: '14px',color: '#0f0f0f',marginLeft:this.props.value?'10px':'0px'}}>{this.props.uom}</div>
				</div>}
				{this.props.children}
      </div>
    )
  }
}

IconText.propTypes = {
  icon:React.PropTypes.string,
  label:React.PropTypes.bool,
  value:React.PropTypes.string,
	uom:React.PropTypes.string,
	style:React.PropTypes.object
};

export class MeasuresItem extends Component {

    constructor(props) {
      super(props);
    }

    getName(){
      var {EnergyProblem,EnergySolution}=this.props.measure.toJS();
      if(EnergySolution.Name!==null){
        return <div className="measuresItem-title">{EnergySolution.Name}</div>
      }
      else {
        let iconStyle = {
            fontSize: '14px'
          },
          style = {
            padding: '0px',
            height: '13.5px',
            width: '14.5px',
            fontSize: '14px',
            marginTop:'-5px',
						marginRight:'5px'
          };
        return <div style={{display:"flex",flexDirection:'row',alignItems:'center',marginTop:'-3px'}}>
                <FontIcon className="icon-no_ecm" color="#dc0a0a" iconStyle ={iconStyle} style = {style} />
                <div style={{color:'#dc0a0a',fontSize:'14px'}}>{I18N.Setting.ECM.NoECM}</div>
                <div style={{color:'#4f5156',marginLeft:'10px',fontSize:'10px'}}>{`(${I18N.Setting.ECM.EnergyProblem}:${EnergyProblem.Name})`}</div>
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
      var costIcon=<FontIcon className="icon-cost_saving" iconStyle ={iconStyle} color="#626469" style = {style} />,
          sumIcon=<FontIcon className="icon-investment-amount" iconStyle ={iconStyle} color="#626469" style = {style} />,
          periodIcon=<FontIcon className="icon-pay-back-period" iconStyle ={iconStyle} color="#626469" style = {style} />;
      return(
        <div className="measuresItem-content">
          <div className="side" style={{flex:1}}>
            <div className="image" style={{backgroundImage:getUrl(EnergyProblem.ThumbnailUrl)}}></div>
            <IconText icon={costIcon} style={{marginLeft:'30px',flex:1}} label={I18N.Setting.ECM.EstimatedAnnualCostSavings} value={validValue(ExpectedAnnualCostSaving)} uom="RMB"/>
            <IconText icon={sumIcon} style={{marginLeft:'30px',flex:1}} label={I18N.Setting.ECM.InvestmentAmount} value={validValue(InvestmentAmount)} uom="RMB"/>
            <IconText icon={periodIcon} style={{marginLeft:'30px',flex:1}} label={I18N.Setting.ECM.PaybackPeriod} value={InvestmentReturnCycle || '-'}
											uom={CommonFuns.isNumber(InvestmentReturnCycle)?I18N.EM.Year:''}/>
            <div>{this.props.personInCharge}</div>
          </div>
          <div className="side">
            {this.props.action}
          </div>
        </div>
      )
    }

    _renderName(){
      var {EnergyProblem}=this.props.measure.toJS();
			var styles={
				box:{
					width: '18px',
  				height: '18px',
					color: '#626469',
					marginRight:'10px'
				}
			}
      return(
        <div className="name">
          <div className="side">
            {this.props.hasCheckBox && <Checkbox disabled={this.props.disabled} checked={this.props.isChecked}
																									onCheck={this.props.onChecked}
																									style={{width:'16px'}}
																									iconStyle={styles.box}
																									onClick={(e)=>{
																										e.stopPropagation();
																									}}/>}
            {this.getName()}
          </div>
          <div style={{fontSize:'14px',color: '#626469'}}>{MeasuresStore.getEnergySys(EnergyProblem.EnergySys)}</div>
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
