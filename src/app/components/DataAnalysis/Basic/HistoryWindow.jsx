'use strict';
import React, { Component }  from "react";
import {Dialog, DropDownMenu, FlatButton, IconButton} from 'material-ui';
import MenuItem from 'material-ui/MenuItem';
import NewDialog from 'controls/NewDialog.jsx';
import classSet from 'classnames';
import MultipleTimespanStore from 'stores/energy/MultipleTimespanStore.jsx';
import DateTimeSelector from 'controls/DateTimeSelector.jsx';
import LinkButton from 'controls/LinkButton.jsx';
import MultiTimespanAction from 'actions/MultiTimespanAction.jsx';
import Immutable from 'immutable';
import moment from 'moment';
import CommonFuns from 'util/Util.jsx';

class TimespanItem extends Component{

  constructor(props) {
    super(props);
    this._onCompareItemRemove = this._onCompareItemRemove.bind(this);
    this._onRelativeTypeChange = this._onRelativeTypeChange.bind(this);
    this._onRelativeValueChange = this._onRelativeValueChange.bind(this);
    this._onDateSelectorChanged = this._onDateSelectorChanged.bind(this);
    // this._onHierachyTreeClick = this._onHierachyTreeClick.bind(this);
    // this._onTagNodeChange = this._onTagNodeChange.bind(this);

  }

  _onCompareItemRemove() {
    this.props.onCompareItemRemove(this.props.compareIndex);
  }

  wrapDropdownMenu(menuProps, containerWidth) {
  var labelStyle={fontSize:'12px',lineHeight:'32px',paddingRight:'0'};
  return <div className='jazz-energy-container-has-absolute-container' style={{
      width: containerWidth
    }}>
          <div className='jazz-full-border-dropdownmenu-container'>
            <DropDownMenu {...menuProps} labelStyle={labelStyle}>{menuProps.menuItems}</DropDownMenu>
          </div>
        </div>;
      }

  getCompareDatePart() {
      let me = this,
        relativeType = this.props.relativeType;
      if (relativeType === MultipleTimespanStore.getCustomerizeType()) {
        let {startDate, endDate} = this.props;
        // startDate = (!!startDate) ? startDate : new Date();
        // endDate = (!!endDate) ? endDate : new Date();

        return <DateTimeSelector ref='dateTimeSelector' showTime={true} isTimeFixed={true} startDate={startDate} endDate={endDate} _onDateSelectorChanged={me._onDateSelectorChanged}/>;
      } else {
        let availableRelativeValues = MultipleTimespanStore.getAvailableRelativeValues(relativeType);
        let uom = MultipleTimespanStore.getRelativeUOM(relativeType);
        let menuItems = availableRelativeValues.map((value) => {
          return(
            <MenuItem primaryText={value} value={value}/>
          );
        });

        return <div style={{
            display: 'flex'
          }}>
                  <div style={{
            margin: 'auto 10px auto 6px'
          }}>{I18N.MultipleTimespan.Before}</div>
                  {me.wrapDropdownMenu({
            menuItems: menuItems,
            style: {
              width: '60px'
            },
            value: me.props.relativeValue,
            onChange: me._onRelativeValueChange
          }, '62px')}
                  <div style={{
            margin: 'auto 10px'
          }}>{uom}</div>
                  <div style={{
            margin: 'auto'
          }}>{this.props.dateDescription}</div>
                </div>;
      }
    }
    getDisplayDate(time, isEndTime) {
      if (time !== null) {
        var hour = time.getHours();
        if (hour === 0 && isEndTime) {
          time = CommonFuns.dateAdd(time, -1, 'days');
          hour = 24;
        }
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var day = time.getDate();

        return year + '/' + month + '/' + day + ' ' + hour + ':00';
      } else {
        return '';
      }
    }
    render(){
        let me = this,
        dateEl = null,
        store = MultipleTimespanStore;
        let menuItems;
        let {startDate, endDate} = this.props;
        let deleteBtn = null;
        let relativeTypeEl;
        if (this.props.isOriginalDate) {
          menuItems = store.getRelativeItems();
        } else {
          menuItems = store.getCompareMenuItems();
        }

        if (this.props.isOriginalDate) {
            //dateEl = <DateTimeSelector ref='dateTimeSelector' showTime={true} startDate={startDate} endDate={endDate} _onDateSelectorChanged={me._onDateSelectorChanged}/> ;
            dateEl=this.getDisplayDate(startDate,false)+I18N.Setting.DataAnalysis.To+this.getDisplayDate(endDate,true)
          } else {
            dateEl = me.getCompareDatePart();
            deleteBtn = <IconButton iconClassName='icon-delete' iconStyle={{
                fontSize: '16px'
              }} onClick = {me._onCompareItemRemove}
              style={{
                'marginLeft': '10px',
                padding: '0px',
                height: '28px',
                width: '28px',
                lineHeight: '38px'
              }} />;
              relativeTypeEl = me.wrapDropdownMenu({
                menuItems: menuItems,
                style: {
                  width: '92px'
                },
                value: me.props.relativeType,
                onChange: me._onRelativeTypeChange
              }, '100px');
            }

            return <div style={{
                marginTop: '10px',
                height: '67px'
              }}>
                <div style={{
                    color: '#abafae'
                  }}>{this.props.title}</div>
                  <div style={{
                      display: 'flex',
                      marginTop: '10px',
                      position: 'absolute'
                    }}>
                    {relativeTypeEl}
                    <div> {dateEl} </div>
                    {deleteBtn}
                  </div>
                </div>;
              }

