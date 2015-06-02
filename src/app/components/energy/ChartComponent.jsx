'use strict';

import React from 'react';
import assign from 'object-assign';
import Highstock from '../highcharts/Highstock.jsx';


const DEFAULT_OPTIONS = {
    chart: {
            animation: false
    },

    xAxis: {
        events: {
        }
    },

    yAxis: [],

    rangeSelector : {
        enabled: false
    },

    legend: {
        enabled: true,
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'top',
        shadow: true
    },

    plotOptions: {
        series: {
            events: {
                legendItemClick: function () {
                }
            }
        }
    },

    title : {
        text : ''
    },

    navigator: {
        adaptToUpdatedData: false,
        series: {
        }
    }
};

let ChartComponent = React.createClass({

    getInitialState() {
        return {

        };
    },

    componentWillMount() {
    },

    render () {

      let that = this;
      if(!this.props.data) {
          return null;
      }

      return (
          <div>
              <Highstock ref="highstock" options={that._generateOptions()}></Highstock>
          </div>
      );
  },
  _generateOptions() {
        let that = this,
            _options = assign({}, DEFAULT_OPTIONS);

        // Set navigator
        _options.navigator.series.data = that._getSeries(that.props.navigator, true);

        // Set series
        let data = _options.series = that._getSeries(that.props.data);

        // Set legendItemClick
        _options.plotOptions.series.events.legendItemClick = function(e) {
            that.props.unselected(that.props.dataNodes[e.target.index]);
            let currentSeries = that.refs.highstock.getPaper().series[e.target.index];
            if(currentSeries) {
                currentSeries.removePoint();
            }
        };

        // Set change starttime and interval
        _options.xAxis.events.afterSetExtremes = function(e) {
            if(e.trigger === "updatedData") {
                return false;
            }
            let chart = that.refs.highstock.getPaper();
            that.refs.highstock.getPaper().showLoading('Loading data from server...');
            if(e.trigger === "navigator") {
                that.props.changeStartTime((e.userMin / 1000).toFixed()*1);
            }
        };

        // Set xAxis range
        _options.xAxis.range = (data[data.length - 1][0] - data[0][0]) * 1000;

        // Set more y axis
        that.props.dataNodes.every(function(item, index) {

            _options.yAxis[index] = assign({}, _options.yAxis[index], {
                                        title: {
                                            text: item.unit
                                        },
                                        opposite: !!index
                                    });
            return !index;
        });

        return _options;
    },

    _getSeries(parameterData = [], isNavigator = false) {

        let that = this,
            series = [];
        if(isNavigator) {
            parameterData.forEach(function(element, index) {
                series.push([element.Time*1000, element.Value]);
            });
            return series;
        }

        parameterData.forEach(function(element, index) {
            let currentDode = {};
                that.props.dataNodes.every(function(dataNode) {
                    if(dataNode.Id == element.Id) {
                        currentDode = dataNode;
                        return false;
                    }
                    return true;
                });
            series.push({
                type: that.props.isColumnType ? 'column' : 'line',
                name: currentDode.Name,
                data: that._getSeries(element.ParameterData, true),
                tooltip: {
                    valueSuffix: currentDode.unit
                },
                yAxis: index % 2,
                marker : {
                    enabled : true
                }
            });
        });

        return series;
    }
});

module.exports = ChartComponent;
