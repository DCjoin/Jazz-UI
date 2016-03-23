'use strict';

import React from "react";
import TagStore from '../../../stores/customerSetting/TagStore.jsx';
import CommonFuns from '../../../util/Util.jsx';
import TagAction from '../../../actions/customerSetting/TagAction.jsx';
import classnames from "classnames";
//let j2d = CommonFuns.DataConverter.JsonToDateTime;
let dateItem = [],
  indexItem = [];
let ListItem = React.createClass({
  propTypes: {
    time: React.PropTypes.string,
    data: React.PropTypes.object,
    onClick: React.PropTypes.func,
    isSelected: React.PropTypes.bool,
  },
  render: function() {
    let color,
      time = this.props.time;
    if (this.props.data.get('DataQuality') === 9) {
      color = '#f46a58'
    } else {
      if (this.props.data.get('DataQuality') === 6 || this.props.data.get('DataQuality') === 8) {
        color = '#cfa9ff'
      } else {
        color = '#11d9db'
      }
    }
    if (time) {
      if (time.indexOf('点') > -1) {
        time = time.replace(/点/g, ':');
      }
      if (time.indexOf('分') > -1) {
        time = time.replace(/分/g, '');
      }
    }


    return (
      <div className={classnames({
        "jazz-ptag-rawdata-list-item": true,
        "selected": this.props.isSelected
      })} onClick={this.props.onClick}>
        <div>{time}</div>
        <div style={{
        marginLeft: '50px',
        color: color
      }}>{this.props.data.get('DataValue')}+'____'+{this.props.pId}</div>
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
    var el = this.refs.list.getDOMNode(),
      head = this.refs.header.getDOMNode();
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
  _renderListItems: function() {
    if (TagStore.getRawData().size === 0) return;
    var data = this.props.isRawData ? TagStore.getRawData() : TagStore.getDifferenceData(),
      energyData = data.getIn(['TargetEnergyData', 0, 'EnergyData']),
      Items = [],
      currentDate = null,
      firstDate = null,
      pId = 0,
      nId = 0,
      that = this;

    energyData.forEach((data, index) => {
      let str = CommonFuns.formatDateByStep(TagStore.translateDate(data.get('LocalTime'), null, this.props.step), null, null, this.props.step);
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
        <ListItem time={time} data={data} isSelected={this.state.selectedId === nId} pId={pId} onClick={that._onItemClick.bind(this, {
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
      let head = this.refs.header.getDOMNode();
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
  _onChanged: function(flag) {
    if (flag !== false) {
      dateItem = [];
      indexItem = [];
      if (this.refs.list) {
        var el = this.refs.list.getDOMNode();
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
      var el = this.refs.list.getDOMNode();
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
        var el = this.refs.list.getDOMNode();
        el.scrollTop = 0;
      }
      this.setState({
        selectedId: -1
      })
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
        <div className="date" ref='header'>
           </div>
             {this._renderListItems()}
      </div>
      )
  },
});
module.exports = RawDataList;
