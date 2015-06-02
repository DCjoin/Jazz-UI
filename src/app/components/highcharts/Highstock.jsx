'use strict';


let React = require('react');
let assign = require('object-assign');

let Highcharts = window.Highcharts;

let _paper = null;

let Highstock = React.createClass({

    _paper: null,

    propTypes: {
        options: React.PropTypes.object
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
        return <div className="pop-chart-paper" ref="jazz_energy_view"/>;
    },

    _draw () {

        let that = this,
            options = assign({}, that.props.options, {
                chart: assign({}, that.props.options.chart, {renderTo: this.refs.jazz_energy_view.getDOMNode()})
            });

        that._paper = new Highcharts.StockChart(options);
    },

    getPaper() {
        return this._paper;
    }

});

module.exports = Highstock;
