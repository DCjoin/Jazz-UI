'use strict';


let React = require('react');
let assign = require('object-assign');

let Highcharts = window.Highcharts;

let _paper = null;

let Highstock = React.createClass({

    _paper: null,

    propTypes: {
        // options: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            options: {}
        };
    },

    getInitialState() {
        return {
            options: {}
        };
    },

    componentWillMount () {
        this.setState({
            options: JSON.stringify(this.props.options)
        });
    },

    componentDidMount  () {
      this._draw();
    },

    componentWillReceiveProps (nextProps) {
        this.setState({
            options: JSON.stringify(nextProps.options)
        });
    },

    componentDidUpdate () {
      this._draw();
    },

    render () {
        return <div className="pop-chart-paper" ref="pop_chart_paper"/>;
    },

    _draw () {

        let that = this,
            _tempOptions = JSON.parse(that.state.options),
            options = assign({}, _tempOptions, {
                chart: assign({}, _tempOptions.chart, {renderTo: this.refs.pop_chart_paper.getDOMNode()})
            });

        that._paper = new Highcharts.Chart(options);
    },

    getPaper() {
        return this._paper;
    }

});

module.exports = Highstock;
