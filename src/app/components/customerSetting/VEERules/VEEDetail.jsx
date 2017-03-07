'use strict';

import React, {Component, PropTypes} from "react";
import classnames from "classnames";
import { Toggle } from 'material-ui';
import { isFunction } from "lodash/lang";
import moment from 'moment';

import { formStatus } from 'constants/FormStatus.jsx';
import Regex from 'constants/Regex.jsx';

import Panel from 'controls/MainContentPanel.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import ViewableDatePicker from 'controls/ViewableDatePicker.jsx';
import ViewableDropDownMenu from 'controls/ViewableDropDownMenu.jsx';
import FormBottomBar from 'controls/FormBottomBar.jsx';
import Dialog from 'controls/NewDialog.jsx';
import FlatButton from 'controls/FlatButton.jsx';

import VEEStore from 'stores/customerSetting/VEEStore.jsx';

import RuleBasic from './RuleBasic.jsx';
import MonitorTag from './MonitorTag.jsx';


function getDateTimeItems() {
  var step = 30,
    dataList = [],
    v = 0,
    i = 0;

  while (v <= 1440) {
    var h = Math.floor(v / 60),
      m = v % 60,
      text = ((h < 10) ? '0' : '') + h + ':' + ((m < 10) ? '0' : '') + m;

    dataList[i] = {
      payload: text,
      text,
    };
    v += step;
    i++;
  }
  return dataList;
};

class ScanDialog extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onScan: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = this._getInitialState(props);
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.open) {
      this.setState(this._getInitialState(nextProps));
    }
  }
  _getInitialState(props) {
    let today = moment().format('YYYY-MM-DD');
    return {
      startDate: today,
      startTime: '00:00',
      endDate: today,
      endTime: '24:00',
    }
  }
  _setState(name) {
    return (val) => {
      this.setState({
        [name]: val
      });
    }
  }
  render() {
    let {startDate, endDate, startTime, endTime} = this.state,
    errorMessage = moment(startDate + ' ' + startTime) < moment(endDate + ' ' + endTime) ? null
                    : I18N.Setting.VEEManualScanError,
    props = {
      startDateProps: {
        key: 'startDate',
        value: startDate,
        width: 100,
        onChange: this._setState('startDate'),
      },
      startTimeProps: {
        key: 'startTime',
        dataItems: getDateTimeItems(),
        defaultValue: startTime,
        style: {width: 100},
        didChanged: this._setState('startTime'),
      },
      endDateProps: {
        key: 'endDate',
        value: endDate,
        width: 100,
        onChange: this._setState('endDate'),
      },
     endTimeProps: {
        key: 'endTime',
        dataItems: getDateTimeItems(),
        defaultValue:endTime,
        style: {width: 100},
        didChanged: this._setState('endTime'),
      },
    };
    return (<Dialog 
      actions={[
        (<FlatButton 
          disabled={errorMessage}
          label={I18N.Setting.VEEScan}
          onClick={() => {
            this.props.onClose();
            this.props.onScan(
              moment(startDate + ' ' + startTime).subtract(1, 'seconds').format('YYYY-MM-DD hh:mm:ss'),
              moment(endDate + ' ' + endTime).subtract(1, 'seconds').format('YYYY-MM-DD hh:mm:ss'),
            );
          }}
        />),
        (<FlatButton 
          label={I18N.Common.Button.Cancel}
          onClick={this.props.onClose}
        />)
      ]}
      open={this.props.open} 
      title={I18N.Setting.VEEManualScan}>
      <div className='manual-scan-title'>{I18N.Setting.VEEManualScanTime}</div>
      <div className='manual-scan-input'>
        <ViewableDatePicker {...props.startDateProps}/>
        <div className='manual-scan-input-time'><ViewableDropDownMenu {...props.startTimeProps}/></div>
        <div>{I18N.Setting.DataAnalysis.To}</div>
        <ViewableDatePicker {...props.endDateProps}/>
        <div className='manual-scan-input-time'><ViewableDropDownMenu {...props.endTimeProps}/></div>
      </div>
      <div className='manual-scan-error'>{errorMessage}</div>
    </Dialog>
    );
  }
}


