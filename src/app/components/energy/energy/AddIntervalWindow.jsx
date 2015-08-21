import React from 'react';
import mui from 'material-ui';
import classSet from 'classnames';
import MultipleTimespanStore from '../../../stores/MultipleTimespanStore.jsx';
import LinkButton from '../../../controls/LinkButton.jsx';
let { Dialog, DropDownMenu, FlatButton, TextField,Mixins} = mui;

let TimespanItem = React.createClass({
  propTypes:{
    title:  React.PropTypes.string,
    isOranginalDate: React.PropTypes.bool,
    relativeType: React.PropTypes.oneOf(MultipleTimespanStore.getRelativeType()),
    relativeValue: React.PropTypes.number,
    startDate: React.PropTypes.object,
    endDate: React.PropTypes.object,
    dateDescription: React.PropTypes.string//对比时间段的文字时间
  },
  getDefaultProps(){
    return {isOranginalDate: false};
  },
  _onDateSelectorChanged(){

  },
  getCompareDatePart(){
    if(relativeType === MultipleTimespanStore.getCustomerizeType()){
      return <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={me._onDateSelectorChanged}/> ;
    }else{
      let availableRelativeValues = MultipleTimespanStore.getAailableRelativeValues();
      let uom = MultipleTimespanStore.getRelativeUOM();
      let menuItems = availableRelativeValues.map((value)=>{ return {value: value, text: value}; });

      return <div> <span>之前第</span> <DropDownMenu menuItems={menuItems} /> <span>{uom}</span><span>{this.props.dateDescription}</span></div>;
    }
  },
  render(){
    let me = this, dateEl = null;
    let relativeTypes = MultipleTimespanStore.getRelativeType();
    let menuItems = relativeTypes.map((type)=>{
      return {value: type, text: I18N.Common.DateRange[type]};
    });
    if(this.props.isOranginalDate){
      dateEl = <DateTimeSelector ref='dateTimeSelector' _onDateSelectorChanged={me._onDateSelectorChanged}/> ;
    }else{
      dateEl = me.getCompareDatePart();
    }
    return <div>
            <div>
              <div>{this.props.title}</div>
              <div> <DropDownMenu menuItems={menuItems} /> </div>
              <div>
                {dateEl}
              </div>
            </div>
          </div>;
  }
});

let AddIntervalWindow = React.createClass({
  getInitialState(){
    return {destroyed: false};
  },
  _onAction(action){
    if(action === 'draw'){
      if(this.props.onMultipleTimeSubmit){
        this.props.onMultipleTimeSubmit();
      }
    }else{

    }
    this.setState({destroyed: true});
  },
  render(){
    if(this.state.destroyed){
      return null;
    }
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

    let dialog = <Dialog
      title='历史对比'
      actions={standardActions}
      contentStyle={{width:'768px'}}
      modal={true}>
      {timeSpanEls}
      <LinkButton  label='添加时间段'/>
    </Dialog>;

    return <div>
             {dialog}
           </div>;
  }
});
module.exports = AddIntervalWindow;
