'use strict';
import React from "react";
import mui from 'material-ui';

import CommonFuns from '../../util/Util.jsx';

let {isNumeric} = CommonFuns;
let { Dialog, DropDownMenu, FlatButton, TextField, FontIcon } = mui;

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
      this.setState({yaxisConfig:config, storedConfig: _storedConfig, showDialog: true});
    }
  },

  componentDidUpdate(){
    if(this.state.showDialog){
      this.refs.yaxisDialog.show();
      this.refs.yaxisDialog.initDefaultValues();
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
  onYaxisDialogDismiss(){
    this.setState({showDialog: false});
  },
  _onDialogSubmit(ret){
    _storedConfig = ret;
    this.redraw();
  },
  render: function () {
    var me = this;
    return <div style={{'align-self': 'center'}}>
        <div className='jazz-energy-yaxis-button' onTouchTap={me._onYaxisClick}> {'Y坐标轴'} </div>
        <YaxisDialog yaxisConfig={me.state.yaxisConfig} storedConfig={me.state.storedConfig}
          onDialogSubmit={me._onDialogSubmit} ref='yaxisDialog' onYaxisDialogDismiss={me.onYaxisDialogDismiss}></YaxisDialog>
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
      let maxValue = this.refs[uom+'_pair'].refs[uom+'_max'].getValue();
      let minValue = this.refs[uom+'_pair'].refs[uom+'_min'].getValue();
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
  _onRemoveAllClick(){
    var yaxisConfig = this.props.yaxisConfig;
    for (var key in yaxisConfig) {
      let uom = key;
      let maxField = this.refs[uom+'_pair'].refs[uom+'_max'];
      let minField = this.refs[uom+'_pair'].refs[uom+'_min'];

      maxField.setValue('');
      minField.setValue('');

      maxField.setErrorText();
      minField.setErrorText();
    }
  },
  show(){
    this.refs.dialogWindow.show();
  },
  hide(){
    this.refs.dialogWindow.dismiss();
  },
  onYaxisDialogDismiss(){
    if(this.props.onYaxisDialogDismiss){
      this.props.onYaxisDialogDismiss();
    }
  },
  render(){
    var _buttonActions = [
            <FlatButton
              label="保存"
              secondary={true}
              onClick={this._onDialogSubmit} />,
            <FlatButton
              label="放弃"
              primary={true}
              onClick={this._onDialogCancel} style={{marginRight:'420px'}}/>,

            <FlatButton secondary={true} style={{marginRight:'20px'}} onClick={this._onRemoveAllClick}>
               <FontIcon className="fa fa-trash-o"/>
               <span>{'全部清除'}</span>
            </FlatButton>
        ];

    var yaxisConfig = this.props.yaxisConfig;
    var groups = [];
    var i = 1;

    for (var key in yaxisConfig) {
      var uom = key; //== 'undefined' ? '' : key;
      let styleObj = {};
      if(i>1){
        styleObj ={marginTop:'40px'};
      }
      let group = <div style = {styleObj}>
        <div style={{fontSize:'14px', marginBottom:'18px'}}> {'Y坐标轴' + i} </div>
        <div style={{marginBottom:'40px'}}> <span style={{width:'100px', display:'inline-block'}}>{'相关数据点:'}</span> <span> {yaxisConfig[key].join(',')}</span></div>
        <MaxMinPair ref={uom+'_pair'} uom = {uom}></MaxMinPair>
      </div>;

        ++i;
        groups.push(group);
    }
    let _titleElement = <h3 style={{fontSize:'20px', fontWeight:'bold', padding:'24px 0 0 50px'}}>{'Y坐标轴设置'}</h3>;
    var dialog = <Dialog title={_titleElement} actions={_buttonActions} modal={false} ref="dialogWindow" onDismiss={this.onYaxisDialogDismiss}>
      <div className={'jazz-energy-yaxis-container'} style={{marginLeft:'26px'}}>
        {groups}
      </div>
    </Dialog>;

    return dialog;
  },
  _onFieldChange(e){
    console.log(arguments);
  },
  initDefaultValues(){
    var yaxisConfig = this.props.yaxisConfig;
    for (var key in yaxisConfig) {
      var uom = key;
      let storedConfigItem = this.getStoredConfigItemByUOM(uom, this.props.storedConfig);
      let maxField = this.refs[uom+'_pair'].refs[uom+'_max'];
      let minField = this.refs[uom+'_pair'].refs[uom+'_min'];

      if(storedConfigItem){
        maxField.setValue(storedConfigItem.val[0]);
        minField.setValue(storedConfigItem.val[1]);
      }else{
        maxField.setValue('');
        minField.setValue('');
      }
      maxField.setErrorText();
      minField.setErrorText();
    }
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
      let maxField = this.refs[uom+'_pair'].refs[uom+'_max'],
          minField = this.refs[uom+'_pair'].refs[uom+'_min'],
          maxValue = maxField.getValue(),
          minValue = minField.getValue();

      if(maxValue==='' && minValue===''){
        //flag = false;
        continue;
      }else if(maxValue ===''){
        maxField.setErrorText('必填项。');
        flag = false;
      }else if(minValue === ''){
        minField.setErrorText('必填项。');
        flag = false;
      }

      if(!isNumeric(maxValue)){
        maxField.setErrorText('必填为数字。');
        flag = false;
      }
      if(!isNumeric(minValue)){
        minField.setErrorText('必填为数字。');
        flag = false;
      }

      if(flag && (parseFloat(minValue) >= parseFloat(maxValue))){
        maxField.setErrorText('最大值要大于最小值。');
        flag = false;
      }
    }
    return flag;
    }
});

var MaxMinPair = React.createClass({
  render(){
    return  <div>
         <div> <span style={{width:'100px', display:'inline-block'}}>{'最大值:'}</span> <TextField hintText="自动" onChange={this._onMaxFieldChange} ref={this.props.uom+'_max'} /><span>{this.props.uom}</span></div>
         <div> <span style={{width:'100px', display:'inline-block'}}>{'最小值:'}</span> <TextField hintText="自动" onChange={this._onMinFieldChange}ref={this.props.uom+'_min'} /><span>{this.props.uom}</span></div>
       </div>;
  },
  _onMaxFieldChange(){
    this.refs[this.props.uom+'_max'].setErrorText();
  },
  _onMinFieldChange(){
    this.refs[this.props.uom+'_min'].setErrorText();
  }
});

module.exports = YaxisSelector;
