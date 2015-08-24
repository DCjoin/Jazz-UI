import React from 'react';
import mui from 'material-ui';
import classSet from 'classnames';
import MultipleTimespanStore from '../../../stores/energy/MultipleTimespanStore.jsx';
import DateTimeSelector from '../../../controls/DateTimeSelector.jsx';
import LinkButton from '../../../controls/LinkButton.jsx';
let { Dialog, DropDownMenu, FlatButton, TextField,Mixins} = mui;

let TimespanItem = React.createClass({
  propTypes:{
    title:  React.PropTypes.string,
    isOriginalDate: React.PropTypes.bool,
    relativeType: React.PropTypes.oneOf(MultipleTimespanStore.getRelativeTypes()),
    relativeValue: React.PropTypes.number,
    compareIndex: React.PropTypes.number, //对比时间编号，原始时间没有此参数
    startDate: React.PropTypes.object,
    endDate: React.PropTypes.object,
    dateDescription: React.PropTypes.string//对比时间段的文字时间
  },
  getDefaultProps(){
    return {isOriginalDate: false};
  },
  _onDateSelectorChanged(){

  },
  wrapDropdownMenu(menuProps, containerWidth){
    return <div className='jazz-energy-container-has-absolute-container' style={{width:containerWidth}}>
            <div className='jazz-full-border-dropdownmenu-container'>
              <DropDownMenu {...menuProps} />
            </div>
          </div>;
  },
  getCompareDatePart(){
    let me = this,
        relativeType = this.props.relativeType;
    if(relativeType === MultipleTimespanStore.getCustomerizeType()){
      let {startDate, endDate} = this.props;
      return <DateTimeSelector ref='dateTimeSelector' startDate={startDate} endDate={endDate} _onDateSelectorChanged={me._onDateSelectorChanged}/> ;
    }else{
      let availableRelativeValues = MultipleTimespanStore.getAvailableRelativeValues(relativeType);
      let uom = MultipleTimespanStore.getRelativeUOM(relativeType);
      let menuItems = availableRelativeValues.map((value)=>{ return {value: value, text: value}; });

      return <div style={{display:'flex'}}>
                <div style={{margin:'auto 10px'}}>之前第</div>
                {me.wrapDropdownMenu({menuItems:menuItems, style:{width:'60px'}}, '62px')}
                <div style={{margin:'auto 10px'}}>{uom}</div>
                <span>{this.props.dateDescription}</span>
              </div>;
    }
  },
  render(){
    let me = this, dateEl = null;
    let menuItems = MultipleTimespanStore.getRelativeItems();
    let {startDate, endDate} = this.props;
    if(this.props.isOriginalDate){
      dateEl = <DateTimeSelector ref='dateTimeSelector' startDate={startDate} endDate={endDate} _onDateSelectorChanged={me._onDateSelectorChanged}/> ;
    }else{
      dateEl = me.getCompareDatePart();
    }

    let relativeTypeEl = me.wrapDropdownMenu({ menuItems:menuItems,
                           style:{width:'92px'},
                           selectedIndex:MultipleTimespanStore.getRelativeTypes().indexOf(me.props.relativeType)
                         }, '100px');
    return <div style={{marginTop: '10px'}}>
              <div>{this.props.title}</div>
              <div style={{display:'flex', marginTop:'5px'}}>
                {relativeTypeEl}
                <div> {dateEl} </div>
              </div>
            </div>;
  }
});

let AddIntervalWindow = React.createClass({
  _onAction(action){
    if(action === 'draw'){
      if(this.props.onMultipleTimeSubmit){
        this.props.onMultipleTimeSubmit();
      }
    }else{

    }
    this.props.analysisPanel.setState({showAddIntervalDialog: false});
  },
  render(){
    let me = this;
    let relativeList = MultipleTimespanStore.getRelativeList();
    let timeSpanEls = relativeList.map((item)=>{
      return <TimespanItem {...item}></TimespanItem>;
    });

    let _buttonActions = [<FlatButton
          label="绘制"
          onClick={me._onAction.bind(me, 'draw')} />,
          <FlatButton
          label="放弃"
          onClick={me._onAction.bind(me, 'cancel')} />];

    let dialog = <Dialog {...me.props} title='历史对比' actions={_buttonActions} contentStyle={{width:'768px'}} modal={true}>
                    <div style={{height:'300px'}}>
                      {timeSpanEls}
                      <LinkButton  label='添加时间段' labelStyle={{display: 'inline-block', marginTop:'10px'}}/>
                    </div>
                  </Dialog>;

    return <div>
             {dialog}
           </div>;
  }
});
module.exports = AddIntervalWindow;
