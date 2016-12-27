'use strict';

import React from "react";
import ReactDom from 'react-dom';
import TextField from 'material-ui/TextField';
import TagStore from '../../../stores/customerSetting/TagStore.jsx';
import CommonFuns from '../../../util/Util.jsx';
import TagAction from '../../../actions/customerSetting/TagAction.jsx';
import classnames from "classnames";
let j2d = CommonFuns.DataConverter.JsonToDateTime;
let dateItem = [],
  indexItem = [];
let ListItem = React.createClass({
  propTypes: {
    time: React.PropTypes.string,
    data: React.PropTypes.object,
    onClick: React.PropTypes.func,
    isSelected: React.PropTypes.bool,
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
    // if(this.props.isSelected){
    //   this.setState({
    //     isEdit:true,
    //   })
    // }else {
    //   this.setState({
    //     isEdit:false,
    //   },()=>{
    //     this.props.onClick();
    //   })
    //   e.stopPropagation();
    // }
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

    if(this.state.isEdit){
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
                console.log('***wyh***onBlur***');
              }}
              />
    }else {
      value=(
        <div style={{
        color: color
      }}>{this.props.data.get('DataValue')}</div>

      )
    }

    // value=<TextField
    //         id={`${this.props.time}_${this.state.value}`}
    //         value={this.state.value}
    //         style={{
    //           color:color
    //         }}
    //         underlineShow={this.state.isEdit}
    //         onChange={(event)=>{
    //           this.setState({
    //             value:event.target.value
    //           })
    //         }}
    //         onBlur={()=>{
    //           console.log('***wyh***onBlur***');
    //         }}
    //         />

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
    step: React.PropTypes.number
  },
  getInitialState: function() {
    return {
      selectedId: -1
    }
  },
  _onScroll: function() {
    var el = ReactDom.findDOMNode(this.refs.list),
      head = ReactDom.findDOMNode(this.refs.header);
    var scrollIndex = parseInt(el.scrollTop / 41);
    //set scrollTop to scroll el.scrollTop=500
    head.innerText = dateItem[scrollIndex];
  },
  _onItemClick: function(item) {
    TagAction.selectListToPonit(item.nId);
    this.setState({
      selectedId: item.nId
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
      let str = CommonFuns.formatDateValueForRawData(j2d(data.get('LocalTime')), this.props.step);
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
        <ListItem key={`${time}+${data}+${new Date()}`} time={time} data={data} isSelected={this.state.selectedId === nId} pId={pId} onClick={that._onItemClick.bind(this, {
          data,
          nId
        })}/>
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
      let str = CommonFuns.formatDateValueForRawData(j2d(data.get('LocalTime')), this.props.step);

      Items.push(
        <ListItem time={str} data={data} isSelected={this.state.selectedId === nId} onClick={that._onItemClick.bind(this, {
          data,
          nId
        })}/>
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
        selectedId: -1
      })
      this.forceUpdate();
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
  },
});
module.exports = RawDataList;
