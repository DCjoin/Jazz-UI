'use strict';

import React from "react";
import TagStore from '../../../stores/customerSetting/TagStore.jsx';
import CommonFuns from '../../../util/Util.jsx';
let d2j = CommonFuns.DataConverter.JsonToDateTime;
let dateItem = [];
let ListItem = React.createClass({
  propTypes: {
    time: React.PropTypes.string,
    data: React.PropTypes.object,
    onClick: React.PropTypes.func,
  },
  render: function() {
    let color;
    if (this.props.data.get('DataQuality') === 9) {
      color = 'orange'
    } else {
      if (this.props.data.get('DataQuality') === 6 || this.props.data.get('DataQuality') === 8) {
        color = 'purple'
      } else {
        color = 'green'
      }
    }
    return (
      <div className='jazz-ptag-rawdata-list-item' onClick={this.props.onClick}>
        <div>{this.props.time}</div>
        <div style={{
        marginLeft: '50px',
        color: color
      }}>{this.props.data.get('DataValue')}</div>
      </div>
      )
  },
});
let RawDataList = React.createClass({
  propTypes: {
    isRawData: React.PropTypes.bool,
    step: React.PropTypes.number
  },
  _onScroll: function() {
    var el = this.refs.list.getDOMNode(),
      head = this.refs.header.getDOMNode();
    var scrollIndex = parseInt((el.scrollTop - 1) / 40);
    //set scrollTop to scroll el.scrollTop=500
    head.innerText = dateItem[scrollIndex];
  },
  _onItemClick: function(item) {},
  _renderListItems: function() {
    if (TagStore.getRawData().size === 0) return;
    var data = this.props.isRawData ? TagStore.getRawData() : TagStore.getDifferenceData(),
      energyData = data.getIn(['TargetEnergyData', 0, 'EnergyData']),
      Items = [],
      currentDate = null,
      firstDate = null,
      that = this;
    energyData.forEach((data, index) => {
      let str = CommonFuns.formatDateByStep(d2j(data.get('LocalTime')), null, null, this.props.step);
      let date = str.split(' ')[0],
        time = str.split(' ')[1];

      if (data.get('DataValue') !== null) {
        if (currentDate !== date && currentDate !== null) {
          Items.push(
            <div className="date" style={{
              height: '40px',
              minHeight: '40px'
            }}>{date}</div>
          );
          dateItem.push(date);
        }
        if (currentDate === null) {
          firstDate = date
        }
        currentDate = date;
        Items.push(
          <ListItem time={time} data={data} onClick={that._onItemClick.bind(this, {
            data,
            index
          })}/>
        )
        dateItem.push(date);
      }

    });
    let head = this.refs.header.getDOMNode();
    if (firstDate === null) {
      head.style.display = 'none';
    } else {
      head.style.display = 'flex';
      head.innerText = firstDate;
    }

    return (
      <div className="list" ref='list' onScroll={that._onScroll}>
        {Items}
      </div>
      )


  },
  _onChanged: function() {
    this.forceUpdate();
  },
  _onListItemSelected: function(index) {
    var el = this.refs.list.getDOMNode();
    el.scrollTop = (index - 1) * 41 + 150;
  },
  componentDidMount: function() {
    TagStore.addTagDatasChangeListener(this._onChanged);
    TagStore.addPointToListChangeListener(this._onListItemSelected);
  },
  componentWillUnmount: function() {
    TagStore.removeTagDatasChangeListener(this._onChanged);
    TagStore.removePointToListChangeListener(this._onListItemSelected);
  },
  render: function() {
    var label = this.props.isRawData ? I18N.EM.Ratio.RawValue : I18N.Setting.Tag.PTagRawData.DifferenceValue;
    return (
      <div className='jazz-ptag-rawdata-list'>
        <div className='title'>
          <div>{I18N.RawData.Time}</div>
          <div style={{
        marginLeft: '170px'
      }}>{label + '(' + I18N.Common.Glossary.UOM + ')'}</div>
        </div>
        <div className="date" ref='header'>
           </div>

             {this._renderListItems()}

      </div>
      )
  },
});
module.exports = RawDataList;