    _onRelativeTypeChange(e, selectedIndex, value) {
      let props = this.props;
      MultiTimespanAction.handleRelativeTypeChange(props.isOriginalDate, value, props.compareIndex);
    }

    _onRelativeValueChange(e, selectedIndex, value) {
      let me = this;
      MultiTimespanAction.handleRelativeValueChange(value, me.props.compareIndex);
    }

    _onDateSelectorChanged() {
      let me = this;
      let {isOriginalDate, compareIndex} = this.props;
      let dateSelector = this.refs.dateTimeSelector,
        dateRange = dateSelector.getDateTime(),
        startDate = dateRange.start,
        endDate = dateRange.end,
        _isStart = dateSelector.getTimeType();
      MultiTimespanAction.handleDateTimeSelectorChange(isOriginalDate, compareIndex, startDate, endDate, _isStart);
    }
  }

  TimespanItem.propTypes = {
    title: React.PropTypes.string,
    isOriginalDate: React.PropTypes.bool,
    relativeType: React.PropTypes.oneOf(MultipleTimespanStore.getRelativeTypes()),
    relativeValue: React.PropTypes.number,
    compareIndex: React.PropTypes.number, //对比时间编号，原始时间没有此参数
    startDate: React.PropTypes.object,
    endDate: React.PropTypes.object,
    dateDescription: React.PropTypes.string //对比时间段的文字时间
  };

  TimespanItem.defaultProps={
    isOriginalDate:false,
    value:1
  }

export default class HistoryWindow extends Component {

  constructor(props) {
		super(props);
		this._onAction = this._onAction.bind(this);
    this._onrelativeListChange = this._onrelativeListChange.bind(this);

	}

  _onAction(action) {
    let analysisPanel = this.props.analysisPanel;
    if (action === 'draw') {
      MultiTimespanAction.convert2Stable();
      analysisPanel._onSearchDataButtonClick(true);
    } else {
      MultiTimespanAction.clearMultiTimespan('temp');
    }
    this.props.onCancel()
  }

  _onrelativeListChange() {
    this.setState({
      relativeList: MultipleTimespanStore.getRelativeList()
    });
  }

  _addNewCompareItem() {
    MultiTimespanAction.addMultiTimespanData();
  }

  _removeCompareItem(compareIndex) {
    MultiTimespanAction.removeMultiTimespanData(compareIndex);
  }

  state= {
      relativeList: null
  }

  // componentWillMount(){
  //   let analysisPanel=this.props.analysisPanel;
  //   let relativeType = analysisPanel.state.relativeDate;
  //   let timeRange = analysisPanel.refs.dateTimeSelector.getDateTime();
  //   MultiTimespanAction.initMultiTimespanData(relativeType, timeRange.start, timeRange.end);
  // }

  componentDidMount() {
    MultipleTimespanStore.addChangeListener(this._onrelativeListChange);
    let analysisPanel=this.props.analysisPanel;
    let relativeType = analysisPanel.state.relativeDate;
    let timeRange = analysisPanel.refs.dateTimeSelector.getDateTime();
    console.log(timeRange.start);
    console.log(timeRange.end);
    MultiTimespanAction.initMultiTimespanData(relativeType, timeRange.start, timeRange.end);
  }

  componentWillUnmount() {
    MultipleTimespanStore.removeChangeListener(this._onrelativeListChange);
  }

  render(){
    let me = this;
    let relativeList = me.state.relativeList;
    let isAddBtnDisabled=false;
    let timeSpanEls;
    if(relativeList!==null){
      timeSpanEls = relativeList.map((item) => {
       return <TimespanItem {...item} onCompareItemRemove={me._removeCompareItem}></TimespanItem>;
     });
     isAddBtnDisabled = relativeList.length >= 5;
    }
    let _buttonActions = [<FlatButton
                            label={I18N.MultipleTimespan.Button.Draw}
                            onClick={me._onAction.bind(me, 'draw')} />,
                          <FlatButton
                            label={I18N.MultipleTimespan.Button.Cancel}
                            style={{
                              marginLeft: '10px'
                              }}
                              onClick={me._onAction.bind(me, 'cancel')} />];
    let dialog = <NewDialog {...me.props} title={I18N.MultipleTimespan.Title} titleStyle={{
                    fontSize: '20px',
                    padding: '24px 0 0 50px'
                    }} actions={_buttonActions} modal={true} open={true}
                    contentClassName='jazz-add-interval-dialog' style={{
                    overflow: 'auto'
                    }}>
                      <div style={{
                              height: '418px'
                            }}>
                                              {timeSpanEls}
                                              <LinkButton  label={I18N.MultipleTimespan.Add} labelStyle={{
                              display: 'inline-block',
                              marginTop: '10px'
                            }} onClick={me._addNewCompareItem} disabled={isAddBtnDisabled}/>
                                            </div>
                                          </NewDialog>;
    return <div>
            {dialog}
          </div>;
  }
}
