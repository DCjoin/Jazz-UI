'use strict';
import React from "react";
import mui from 'material-ui';

let { Dialog, DropDownMenu, FlatButton, TextField } = mui;

let YaxisSelector = React.createClass({
  getInitialState() {
    return {};
  },
  _onYaxisClick(){
    if(this.props.initYaxisDialog){
      var chartObj = this.props.initYaxisDialog();
      var config = this.getConfig4Dialog(chartObj);
      this.setState({yaxisConfig:config});
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
  render: function () {
    var me = this;
    return <div style={{'align-self': 'center'}}>
        <div className='jazz-energy-yaxis-button' onTouchTap={me._onYaxisClick}> {'Y坐标轴'} </div>
        <YaxisDialog yaxisConfig={me.state.yaxisConfig} ref='yaxisDialog'></YaxisDialog>
      </div>;
  }

});

var YaxisDialog = React.createClass({
  _onDialogSubmit(){
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
      var uom = key == 'undefined' ? '' : key;
      let group = <div>
        <div> {'Y坐标轴' + i} </div>
        <div> <span>{'相关数据点:'}</span> <span> {yaxisConfig[key].join(',')}</span></div>
        <div> <span>{'最大值:'}</span> <TextField hintText="自动" /><span>{uom}</span></div>
        <div> <span>{'最小值:'}</span> <TextField hintText="自动" /><span>{uom}</span></div>
      </div>;

        ++i;
        groups.push(group);
    }

    var dialog = <Dialog  title="Y坐标轴设置"  actions={_buttonActions} modal={false} ref="dialogWindow">
      {groups}
    </Dialog>;

    return dialog;
  }
});

module.exports = YaxisSelector;
