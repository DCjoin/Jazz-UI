'use strict';

import React from "react";
import { CircularProgress, FlatButton } from 'material-ui';
import TagAction from '../../../actions/customerSetting/TagAction.jsx';
import TagStore from '../../../stores/customerSetting/TagStore.jsx';
import { List } from 'immutable';
import DateTimeSelector from '../../../controls/DateTimeSelector.jsx';
import CommonFuns from '../../../util/Util.jsx';
function emptyList() {
  return new List();
}
let PTagRawData = React.createClass({
  propTypes: {
    selectedTag: React.PropTypes.object
  },
  getInitialState: function() {
    return ({
      tagData: null,
      isLoading: true,
      veeTagStatus: null,
      start: this._getInitDate().start,
      end: this._getInitDate().end
    })
  },
  _getInitDate: function() {
    let date = new Date();
    date.setHours(0, 0, 0);
    let last7Days = CommonFuns.dateAdd(date, -6, 'days');
    let endDate = CommonFuns.dateAdd(date, 1, 'days');
    return ({
      start: last7Days,
      end: endDate
    })
  },
  _getTagsData: function(props, refreshTagStatus = false) {
    let d2j = CommonFuns.DataConverter.DatetimeToJson,
      start = d2j(this.state.start, false),
      end = d2j(this.state.end, false);
    TagAction.getTagsData(props.selectedTag.get('Id'), props.selectedTag.get('CalculationStep'), start, end, refreshTagStatus);
    this.setState({
      isLoading: true,
    })
  },
  _onChanged: function() {
    this.setState({
      tagData: TagStore.getTagDatas(),
      isLoading: false,
      veeTagStatus: TagStore.getTagStatus(),
    })
  },
  _onDateSelectorChanged: function() {
    let that = this,
      dateSelector = this.refs.dateTimeSelector,
      timeRange = dateSelector.getDateTime();

    this.setState({
      start: timeRange.start,
      end: timeRange.end
    }, () => {
      that._getTagsData(this.props)
    })
  },
  componentDidMount: function() {
    TagStore.addTagDatasChangeListener(this._onChanged);
    this._getTagsData(this.props, true);
  },
  componentWillUnmount: function() {
    TagStore.removeTagDatasChangeListener(this._onChanged);
  },
  componentWillReceiveProps: function(nextProps) {
    var that = this;
    if (nextProps.selectedTag !== this.props.selectedTag) {
      that.setState({
        start: this._getInitDate().start,
        end: this._getInitDate().end
      }, () => {
        that._getTagsData(nextProps, true)
      })
    }
  },
  render: function() {
    var btn = <FlatButton label="Default" style={{
      border: '1px solid black'
    }}/>;
    if (this.state.isLoading) {
      return (
        <div style={{
          display: 'flex',
          flex: 1,
          'alignItems': 'center',
          'justifyContent': 'center'
        }}>
                    <CircularProgress  mode="indeterminate" size={2} />
                  </div>
        )

    } else {
      return (
        <div className='jazz-ptag-rawdata'>
          <div className='jazz-ptag-rawdata-toolbar'>
            <div className='leftside'>
            <DateTimeSelector ref='dateTimeSelector' endLeft='-100px' startDate={this.state.start} endDate={this.state.end} _onDateSelectorChanged={this._onDateSelectorChanged}/>
            </div>
            <div className='rightside'>
              {this.state.veeTagStatus.size === 0 ? null : btn}
            </div>
          </div>

        </div>
        )
    }


  },

});
module.exports = PTagRawData;
