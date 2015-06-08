'use strict';
import React from "react";
import mui from 'material-ui';

let { Dialog, DropDownMenu, FlatButton, TextField } = mui;

var _currentChartObj = null,
    _storedConfig = null;
let YaxisSelector = React.createClass({
  getInitialState() {
    return {};
  },
  _onYaxisClick(){
    if(this.props.initYaxisDialog){
      var chartObj = this.props.initYaxisDialog();
      _currentChartObj = chartObj;
      var config = this.getConfig4Dialog(chartObj);
      this.setState({yaxisConfig:config, storedConfig: _storedConfig});
      this.refs.yaxisDialog.show();
    }
  },
  getConfig4Dialog(chartObj){
    var config = {};
    if (chartObj.legend.allItems) {
        for (var i = 0, len = chartObj.legend.allItems.length; i < len; ++i) {
            var l = chartObj.legend.allItems[i];
            var yaxis = l.yAxis;
            var yc = config[yaxis.options.yname];
            if (!yc) {
                yc = [];
                config[yaxis.options.yname] = yc;
            }
            yc.push(l.name);
        }
    }
    else {
        var y = chartObj.yAxis[0].options.yname;
        config[y] = [];
    }
    return config;
  },
  _onDialogSubmit(ret){
    _storedConfig = ret;
    this.redraw();
  },
  render: function () {
    var me = this;
    return <div style={{'align-self': 'center'}}>
        <div className='jazz-energy-yaxis-button' onTouchTap={me._onYaxisClick}> {'Y坐标轴'} </div>
        <YaxisDialog yaxisConfig={me.state.yaxisConfig} storedConfig={me.state.storedConfig} onDialogSubmit={me._onDialogSubmit} ref='yaxisDialog'></YaxisDialog>
      </div>;
  },
  redraw: function () {
        var chart = _currentChartObj,
            yaxis = chart.yAxis;

        for (var i = 0, len = yaxis.length; i < len; i++) {
            //don't check navigator
            if (yaxis[i].series && yaxis[i].series.length == 1 && yaxis[i].series[0].name == 'Navigator') continue;

            var up = false;
            for (let j = 0; j < _storedConfig.length; j++) {
                if (yaxis[i].options.yname == _storedConfig[j].uom) {//navigator's yaxis donot have yTitle
                    yaxis[i].update({
                        max: _storedConfig[j].val[0],
                        min: _storedConfig[j].val[1]
                    }, false);
                    up = true;
                }
            }
            if (up === false) {
                //auto yaxis, should check series data
                var hasNeg = false;
                for (let j = 0; j < yaxis[i].series.length; ++j) {
                    var series = yaxis[i].series[j];
                    hasNeg = false;
                    for (var k = 0; k < series.yData.length; ++k) {
                        var y = series.yData[k];
                        if (y !== null && y < 0) {
                            hasNeg = true;
                            break;
                        }
                    }
                    if (hasNeg === true) {
                        break;
                    }
                }

                yaxis[i].update({
                    max: undefined,
                    min: hasNeg === true ? undefined : 0
                }, false);
            }

        }
        chart.redraw();
    }

});

var YaxisDialog = React.createClass({
  _onDialogSubmit(){
    if (!this.validate()) {
        return;
    }

    var yaxisConfig = this.props.yaxisConfig;
    var ret = [];
    for (let key in yaxisConfig) {
      let uom = key;//key == 'undefined' ? '' : key;
      let maxValue = this.refs[uom+'_max'].getValue();
      let minValue = this.refs[uom+'_min'].getValue();
      if(maxValue === '' && minValue === ''){
        continue;
      }
      ret.push({ uom: uom, val: [maxValue, minValue] });
    }

    this.props.onDialogSubmit(ret);

    this.hide();
  },
  _onDialogCancel(){
    this.hide();
  },
  show(){
    this.refs.dialogWindow.show();
  },
  hide(){
    this.refs.dialogWindow.dismiss();
  },
  render(){
    var _buttonActions = [
            <FlatButton
            label="确定"
            secondary={true}
            onClick={this._onDialogSubmit} />,
            <FlatButton
            label="取消"
            primary={true}
            onClick={this._onDialogCancel} />
        ];

    var yaxisConfig = this.props.yaxisConfig;
    var groups = [];
    var i = 1;

    for (var key in yaxisConfig) {
      var uom = key; //== 'undefined' ? '' : key;
      let storedConfigItem = this.getStoredConfigItemByUOM(uom, this.props.storedConfig);
      let maxStored = (!!storedConfigItem)? storedConfigItem.val[0] : null;
      let minStored = (!!storedConfigItem)? storedConfigItem.val[1] : null;
      let group = <div>
        <div> {'Y坐标轴' + i} </div>
        <div> <span>{'相关数据点:'}</span> <span> {yaxisConfig[key].join(',')}</span></div>
        <div> <span>{'最大值:'}</span> <TextField hintText="自动" ref={uom+'_max'} value = {maxStored}/><span>{uom}</span></div>
        <div> <span>{'最小值:'}</span> <TextField hintText="自动" ref={uom+'_min'} value = {minStored}/><span>{uom}</span></div>
      </div>;

        ++i;
        groups.push(group);
    }

    var dialog = <Dialog  title="Y坐标轴设置"  actions={_buttonActions} modal={false} ref="dialogWindow">
      {groups}
    </Dialog>;

    return dialog;
  },
  getStoredConfigItemByUOM(uom, storedConfig){
    if(storedConfig){
      for(let i=0,len=storedConfig.length; i<len; i++){
        if(uom === storedConfig[i].uom){
          return storedConfig[i];
        }
      }
    }
    return null;
  },
  validate: function () {
    var yaxisConfig = this.props.yaxisConfig;
    var flag = true;
    var i = 1;

    for (let key in yaxisConfig) {
      let uom = key == 'undefined' ? '' : key;
      let maxField = this.refs[uom+'_max'];
      let minField = this.refs[uom+'_min'];

      if(maxField.getValue()==='' && minField.getValue()===''){
        //flag = false;
        continue;
      }else if(maxField.getValue()===''){
        maxField.setErrorText('必填项。');
        flag = false;
      }else if(minField.getValue()===''){
        minField.setErrorText('必填项。');
        flag = false;
      }
    }
    return flag;
    }
});

module.exports = YaxisSelector;
