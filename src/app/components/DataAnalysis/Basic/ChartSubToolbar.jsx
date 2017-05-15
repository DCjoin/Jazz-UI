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
          minHeight: '48px',
          height: '48px',
          padding:'0 15px',
          'justifyContent': 'space-between'
        }}>
        <div style={{display:'flex'}}>
          <DropDownMenu ref="relativeDate" style={{
           width: '90px',
         }} labelStyle={{fontSize:'12px',lineHeight:'32px',paddingRight:'0'}} value={this.props.relativeDate} onChange={this.props.onRelativeDateChange}>{ConstStore.getSearchDate()}</DropDownMenu>

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