var VEEDetail = React.createClass({

  propTypes: {
    formStatus: React.PropTypes.string,
    infoTab: React.PropTypes.bool,
    rule: React.PropTypes.object,
    setEditStatus: React.PropTypes.func,
    handlerCancel: React.PropTypes.func,
    handleSaveRule: React.PropTypes.func,
    handleDeleteRule: React.PropTypes.func,
    handlerSwitchTab: React.PropTypes.func,
    toggleList: React.PropTypes.func,
    closedList: React.PropTypes.bool,
    merge: React.PropTypes.func,
    onManualScan: React.PropTypes.func.isRequired,
  },
  getInitialState: function() {
    return {
      dialogStatus: false,
      showManualScanDialog: false,
      hasTags: false,
    };
  },
  componentDidMount: function() {
    VEEStore.addTagChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    VEEStore.removeTagChangeListener(this._onChange);
  },
  _onChange: function() {
    if( !this.state.hasTags && VEEStore.getTagList() && VEEStore.getTagList().size > 0 ) {
      this.setState({
        hasTags: true
      });
    }
  },
  _update: function() {
    this.forceUpdate();
  },
  _clearErrorText: function() {
    var basic = this.refs.jazz_vee_basic,
      tag = this.refs.jazz_vee_tag;
    // if (basic && isFunction(basic.clearErrorTextBatchViewbaleTextFiled)) {
    //   basic.clearErrorTextBatchViewbaleTextFiled();
    // }
    // if (tag && isFunction(tag.clearErrorTextBatchViewbaleTextFiled)) {
    //   tag.clearErrorTextBatchViewbaleTextFiled();
    // }
  },
  _handleSaveRule: function() {
    if (this.props.infoTab) {
      let rule = this.props.rule;
      if (rule.get('NotifyConsecutiveHours') === '') {
        rule = rule.set('NotifyConsecutiveHours', null)
      }
      // if (!rule.get('Interval')) {
      //   rule = rule.set('Interval', 1440)
      // }
      // if (!rule.get('Delay')) {
      //   rule = rule.set('Delay', 0)
      // }
      this.props.handleSaveRule(rule)
    } else {
      if (this.refs.jazz_vee_tag) {
        let tags = this.refs.jazz_vee_tag._handlerSave(),
          tagIds = [];
        tags.forEach(tag => {
          tagIds.push(tag.get('Id'))
        });
        this.props.handleSaveRule({
          ruleId: this.props.rule.get('Id'),
          tagIds: tagIds
        })
      }

    }

  },
  _renderHeader: function() {
    var that = this,
      {rule} = this.props,
      isView = this.props.formStatus === formStatus.VIEW,
      isAdd = this.props.formStatus === formStatus.ADD,
      ruleNameProps = {
        isViewStatus: isView || !this.props.infoTab,
        title: I18N.Setting.VEEMonitorRule.RuleName,
        defaultValue: rule.get("Name"),
        maxLen: 200,
        isRequired: true,
        didChanged: value => {
          this.props.merge({
            value,
            path: "Name"
          })
        }
      };
    return (
      <div className="pop-manage-detail-header" style={{
        marginTop: '-12px'
      }}>
    <div className={classnames("pop-manage-detail-header-name", "jazz-header")}>
      <ViewableTextField  {...ruleNameProps} />
        {
      isAdd ? null :
        <div className="pop-user-detail-tabs">
    <span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": that.props.infoTab
        })} data-tab-index="1" onClick={that.props.handlerSwitchTab}>{I18N.Setting.TOUTariff.BasicProperties}</span>
    <span className={classnames({
          "pop-user-detail-tabs-tab": true,
          "selected": !that.props.infoTab
        })} data-tab-index="2" onClick={that.props.handlerSwitchTab}>{I18N.Setting.VEEMonitorRule.MonitorTag}</span>
  </div>
      }
    </div>
  </div>
      )

  },
  _renderContent: function() {
    var basicProps = {
        ref: 'jazz_vee_basic',
        rule: this.props.rule,
        merge: this.props.merge,
        formStatus: this.props.formStatus,
      // key: this.props.rule.get('Id')
      },
      tagProps = {
        ref: 'jazz_vee_tag',
        formStatus: this.props.formStatus,
        ruleId: this.props.rule.get('Id'),
        onUpdate: this._update
      };
    return (
      <div style={{
        display: 'flex',
        flex: '1',
        overflow: 'auto'
      }}>
      {this.props.infoTab ? <RuleBasic {...basicProps}/> : <MonitorTag {...tagProps}/>}
    </div>

      )
  },
  _renderFooter: function() {
    var disabledSaveButton = false,
      {rule} = this.props,
      that = this,
      editBtnProps, customButton;
    if (this.props.infoTab) {
      if (!rule.get('Name') || rule.get('Name').length > 200
        || (!rule.get('CheckNegative') && !rule.get('CheckNull') && !rule.get('CheckZero'))
        || !rule.get('StartTime')) {
        disabledSaveButton = true
      }
      if (rule.get('CheckNotify') && !Regex.ConsecutiveHoursRule.test(rule.get('NotifyConsecutiveHours'))) {
        disabledSaveButton = true
      }

    } else {
      editBtnProps = {
        label: I18N.Common.Button.Add
      }
      customButton = this.state.hasTags && (<FlatButton 
        onClick={() => {
          this.setState({showManualScanDialog: true});
        }}
        style={{height: 56}} 
        label={I18N.Setting.VEEManualScan}/>);
      if (this.refs.jazz_vee_tag) {
        let tags = this.refs.jazz_vee_tag._handlerSave();
        if (tags.size === 0) {
          disabledSaveButton = true
        }
      }
    }
    return (
      <FormBottomBar
      transition={true}
      enableSave={!disabledSaveButton}
      status={this.props.formStatus}
      onSave={this._handleSaveRule}
      onDelete={function() {
        that.setState({
          dialogStatus: true
        });
      }}
      allowDelete={that.props.infoTab}
      onCancel={this.props.handlerCancel}
      onEdit={ () => {
        //that.clearErrorTextBatchViewbaleTextFiled();
        //that._clearErrorText();
        that.props.setEditStatus()
      }}
      editBtnProps={editBtnProps}
      customButton={customButton}/>

      )
  },
  _renderDialog: function() {
    var that = this;
    var closeDialog = function() {
      that.setState({
        dialogStatus: false
      });
    };
    if (!this.state.dialogStatus) {
      return null;
    } else {
      var rule = that.props.rule;

      return (

        <Dialog open={this.state.dialogStatus} title={I18N.Setting.VEEMonitorRule.DeleteTitle} modal={true} actions={[
          <FlatButton
          label={I18N.Template.Delete.Delete}
          primary={true}
          onClick={() => {
            that.props.handleDeleteRule(rule);
            closeDialog();
          }} />,
          <FlatButton
          label={I18N.Template.Delete.Cancel}
          onClick={closeDialog} />
        ]}>
      {I18N.format(I18N.Setting.VEEMonitorRule.DeleteContent, rule.get('Name'))}
    </Dialog>
        );
    }
  },
  // componentWillMount: function() {
  //   this.initBatchViewbaleTextFiled();
  // },
  render: function() {
    var that = this;
    var header = this._renderHeader(),
      content = this._renderContent(),
      footer = this._renderFooter();
    return (
      <div className={classnames({
        "jazz-framework-right-expand": that.props.closedList,
        "jazz-framework-right-fold": !that.props.closedList
      })}>
    <Panel onToggle={this.props.toggleList}>
      {header}
      {content}
      {footer}
    </Panel>
    {that._renderDialog()}
    <ScanDialog 
      open={this.state.showManualScanDialog} 
      onClose={() => {
        this.setState({showManualScanDialog: false});
      }}
      onScan={(from, to) => {
        this.props.onManualScan(from, to, this.props.rule.get('Id'));
      }}/>
  </div>
      )
  },
});
module.exports = VEEDetail;
