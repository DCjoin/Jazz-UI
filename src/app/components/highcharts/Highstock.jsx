'use strict';


let React = require('react');
let assign = require('object-assign');

let Highcharts = window.Highcharts;

let _paper = null;

let Highstock = React.createClass({

    _paper: null,

    propTypes: {
        options: React.PropTypes.object,
        onDeleteButtonClick: React.PropTypes.func,
        onDeleteAllButtonClick: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            options: {}
        };
    },

    componentDidMount  () {
      this._draw();
    },

    componentDidUpdate () {
      this._draw();
    },

    render () {
        return <div style={{flex:1, width:'100%'}} className="pop-chart-paper" ref="jazz_energy_view"/>;
    },

    _draw () {

        let that = this,
            options = assign({}, that.props.options, {
                chart: assign({}, that.props.options.chart, {renderTo: this.refs.jazz_energy_view.getDOMNode()})
            });

        that._paper = new Highcharts.StockChart(options);
        this.bindChartObjEvents();

        this.props.afterChartCreated(that._paper);
    },
    bindChartObjEvents(){
      var me = this;
      this._paper.bind('deleteButtonClick', me._onDeleteButtonClick.bind(me));
      this._paper.bind('deleteAllButtonClick', me._onDeleteAllButtonClick.bind(me));
      this._paper.bind('ignorealarm', me._ignoreAlarmEvent.bind(me));
    },
    _onDeleteButtonClick(obj){
      if(this.props.onDeleteButtonClick){
        this.props.onDeleteButtonClick(obj);
      }
    },
    _onDeleteAllButtonClick(){
      if(this.props.onDeleteAllButtonClick){
        this.props.onDeleteAllButtonClick();
      }
    },
    _ignoreAlarmEvent(obj){
      if(this.props.onIgnoreAlarmEvent){
        this.props.onIgnoreAlarmEvent(obj);
      }
    },
    getPaper() {
        return this._paper;
    }

});

module.exports = Highstock;
