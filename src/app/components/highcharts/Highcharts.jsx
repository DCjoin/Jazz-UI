'use strict';


let React = require('react');
let ReactDOM = require('react-dom');
let assign = require('object-assign');
let classnames = require('classnames');

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
            options: this.props.options//JSON.stringify(this.props.options)
        });
    },

    componentDidMount  () {
      this._draw();
    },

    componentWillReceiveProps (nextProps) {
        this.setState({
            options: nextProps.options//JSON.stringify(nextProps.options)
        });
    },

    componentDidUpdate () {
      this._draw();
    },

    render () {
        return <div className={classnames('pop-chart-paper', {
            [this.props.className]: this.props.className,
        })} ref="jazz_energy_view"/>;
    },

    _draw () {
        let that = this,
            _tempOptions = that.state.options,
            options = assign({}, _tempOptions, {
                chart: assign({}, _tempOptions.chart, {renderTo: ReactDOM.findDOMNode(this.refs.jazz_energy_view)})
            });

        that._paper = new Highcharts.Chart(options);

        this.props.afterChartCreated(that._paper);
    },

    getPaper() {
        return this._paper;
    }

});

module.exports = Highstock;
