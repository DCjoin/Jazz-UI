'use strict';

import React from "react";
import ReactDom from 'react-dom';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import TagStore from '../../../stores/customerSetting/TagStore.jsx';
import CommonFuns from '../../../util/Util.jsx';
import TagAction from '../../../actions/customerSetting/TagAction.jsx';
import classnames from "classnames";
import { List} from 'immutable';
let j2d = CommonFuns.DataConverter.JsonToDateTime;
let dateItem = [],
  indexItem = [];
let ListItem = React.createClass({
  propTypes: {
    isRawData:React.PropTypes.bool,
    time: React.PropTypes.string,
    data: React.PropTypes.object,
    onClick: React.PropTypes.func,
    isSelected: React.PropTypes.bool,
    onDataChange:React.PropTypes.func,
  },
  getInitialState(){
    return{
      isEdit:false,
      value:this.props.data.get('DataValue')
    }
  },
  _onClick(){
    this.setState({
      isEdit:true,
    },()=>{
      if(!this.props.isSelected){
        this.props.onClick();
      }
    })
  },

  render: function() {
    let color,
      time = this.props.time,
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

    if(this.state.isEdit && this.props.isRawData){
      value=<TextField
              id={`${this.props.time}_${this.state.value}`}
              value={this.state.value}
              style={{
                color:color
              }}
              underlineShow={this.props.isSelected}
              onChange={(event)=>{
                this.setState({
                  value:event.target.value
                })
              }}
              onBlur={()=>{
                if(this.state.value!==this.props.data.get('DataValue')){
                  this.props.onDataChange(this.state.value)
                }
              }}
              />
    }else {
      value=(
        <div style={{
        color: color
      }}>{this.props.data.get('DataValue')}</div>
      )
    }

    return (
      <div className={classnames({
        "jazz-ptag-rawdata-list-item": true,
        "selected": this.props.isSelected
      })} onClick={this._onClick}>
        <div style={{
        width: '122px'
      }}>{time}</div>
    {value}
        </div>
      )
  },
});

let RawDataList = React.createClass({
  propTypes: {
    isRawData: React.PropTypes.bool,
    step: React.PropTypes.number,
    onRawDataChange:React.PropTypes.func,
  },
  getInitialState: function() {
    return {
      selectedId: -1,
      isLoading:false
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
    //set scrollTop to scroll el.scrollTop=500
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
      if (firstDate === null) {
        head.style.display = 'none';
      } else {
        head.style.display = 'flex';
        head.innerText = firstDate;
      }
    }

    var style = {
      height: document.body.offsetHeight - 150
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
        <ListItem key={`${str}+${data}`} isRawData={this.props.isRawData} time={str} data={data} isSelected={this.state.selectedId === nId} onClick={that._onItemClick.bind(this, {
          data,
          nId
        })}
        onDataChange={(data)=>{this._onDataChange(data,index)}}/>
      )
      indexItem[nId] = index;
      nId++;

    });
    var style = {
      height: document.body.offsetHeight - 150
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
    //console.log('_list_index=' + index);
    if (index !== this.state.selectedId) {
      var el = ReactDom.findDOMNode(this.refs.list);
      var id = indexItem.indexOf(index);
      el.scrollTop = id * 40 + 1;
      this.setState({
        selectedId: index
      })
    }
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
    if (nextProps.step !== this.props.step) {
      let head = ReactDom.findDOMNode(this.refs.header);
      head.style.display = 'none';
    }
  },
  componentWillUnmount: function() {
    TagStore.removeTagDatasChangeListener(this._onChanged);
    TagStore.removePointToListChangeListener(this._onListItemSelected);
  },
  render: function() {
    var data = this.props.isRawData ? TagStore.getRawData() : TagStore.getDifferenceData(),
      uom = data.getIn(['TargetEnergyData', 0, 'Target', 'Uom']);
    var label = this.props.isRawData ? I18N.EM.Ratio.RawValue : I18N.Setting.Tag.PTagRawData.DifferenceValue;
    if(this.state.isLoading){
      return (<div className="jazz-ptag-rawdata-list flex-center"><CircularProgress  mode="indeterminate" size={80} /></div>)
    }else {
      return (
        <div className='jazz-ptag-rawdata-list'>
          <div className='title'>
            <div>{I18N.RawData.Time}</div>
            <div style={{
          marginLeft: '90px'
        }}>{label + '(' + uom + ')'}</div>
          </div>
          <div className="date" ref='header' style={{
          display: 'none'
        }}>
             </div>
               {this._renderListItems()}
        </div>
        )
    }

  },
});
module.exports = RawDataList;
