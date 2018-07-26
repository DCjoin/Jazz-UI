'use strict';

import React from "react";
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
import {FlatButton, Drawer, FontIcon} from 'material-ui';
import CircularProgress from 'material-ui/CircularProgress';
import TagAction from 'actions/customerSetting/TagAction.jsx';
import TagStore from 'stores/customerSetting/TagStore.jsx';
import CommonFuns from '../../util/Util.jsx';
import classnames from "classnames";
import { List} from 'immutable';
import Regex from '../../constants/Regex.jsx';
// import { inherits } from "../../../../node_modules/util";
var createReactClass = require('create-react-class');

function isValid(number){
  if(number===null || number==="") return true;
  //非数字
  if(!CommonFuns.isNumeric(number)) return false;

  //前9后6
  if(!Regex.TagRule.test(number*1)) return false;

  return true
}

let j2d = CommonFuns.DataConverter.JsonToDateTime;
let dateItem = [],
  indexItem = [];
let ListItem = createReactClass({
  propTypes: {
    isRawData:PropTypes.bool,
    time: PropTypes.string,
    data: PropTypes.object,
    onClick: PropTypes.func,
    isSelected: PropTypes.bool,
    onDataChange:PropTypes.func,
  },
  getInitialState(){
    return{
      isEdit:false,
      value:this.props.data.get('DataValue'),
      errorText:'',
      hover: false
    }
  },
  _onClick(){
    this.setState({
      isEdit:true,
      hover: false,
      errorText:''
    },()=>{
      if(!this.props.isSelected){
        this.props.onClick();
      }
    })
  },
  _onMouseEnter(){
    this.setState({
        hover: true
    });
  },
  _onMouseLeave(){
    this.setState({
        hover: false
    })
  },
  componentWillReceiveProps(nextProps){
    if(nextProps.isSelected!==this.props.isSelected && !nextProps.isSelected){
      this.setState({
        isEdit:false,
        errorText: ''
      })
    }
  },
  render: function() {
    let color,
      time = this.props.time,
      that = this,
      inputStyle,
      value;
    if (this.props.data.get('DataQuality') === 9) {
      color = '#f46a58'
    } else {
      if (this.props.data.get('DataQuality') === 6 || this.props.data.get('DataQuality') === 8) {
        color = '#cfa9ff'
      } else {
        color = '#464949'
      }
    }
    if (this.state.errorText) {
      inputStyle = '1px solid #dc0a0a';
    } else {
      inputStyle = '1px solid #32ad3c';
    }
    // isRawData为true表示原始值
    if(this.state.isEdit && this.props.isRawData && this.props.isSelected){
      value= <input
              id={`${this.props.time}_${this.state.value}`}
              value={this.state.value}
              autofocus={'autofocus'}
              style={{
                width: '138px',
                height: '28px',
                borderRadius: '2px',
                border: inputStyle,
                backgroundColor: '#fff',
                outline: 'none'
              }}
              onChange={(event)=>{
                this.setState({
                  value:event.target.value
                })
              }}
              onBlur={()=>{
                if(this.state.value !== this.props.data.get('DataValue')){
                  if(isValid(this.state.value)){
                    that.setState({
                      errorText:''
                    },()=>{
                      that.props.onDataChange(that.state.value)
                    })
                  }else {
                    this.setState({
                      errorText: I18N.VEE.ErrorMsg
                    })
                  }

                }
              }}
              />
    } else {
      value=(
        <div style={{color: color, textAlign: 'center'}}>{(this.props.data.get('DataValue') || this.props.data.get('DataValue') == 0) ? this.props.data.get('DataValue') : '-'}</div>
      )
    }
    return (
      <div className={classnames({ "jazz-ptag-rawdata-list-item": true,"selected": this.props.isSelected})}
          onMouseEnter={() => {!this.state.isEdit ? this._onMouseEnter() : null}}
          onMouseLeave={() => {!this.state.isEdit ? this._onMouseLeave() : null}}
          >
        <div style={{width: '110px'}}>{time}</div>
        <div className="line-data-wrap">
          {
            this.state.errorText
            ? <div className="errortips">{this.state.errorText}</div>
            : null
          }
            {value}
        </div>
        {
          // 原始值的时候才可编辑，差值不显示编辑icon
          this.state.hover && this.props.isRawData
          ? <FontIcon className='icon-edit'  onClick={this._onClick} />
          : null
        }
      </div>
      )
  },
});

