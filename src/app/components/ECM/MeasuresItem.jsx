import React, { Component } from 'react';
import assign from 'lodash-es/assign';
import Config from 'config';
import Checkbox from 'material-ui/Checkbox';
import FontIcon from 'material-ui/FontIcon';
import CommonFuns from 'util/Util.jsx';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import BubbleIcon from '../BubbleIcon.jsx';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import classnames from "classnames";

function getUrl(url) {
	return "url(" + url+")";
	//return "url(" + Config.ServeAddress + url+")";
}
function validValue(value) {
	return value!==null?CommonFuns.getLabelData(value*1):'-';
}

let AlarmText=({text})=>(<div className="alarm-text">  
   <FontIcon className="icon-no_ecm" color="#fd625e" iconStyle ={{fontSize:'10px'}} style={{fontSize:'10px',height:'10px'}}/>
  <div style={{marginLeft:'4px'}}>{text}</div></div>)


export class IconText extends Component{
  render(){
		var style= assign({
    }, this.props.style);
    return(
      <div style={style}>
        <div style={{display:'flex',flexDirection:'row', position: 'relative'}}>
          {this.props.icon}
          <div title={this.props.label} style={{fontSize:'12px',marginLeft:'5px',color:"#626469", overflow: 'hidden', textOverflow: 'ellipsis'}}>{this.props.label}</div>
        </div>
				{(this.props.value || this.props.uom) && <div style={{display:'flex',flexDirection:'row',marginTop:'10px',alignItems:'baseline',height:"32px"}}>
					<div style={assign({
      fontSize: '25px',fontWeight: '500',color: '#0f0f0f'
    }, this.props.valueStyle)}>{this.props.value}</div>
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
	style:React.PropTypes.object,
  valueStyle:React.PropTypes.object
};

const SOLUTION_NAMES=[I18N.Setting.ECM.SolutionName.First,I18N.Setting.ECM.SolutionName.Second,I18N.Setting.ECM.SolutionName.Third,
                      I18N.Setting.ECM.SolutionName.Fourth,I18N.Setting.ECM.SolutionName.Fifth,I18N.Setting.ECM.SolutionName.Sixth,
                      I18N.Setting.ECM.SolutionName.Seventh,I18N.Setting.ECM.SolutionName.Eighth,I18N.Setting.ECM.SolutionName.Ninth,
                      I18N.Setting.ECM.SolutionName.Tenth]

class SolutionSelect extends Component {
    constructor(props) {
      super(props);
      this.state={
        selectMenuShow:false,
        anchorEl:null
      }
    }

    handleClick=(event)=>{
      event.preventDefault();
      event.stopPropagation();
      this.setState({
        selectMenuShow:true,
        anchorEl: event.currentTarget
      })
    }

    handleRequestClose = () => {
      this.setState({
       selectMenuShow: false,
    });
  }

    render(){
      var {sum,onClick}=this.props;
      return(
                <div className="solution-select">
                  <div className="solution-select-box" onClick={this.handleClick}>
                    <div className="solution-select-box-text">{SOLUTION_NAMES[this.props.index]}</div>
                    <FontIcon className="icon-arrow-unfold" color="#c0c0c0" iconStyle ={{fontSize:'10px'}} style={{fontSize:'10px'}}/>
                  </div>
                  <Popover
                    open={this.state.selectMenuShow}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    onRequestClose={this.handleRequestClose}
                    animation={PopoverAnimationVertical}
                  >
                  <div className="solution-select-paper">
                    {SOLUTION_NAMES.slice(0,sum).map((sulutionName,index)=>
                                                        <div className={classnames({
                                                          "solution-select-paper-item":true,
                                                          "selected":index===this.props.index
                                                        })}
                                                         
                                                             onClick={(e)=>{
                                                                e.preventDefault();
                                                                this.setState({
                                                                  selectMenuShow:false
                                                                },()=>{
                                                                  onClick(index);
                                                                })                                                                
                                                             }}>{sulutionName}</div>)}
                  </div>
                  </Popover>
              </div>
      )
    }
}


export class MeasuresItem extends Component {

    constructor(props) {
      super(props);
      this.state={
        displaySolutionIdx:0
      }
    }

    getAlarmName(){
      var {Problem}=this.props.measure.toJS();
      var Name=null;
      if(Problem.SolutionTitle!==null && Problem.SolutionTitle!==''){
        Name=Problem.SolutionTitle
      }else{
        if(Problem.Name!==null && Problem.Name!==''){
          Name=`(${I18N.Setting.ECM.EnergyProblemName}:${Problem.Name})`
        }
      }

      return (<div style={{display:"flex",flexDirection:'row',alignItems:'center',overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
              <div className="measuresItem-title" style={{marginRight:'10px'}} title={Name}>{Name}</div>
              {this.props.disabled && <AlarmText text={I18N.Setting.ECM.Uncompleted}/>}</div>)
    }

    getName(){
      var {Problem}=this.props.measure.toJS();
      var Name=null;
      if(Problem.SolutionTitle!==null && Problem.SolutionTitle!==''){
        Name=Problem.SolutionTitle
      }else{
        if(Problem.Name!==null && Problem.Name!==''){
          Name=`(${I18N.Setting.ECM.EnergyProblemName}:${Problem.Name})`
        }
      }

      return (<div style={{display:"flex",flexDirection:'row',alignItems:'center',overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
              <div className="measuresItem-title" style={{marginRight:'10px'}} title={Name}>{Name}</div>
              </div>)
    }

    _renderContent(){
      var {Problem}=this.props.measure.toJS();
      var {Solutions}=this.props.measure.toJS();
      var {ExpectedAnnualCostSaving,InvestmentAmount}=Solutions[this.state.displaySolutionIdx] || [];
			var InvestmentReturnCycle=MeasuresStore.getInvestmentReturnCycle(InvestmentAmount,ExpectedAnnualCostSaving);

      let iconStyle = {
          fontSize: '16px'
        },
        style = {
          padding: '0px',
          height: '18px',
          width: '18px',
          fontSize: '18px',
        };
      var costIcon=<FontIcon className="icon-cost_saving" iconStyle ={iconStyle} color="#626469" style = {style} />,
          sumIcon=<FontIcon className="icon-investment-amount" iconStyle ={iconStyle} color="#626469" style = {style} />,
          periodIcon=<FontIcon className="icon-pay-back-period" iconStyle ={iconStyle} color="#626469" style = {style} />;
      var valueStyle={
        overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
      }
      return(
        <div className="measuresItem-content">
          <div className="side" style={{flex:1}}>
            <div className="image" style={{backgroundImage:getUrl(Problem.ThumbnailUrl)}}></div>
            <div style={{display:'flex',flexDirection:'column',flex:1}}>
              {Solutions.length>1 && <SolutionSelect sum={Solutions.length}
                                                     index={this.state.displaySolutionIdx}
                                                     onClick={(index)=>{
                                                       this.setState({displaySolutionIdx:index})
                                                     }}/>}
              <div style={{marginTop:'15px',display:'flex'}}>
                <IconText icon={costIcon} style={{marginLeft:'30px',flex:1}} valueStyle={valueStyle} label={I18N.Setting.ECM.EstimatedAnnualCostSavings} value={validValue(ExpectedAnnualCostSaving)} uom="RMB"/>
                <IconText icon={sumIcon} style={{marginLeft:'30px',flex:1}} valueStyle={valueStyle} label={I18N.Setting.ECM.InvestmentAmount} value={validValue(InvestmentAmount)} uom="RMB"/>
                <IconText icon={periodIcon} style={{marginLeft:'30px',flex:1}} valueStyle={valueStyle} label={I18N.Setting.ECM.PaybackPeriod} value={InvestmentReturnCycle || '-'}
											uom={CommonFuns.isNumber(InvestmentReturnCycle)?I18N.EM.Years:''}/>
              </div>

            </div>
            
            <div>{this.props.personInCharge}</div>
          </div>
          <div className="side">
            {this.props.action}
          </div>
        </div>
      )
    }

    _renderName(){
      var {Problem}=this.props.measure.toJS();
			var styles={
				box:{
					width: '24px',
  				height: '24px',
					color: '#666666',
				}
			}
      return(
        <div className="name">
          <div className="side">
            {this.props.hasCheckBox && <Checkbox disabled={this.props.disabled} checked={this.props.isChecked}
																									onCheck={this.props.onChecked}
																									style={{width:'24px',marginRight:'16px'}}
																									iconStyle={styles.box}
																									onClick={(e)=>{
																										e.stopPropagation();
																									}}/>}
            {this.props.isFromNotPush?this.getAlarmName():this.getName()}
          </div>
          <div style={{fontSize:'14px',color: '#626469', flex: 'none', marginLeft: 100}}>{MeasuresStore.getEnergySys(Problem.EnergySys)}</div>
        </div>
      )
    }

	render() {
    return(
			<div className="jazz-complex-measuresItem">
				{this.props.displayUnread && !this.props.measure.getIn(['Problem','IsRead'])?<BubbleIcon style={{width:'5px',height:'5px'}}/>:<div style={{marginRight:'5px'}}/>}
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
	displayUnread:React.PropTypes.bool,
  isFromNotPush:React.PropTypes.bool,
};

MeasuresItem.defaultProps = {
	hasCheckBox:false,
	disabled:false
}
