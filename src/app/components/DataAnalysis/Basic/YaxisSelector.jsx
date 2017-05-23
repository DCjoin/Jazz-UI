'use strict';
import React from "react";
import {Dialog, DropDownMenu, TextField, FontIcon, IconButton} from 'material-ui';
import NewDialog from 'controls/NewDialog.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';
import MenuItem from 'material-ui/MenuItem';
import CommonFuns from 'util/Util.jsx';
import _ from 'lodash';

let {isNumeric} = CommonFuns;

var _currentChartObj = null,
  _storedConfig = null;
let YaxisSelector = React.createClass({
  getInitialState() {
    return {};
  },
  _onYaxisClick() {
    if (this.props.initYaxisDialog) {
      var chartObj = this.props.initYaxisDialog();
      _currentChartObj = chartObj;
      var config = this.getConfig4Dialog(chartObj);
      _storedConfig = this.props.yaxisConfig;

      this.setState({
        yaxisConfig: config,
        storedConfig: _storedConfig,
      });
    }
  },
  getYaxisConfig() {
    return _storedConfig;
  },
  componentDidUpdate() {
    if (this.props.showDialog) {
      this.refs.yaxisDialog.show();
    //  this.refs.yaxisDialog.initDefaultValues();
    }
  },
  componentDidMount(){
    this._onYaxisClick();
  },
  getConfig4Dialog(chartObj) {
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
    } else {
      var y = chartObj.yAxis[0].options.yname;
      config[y] = [];
    }
    return config;
  },
  onYaxisDialogDismiss() {
    this.props.onYaxisDialogDismiss()
  },
  _onDialogSubmit(ret) {
    _storedConfig = ret;
    this.redraw();
    if (this.props.onYaxisSelectorDialogSubmit) {
      this.props.onYaxisSelectorDialogSubmit(ret);
    };
    this.onYaxisDialogDismiss();
  },
  render: function() {
    var me = this;
    return <YaxisDialog yaxisConfig={me.state.yaxisConfig} storedConfig={me.state.storedConfig}
      onDialogSubmit={me._onDialogSubmit} ref='yaxisDialog' onYaxisDialogDismiss={me.onYaxisDialogDismiss}></YaxisDialog>;
  },
  redraw: function() {
    var chart = _currentChartObj,
      yaxis = chart.yAxis;

    for (var i = 0, len = yaxis.length; i < len; i++) {
      //don't check navigator
      if (yaxis[i].series && yaxis[i].series.length == 1 && yaxis[i].series[0].name == 'Navigator') continue;

      var up = false;
      for (let j = 0; j < _storedConfig.length; j++) {
        if (yaxis[i].options.yname == _storedConfig[j].uom) { //navigator's yaxis donot have yTitle
          yaxis[i].update({
            max: _storedConfig[j].val[0]==='' || _storedConfig[j].val[0]===null?yaxis[i].max:_storedConfig[j].val[0],
            min: _storedConfig[j].val[1]==='' || _storedConfig[j].val[1]===null?yaxis[i].min:_storedConfig[j].val[1]
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
  getInitialState(){
    return{
      show:false
    }
  },
  _onDialogSubmit() {
    if (!this.validate()) {
      return;
    }

    var yaxisConfig = this.props.yaxisConfig;
    var ret = [];
    for (let key in yaxisConfig) {
      let uom = key; //key == 'undefined' ? '' : key;
      let maxValue = this.refs[uom + '_pair'].refs[uom + '_max'].getValue();
      let minValue = this.refs[uom + '_pair'].refs[uom + '_min'].getValue();
      if (maxValue === '' && minValue === '') {
        continue;
      }
      ret.push({
        uom: uom,
        val: [maxValue, minValue]
      });
    }

    this.props.onDialogSubmit(ret);

    this.hide();
  },
  _onDialogCancel() {
    this.onYaxisDialogDismiss();
  },
  _onRemoveAllClick() {
    var yaxisConfig = this.props.yaxisConfig;
    for (var key in yaxisConfig) {
      let uom = key;
      let maxMinPair = this.refs[uom + '_pair'];
      let maxField = maxMinPair.refs[uom + '_max'];
      let minField = maxMinPair.refs[uom + '_min'];

      if (maxMinPair) {
        maxMinPair.setState({
          maxValue: '',
          maxError:'',
          minValue: '',
          minError:''
        });
      }

      // maxField.setErrorText();
      // minField.setErrorText();
    }
  },
  show() {
    this.setState({
      show:true
    })
    //this.refs.dialogWindow.show();
  },
  hide() {
    this.setState({
      show:false
    })
    //this.refs.dialogWindow.dismiss();
  },
  onYaxisDialogDismiss() {
    this.hide();
    if (this.props.onYaxisDialogDismiss) {
      this.props.onYaxisDialogDismiss();
    }
  },
  render() {
    var _buttonActions = [
      <NewFlatButton
      label={I18N.Common.Button.Cancel2}
      secondary={true}
      onClick={this._onDialogCancel} style={{
        marginRight: '20px',width:'68px',minWidth:'68px'
      }}/>,
      <NewFlatButton
      label={I18N.Common.Button.Save}
      primary={true}
      onClick={this._onDialogSubmit}
      style={{
        width:'68px',
        minWidth:'68px'
      }}/>,

    ];

    var yaxisConfig = this.props.yaxisConfig;
    var groups = [];
    var i = 1;

    for (var key in yaxisConfig) {
      var uom = key; //== 'undefined' ? '' : key;
      let styleObj = {
        padding:'15px 0',
        borderTop:'1px solid #e6e6e6',
        fontSize: '14px',
        color:'#626469',
      };
      // if (i > 1) {
      //   styleObj = {
      //     marginTop: '40px'
      //   };
      // }

      let defaultValues = null;
      let storedConfigItem = this.getStoredConfigItemByUOM(uom, this.props.storedConfig);
      if (storedConfigItem) {
        defaultValues = storedConfigItem.val;
      }

      let group = <div style = {styleObj}>
        <div> {I18N.EM.YAxisTitle + i} </div>
        <div style={{
        marginTop: '10px'
      }}>
          <span style={{
        marginRight: '15px',
        display: 'inline-block'
      }}>{I18N.EM.YAxisSettingTags}</span>
          <span style={{
        'word-break': 'break-all'
      }}> {yaxisConfig[key].join(',').replace(/<br\s*\/?>/g, '~')}</span></div>
        <MaxMinPair ref={uom + '_pair'} uom = {uom} defaultValues={defaultValues}></MaxMinPair>
      </div>;

      ++i;
      groups.push(group);
    }
    let titleStyle ={
      fontSize: '16px',
      color:'#0d0d0d',
      fontWeight: 'bold',
      padding: '0',
      height:'72px',
      lineHeight:'72px',
      margin:'0 30px'
    };
    var dialog = <NewDialog title={I18N.EM.YAxisSetting} titleStyle={titleStyle} actions={_buttonActions} actionsContainerStyle={{marginLeft:'30px'}}
    modal={true} ref="dialogWindow" onDismiss={this.onYaxisDialogDismiss} open={this.state.show} contentStyle={{position:'relative',marginLeft:'30px'}}>
    <NewFlatButton secondary={true} style={{
      width:'110px',
      border:'none',
      right:'0',
      position:'absolute',
      color:'#32ad3d',
      top:'-49px'
    }}
    onClick={this._onRemoveAllClick} label={I18N.Common.Button.ClearAll} icon={<FontIcon className="icon-delete" style={{fontSize:'14px'}}/>}/>
  <div className={'jazz-energy-yaxis-container'} style={{overflowY:'auto'}}>
        {groups}
      </div>
    </NewDialog>;

    return dialog;
  },
  _onFieldChange(e) {
    console.log(arguments);
  },
  initDefaultValues() {
    var yaxisConfig = this.props.yaxisConfig;
    for (var key in yaxisConfig) {
      var uom = key;
      let storedConfigItem = this.getStoredConfigItemByUOM(uom, this.props.storedConfig);
      let maxMinPair = this.refs[uom + '_pair'];
      let maxField = this.refs[uom + '_pair'].refs[uom + '_max'];
      let minField = this.refs[uom + '_pair'].refs[uom + '_min'];

      if (storedConfigItem) {
        maxMinPair.setState({
          maxValue:storedConfigItem.val[0],
          maxError:'',
          minValue:storedConfigItem.val[1],
          minError:''
        })
        // maxField.setValue(storedConfigItem.val[0]);
        // minField.setValue(storedConfigItem.val[1]);
      } else {
        maxMinPair.setState({
          maxValue:'',
          maxError:'',
          minValue:'',
          minError:''
        })
        // maxField.setValue('');
        // minField.setValue('');
      }
      // maxField.setErrorText();
      // minField.setErrorText();
    }
  },
  getStoredConfigItemByUOM(uom, storedConfig) {
    if (storedConfig) {
      for (let i = 0, len = storedConfig.length; i < len; i++) {
        if (uom === storedConfig[i].uom) {
          return storedConfig[i];
        }
      }
    }
    return null;
  },
  validate: function() {
    var yaxisConfig = this.props.yaxisConfig;
    var flag = true;
    var i = 1;

    for (let key in yaxisConfig) {
      let uom = key == 'undefined' ? '' : key;
      let maxMinPair=this.refs[uom + '_pair'],
        maxField = this.refs[uom + '_pair'].refs[uom + '_max'],
        minField = this.refs[uom + '_pair'].refs[uom + '_min'],
        maxValue = maxMinPair.state.maxValue,
        minValue = maxMinPair.state.minValue,
        maxError='',minError='';

      // if (maxValue === '' && minValue === '') {
      //   //flag = false;
      //   continue;
      // } else if (maxValue === '') {
      //   maxError=I18N.Common.Label.MandatoryEmptyError;
      //   flag = false;
      // } else if (minValue === '') {
      //   minError=I18N.Common.Label.MandatoryEmptyError;
      //   flag = false;
      // }

      if (!isNumeric(maxValue) && maxValue!=='') {
        maxError=I18N.Common.Label.MandatoryNumberError;
        flag = false;
      }
      if (!isNumeric(minValue) && minValue!=='') {
        minError=I18N.Common.Label.MandatoryNumberError;
        flag = false;
      }

      if (flag && (parseFloat(minValue) >= parseFloat(maxValue))) {
        maxError=I18N.EM.YAxisMinMaxValidation;
        flag = false;
      }
      maxMinPair.setState({
        maxError:maxError,
        minError:minError
      })
    }

    return flag;
  }
});

var MaxMinPair = React.createClass({
  getInitialState() {
    let maxValue = '',
      minValue = '';
    if (this.props.defaultValues) {
      maxValue = this.props.defaultValues[0] || '';
      minValue = this.props.defaultValues[1] || '';
    }
    return {
      maxValue: maxValue,
      maxError:'',
      minValue: minValue,
      minError:''
    };
  },
  render() {
    return <div>
         <div style={{display:'flex',alignItems:'center'}}> <span style={{
        marginRight: '15px',
        display: 'inline-block',
      }}>{I18N.Common.Glossary.Max}</span>
    <TextField hintText={I18N.Common.Glossary.Auto} value={this.state.maxValue} errorText={this.state.maxError}
      hintStyle={{fontSize:'12px',color:'#9fa0a4'}}
      onChange={this._onMaxFieldChange} ref={this.props.uom + '_max'} value={this.state.maxValue}/>
               <span>{this.props.uom}</span></div>
         <div style={{display:'flex',alignItems:'center'}}> <span style={{
        marginRight: '15px',
        display: 'inline-block',
      }}>{I18N.Common.Glossary.Min}</span>
    <TextField hintText={I18N.Common.Glossary.Auto} value={this.state.minValue} errorText={this.state.minError}
      hintStyle={{fontSize:'12px',color:'#9fa0a4'}}
      onChange={this._onMinFieldChange} ref={this.props.uom + '_min'} value={this.state.minValue}/>
               <span>{this.props.uom}</span></div>
       </div>;
  },
  _onMaxFieldChange(e) {
    //this.refs[this.props.uom + '_max'].setErrorText();
    this.setState({
      maxValue: e.currentTarget.value,
      maxError:'',
    });
  },
  _onMinFieldChange(e) {
    //this.refs[this.props.uom + '_min'].setErrorText();
    this.setState({
      minValue: e.currentTarget.value,
      minError:'',

    });
  },
});

YaxisSelector.reset = function() {
  _storedConfig = null;
};

module.exports = YaxisSelector;
