'use strict';
import React, { Component }  from "react";
import DropDownMenu from 'material-ui/DropDownMenu';
import StepSelector from '../../energy/StepSelector.jsx';
import ConstStore from 'stores/ConstStore.jsx';
import DateTimeSelector from 'controls/DateTimeSelector.jsx';

export default class ChartSubToolbar extends Component {

  constructor(props) {
     super(props);
  }

  getConfigBtnStatus(){
    var chartType=this.props.selectedChartType;
    if(!this.props.hasTagData){
      return false
    }
    if (chartType === "line" || chartType === "column" || chartType === "stack"){
      return true
    }
    else {
      return false
    }
  }

  render(){
    return(
      <div style={{
          display: 'flex',
          minHeight: '70px',
          height: '70px',
          padding:'0 20px',
          alignItems:'center',
          border:'solid 1px #e6e6e6',
          borderBottom:'none'
        }}>
        <div style={{display:'flex'}}>
          <DropDownMenu ref="relativeDate" style={{
           width: '100px',
           height:'30px',
           lineHeight:'30px',
           backgroundColor:'#ffffff',
           border:'1px solid #e6e6e6'
         }}
         labelStyle={{fontSize:'14px',lineHeight:'30px',paddingRight:'0',color:'#626469',height:'30px',paddingLeft:'0',textAlign:'center'}} iconStyle={{display:'none'}} underlineStyle={{display:'none'}} value={this.props.relativeDate} onChange={this.props.onRelativeDateChange}>{ConstStore.getSearchDate()}</DropDownMenu>

       <DateTimeSelector ref='dateTimeSelector' endLeft='-100px' _onDateSelectorChanged={this.props.onDateSelectorChanged} showTime={true}/>

        {this.props.timeRanges && <StepSelector disabled={!this.getConfigBtnStatus()} stepValue={this.props.step} onStepChange={this.props.onStepChange} timeRanges={this.props.timeRanges}/>}
       </div>
        </div>
    )
  }
}

ChartSubToolbar.propTypes = {
  selectedChartType:React.PropTypes.string,
  onSearchBtnItemTouchTap:React.PropTypes.object,
  hasTagData:React.PropTypes.bool,
  timeRanges:React.PropTypes.object,
  step:React.PropTypes.number,
  onStepChange:React.PropTypes.object,
  initYaxisDialog:React.PropTypes.func,
  onYaxisSelectorDialogSubmit:React.PropTypes.func,
  handleCalendarChange:React.PropTypes.func,
  relativeDate:React.PropTypes.string,
  onRelativeDateChange:React.PropTypes.func,
  onDateSelectorChanged:React.PropTypes.func,
};
