'use strict';

import EnergyChartStore from '../../stores/EnergyChartStore.jsx';

let React = require('react');
let assign = require('object-assign');

let Highcharts = window.Highcharts;

let _paper = null;

let Highstock = React.createClass({

  _paper: null,

  propTypes: {
    options: React.PropTypes.object,
    onDeleteButtonClick: React.PropTypes.func,
    onDeleteAllButtonClick: React.PropTypes.func,
    onSwitchChartTypeButtonClick: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      options: {}
    };
  },

  componentDidMount() {
    EnergyChartStore.addRedrawListener(this._draw);

    this._draw();
  },
  componentWillUnmount: function() {
    EnergyChartStore.removeRedrawListener(this._draw);
  },
  componentDidUpdate() {
    this._draw();
  },

  render() {
    return <div style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden'
      }} className="pop-chart-paper" ref="jazz_energy_view"></div>;
  },

  _draw() {

    let that = this,
      options = assign({}, that.props.options, {
        chart: assign({}, that.props.options.chart, {
          renderTo: this.refs.jazz_energy_view.getDOMNode()
        })
      });

    that._paper = new Highcharts.StockChart(options);
    this.bindChartObjEvents();

    this.props.afterChartCreated(that._paper);
  },
  bindChartObjEvents() {
    var me = this;
    this._paper.bind('deleteButtonClick', me._onDeleteButtonClick);
    this._paper.bind('deleteAllButtonClick', me._onDeleteAllButtonClick);
    this._paper.bind('ignorealarm', me._ignoreAlarmEvent);
    this._paper.bind('legendItemClick', me._onLegendItemClick);
    this._paper.bind('switchChartTypeButtonClick', me._onSwitchChartTypeButtonClick);
  },
  _onLegendItemClick(obj) {
    if (this.props.onLegendItemClick) {
      this.props.onLegendItemClick(obj);
    }
  },
  _onSwitchChartTypeButtonClick(obj) {
    if (this.props.onSwitchChartTypeButtonClick) {
      this.props.onSwitchChartTypeButtonClick(obj.chartType, obj.seriesItem);
    }
  },
  _onDeleteButtonClick(obj) {
    if (this.props.onDeleteButtonClick) {
      this.props.onDeleteButtonClick(obj);
    }
  },
  _onDeleteAllButtonClick() {
    if (this.props.onDeleteAllButtonClick) {
      this.props.onDeleteAllButtonClick();
    }
  },
  _ignoreAlarmEvent(obj) {
    if (this.props.onIgnoreAlarmEvent) {
      this.props.onIgnoreAlarmEvent(obj);
    }
  },
  getPaper() {
    return this._paper;
  },
  showCalendar: function(range) {
    if (!range) return;
    let chartObj = this.getPaper();
    if (!chartObj) return;
    for (var i = 0, len = range.length; i < len; ++i) {
      chartObj.xAxis[0].addPlotBand(range[i]);
    }
  },
  hideCalendar: function(ids) {
    let chartObj = this.getPaper();
    if (!chartObj) return;
    if (ids) {
      for (var i = 0; i < ids.length; ++i) {
        chartObj.xAxis[0].removePlotBand(ids[i]);
        if (chartObj.xAxis[0].userOptions && chartObj.xAxis[0].userOptions.plotBands) {
          var opts = chartObj.xAxis[0].userOptions.plotBands;
          opts.forEach((item, index) => {
            if (item && ids[i] == item.id) {
              opts.splice(index, 1);
            }
          });
        }
      }
    }
  }

});

module.exports = Highstock;