let NewRawDataList = createReactClass({
  propTypes: {
    isRawData: PropTypes.bool,
    step: PropTypes.number,
    onRawDataChange:PropTypes.func,
    rollBack:PropTypes.func,
    selectedTag: PropTypes.object,
    openDrawer: PropTypes.bool
  },
  getInitialState: function() {
    return {
      selectedId: -1,
      isLoading:false,
    }
  },
  _setLoading:function(){
    this.setState({
      isLoading:true
    })
  },
  _onScroll: function() {
    var el = ReactDom.findDOMNode(this.refs.list),
      head = ReactDom.findDOMNode(this.refs.header);
    var scrollIndex = parseInt(el.scrollTop / 40);
    head.innerText = dateItem[scrollIndex];
  },
  _onItemClick: function(item) {
    TagAction.selectListToPonit(item.nId);
    this.setState({
      selectedId: item.nId
    })
  },
  _onDataChange(data,index){
    var orgRawData=TagStore.getRawData();
    var editRawData=orgRawData.getIn(['TargetEnergyData', 0, 'EnergyData',index]);
    orgRawData=orgRawData.setIn(['TargetEnergyData', 0, 'EnergyData'],List.of(editRawData));
    editRawData=editRawData.set('DataValue',data);
    var newRawData=orgRawData.setIn(['TargetEnergyData', 0, 'EnergyData'],List.of(editRawData));
    this.setState({
      isLoading:true
    },()=>{
        this.props.onRawDataChange(newRawData.toJS(),orgRawData.toJS());
    })
  },
  _renderCalendarItems: function(energyData) {
    var Items = [],
      currentDate = null,
      firstDate = null,
      pId = 0,
      nId = 0,
      that = this;
    energyData.forEach((data, index) => {
      let str = CommonFuns.formatDateValueForRawData(j2d(data.get('UtcTime')), this.props.step);
      let date = str.split(' ')[0],
        time = str.split(' ')[1];
      if (currentDate !== date && currentDate !== null) {
        Items.push(
          <div className="date">{date}</div>
        );
        dateItem.push(date);
        pId++;
      }
      if (currentDate === null) {
        firstDate = date
      }
      currentDate = date;
      Items.push(
        <ListItem key={`${time}+${data}`} isRawData={this.props.isRawData} time={time} data={data} isSelected={this.state.selectedId === nId} pId={pId}
          onClick={that._onItemClick.bind(this, {
          data,
          nId
        })}
        onDataChange={(data)=>{this._onDataChange(data,index)}}/>
      )
      indexItem[pId] = index;
      pId++;
      dateItem.push(date);
      nId++;
    });
    if (this.refs.header) {
      let head = ReactDom.findDOMNode(this.refs.header);

          head.innerText = firstDate;

    }

    var style = {
      height: document.body.offsetHeight - 85
    };
    return (
      <div className="list" ref='list' style={style} onScroll={that._onScroll}>
          {Items}
        </div>
      )
  },
  _renderNormalItems: function(energyData) {
    var Items = [],
      nId = 0,
      that = this;
    energyData.forEach((data, index) => {
      let str = CommonFuns.formatDateValueForRawData(j2d(data.get('UtcTime')), this.props.step);

      Items.push(
        <ListItem key={`${str}+${data}`}
                  isRawData={this.props.isRawData}
                  time={str}
                  data={data}
                  isSelected={this.state.selectedId === nId}
                  onClick={that._onItemClick.bind(this, {data,nId})}
                  onDataChange={(data)=>{this._onDataChange(data,index)}}/>
      )
      indexItem[nId] = index;
      nId++;

    });
    var style = {
      height: document.body.offsetHeight - 85
    };
    return (
      <div className="list" ref='list' style={style}>
          {Items}
        </div>
      )

  },
  _renderListItems: function() {
    if (TagStore.getRawData().size === 0) return;
    var data = this.props.isRawData ? TagStore.getRawData() : TagStore.getDifferenceData(),
      energyData = data.getIn(['TargetEnergyData', 0, 'EnergyData']),
      that = this;
      // step是什么意思
    if (this.props.step === 6 || this.props.step === 7 || this.props.step === 1) {
      return that._renderCalendarItems(energyData)
    } else {
      return that._renderNormalItems(energyData)
    }
  },
  _onChanged: function(flag) {
    if (flag !== false) {
      dateItem = [];
      indexItem = [];
      if (this.refs.list) {
        var el = ReactDom.findDOMNode(this.refs.list);
        el.scrollTop = 0;
      }
      this.setState({
        selectedId: -1,
        isLoading:false
      })
      this.forceUpdate();
    }
    else {
      this.setState({
        isLoading:false
      })
    }

  },
  _onListItemSelected: function(index) {
    if (index !== this.state.selectedId) {
      var el = ReactDom.findDOMNode(this.refs.list);
      var id = indexItem.indexOf(index);
      el.scrollTop = id * 40 + 1;
      this.setState({
        selectedId: index
      })
    }
  },
  _onNullRepair: function () {
    this.props.nullValRepair()
  },
   _onRollBack: function()  {
      this.props.rollBack();
  },
  componentDidMount: function() {
    TagStore.addTagDatasChangeListener(this._onChanged);
    TagStore.addPointToListChangeListener(this._onListItemSelected);
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.isRawData !== this.props.isRawData) {
      dateItem = [];
      indexItem = [];
      if (this.refs.list) {
        var el = ReactDom.findDOMNode(this.refs.list);
        el.scrollTop = 0;
      }
      this.setState({
        selectedId: -1
      })
    }
    // if (nextProps.step !== this.props.step) {
    //   let head = ReactDom.findDOMNode(this.refs.header);
    //   head.style.display = 'none';
    // }
  },
  componentWillUnmount: function() {
    TagStore.removeTagDatasChangeListener(this._onChanged);
    TagStore.removePointToListChangeListener(this._onListItemSelected);
  },
  render: function() {
    let disNullBtn;
    if (this.props.filterType == 2 || this.props.filterType == 4) {
      disNullBtn = true;
    } else {
      disNullBtn = false;
    }
    let data = this.props.isRawData ? TagStore.getRawData() : TagStore.getDifferenceData(),
      uom = data.getIn(['TargetEnergyData', 0, 'Target', 'Uom']);
      if(uom==="null") uom=""
          else uom='(' + uom + ')'
    // 自动修复按钮
    let labelStyle = {
        fontSize: '14px',
      },
      dislabelStyle = {
        fontSize: '14px',
        color: '#c0c0c0;'
      },
      autoRepairBtnStyle = {
        height: '40px',
        lineHeight:'40px',
        backgroundColor: '#ffffff',
        width: '50%',
        borderRight: '1px solid #d8d8d8'
      },
      rollbackBtnStyle = {
        height: '40px',
        lineHeight:'40px',
        backgroundColor: '#ffffff',
        width: '50%',
      };
    // 空值修复
    var nullValueBtn = <FlatButton  key={'autoRepairBtn'}
                                    label={I18N.Setting.VEEMonitorRule.AutoRepair}
                                    style={autoRepairBtnStyle}
                                    labelStyle={disNullBtn ? dislabelStyle : labelStyle}
                                    disabled={disNullBtn}
                                    onClick={this._onNullRepair}/>;
    // 撤销修复
  var rollbackBtn= <FlatButton
                      label={I18N.Setting.Tag.PTagRawData.RollBack}
                      style={rollbackBtnStyle}
                      labelStyle={labelStyle}
                      onClick={this._onRollBack}/>

    var label = this.props.isRawData ? I18N.EM.Ratio.RawValue : I18N.Setting.Tag.PTagRawData.DifferenceValue;
    if(this.state.isLoading){
      return (<div className="jazz-ptag-rawdata-list flex-center"><CircularProgress  mode="indeterminate" size={80} /></div>)
    }else {
      return (
      	<div className="drawer_wrap">
      		<Drawer width={283}
                  open={this.props.openDrawer}
                  openSecondary={true}
            >
	          <div
	            role="button"
	          >
	            <div className='jazz-ptag-rawdata-list' style={{width: '283px'}}>
                <div className='top-title'>
                  <span className="text">{I18N.Setting.Tag.PTagRawData.DataRepair}</span>
                  <span className="cancelBtn" onClick={this.props.onRequestChange}>X</span>
                </div>
                <div className='buttonGroup'>
                    {nullValueBtn}
                    {rollbackBtn}
                </div>
                <div className='veetitle'>
                  <div className="veedate" ref='header' style={{width: '110px'}}></div>
                  <div className="veedate">{label + uom}</div>
                </div>
                {this._renderListItems()}
		          </div>
	          </div>
	        </Drawer>
	    </div>
        )
    }
  },
});
module.exports = NewRawDataList;
