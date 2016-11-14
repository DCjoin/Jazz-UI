'use strict';

import React from "react";
import RuleList from './VEEList.jsx';
import { isFunction } from "lodash/lang";
import Immutable from 'immutable';
import Detail from './VEEDetail.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import { CircularProgress } from 'material-ui';
import VEEAction from '../../../actions/customerSetting/VEEAction.jsx';
import VEEStore from '../../../stores/customerSetting/VEEStore.jsx';
import Dialog from '../../../controls/PopupDialog.jsx';
import { List, Map } from 'immutable';
import { dataStatus } from '../../../constants/DataStatus.jsx';

function emptyMap() {
  return new Map();
}
function emptyList() {
  return new List();
}
var VEERules = React.createClass({
  getInitialState: function() {
    return {
      formStatus: formStatus.VIEW,
      selectedId: null,
      selectedRule: emptyMap(),
      selectedTag: emptyList(),
      rules: VEEStore.getRules(),
      closedList: false,
      isLoading: true,
      errorTitle: null,
      errorContent: null,
      infoTab: true,
    };
  },
  contextTypes:{
      currentRoute: React.PropTypes.object
  },
  _handlerTouchTap: function(selectedId) {
    this._setViewStatus(selectedId);
    if (this.state.selectedId !== selectedId) {
      VEEAction.setCurrentSelectedId(selectedId);
    }
  },
  _handlerMerge: function(data) {
    var {status, path, value} = data,
      paths = path.split("."),
      value = Immutable.fromJS(value);
    var mData = (this.state.infoTab) ? this.state.selectedRule : this.state.selectedTag;
    if (status === dataStatus.DELETED) {
      mData = mData.deleteIn(paths);
    } else if (status === dataStatus.NEW) {

    } else {
      mData = mData.setIn(paths, value)
      if (path === 'NotifyConsecutiveHours') {
        mData = mData.set('CheckNotify', true)
      }
      if (path === 'CheckNotify' && value === false) {
        mData = mData.set('NotifyConsecutiveHours', null)
      }
      if (path === 'CheckNull' && value === false) {
        mData = mData.set('CheckNotify', false);
        mData = mData.set('NotifyConsecutiveHours', null);
        mData = mData.set('EnableEstimation', false);
      }
    }
    if (this.state.infoTab) {
      this.setState({
        selectedRule: mData,
      })
    } else {
      this.setState({
        selectedTag: mData,
      })
    }

  },
  _handleSaveRule: function(data) {
    if (this.state.infoTab) {
      let dto = data.toJS();
      if (parseInt(dto.NotifyConsecutiveHours) >= 0) {
        dto.NotifyConsecutiveHours = parseInt(dto.NotifyConsecutiveHours)
      }
      if (!data.get('Id')) {
        dto.CustomerId = this.context.currentRoute.params.customerId;
        VEEAction.createVEERule(dto);
      } else {
        VEEAction.modifyVEERule(dto);
      }
    } else {
      VEEAction.modifyVEETags(this.context.currentRoute.params.customerId,data.ruleId, data.tagIds)
    }
    this.setState({
      isLoading: true
    });

  },
  _handleDeleteRule: function(data) {
    VEEAction.deleteRule({
      Ids: [this.state.selectedId],
      Version: data.get('Version')
    });
  },
  _handlerCancel: function() {
    var that = this;
    if (this.state.selectedId === null) {
      if (VEEStore.getSelectedId() === null || !VEEStore.getSelectedId()) {
        that.setState({
          selectedRule: emptyMap(),
          formStatus: formStatus.VIEW,
        });
      } else {
        this._setViewStatus(VEEStore.getSelectedId());
      }

    } else {
      this._setViewStatus();
    }

  },
  _switchTab(event) {
    if (event.target.getAttribute("data-tab-index") === '1') {
      if (this.state.infoTab) {
        return;
      }
      this.setState({
        infoTab: true,
        formStatus: formStatus.VIEW
      });
    } else {
      if (!this.state.infoTab) {
        return;
      }

      this.setState({
        infoTab: false,
        formStatus: formStatus.VIEW
      });
    }

  },
  _toggleList: function() {
    var {closedList} = this.state;
    this.setState({
      closedList: !closedList
    });
  },
  _setViewStatus: function(selectedId = this.state.selectedId) {
    var id = selectedId,
      infoTab = this.state.infoTab;
    // if (!selectedId) {
    //   id = this.state.tariffs.getIn([0, "Id"]);
    //   TariffAction.setCurrentSelectedId(id);
    // }
    // if (this.state.selectedId !== selectedId) {
    //   infoTab = true;
    // }
    this.setState({
      infoTab: infoTab,
      formStatus: formStatus.VIEW,
      selectedId: id,
      selectedRule: VEEStore.getRuleById(id)
    });
  },
  _setAddStatus: function() {
    var ruleDetail = this.refs.jazz_vee_detail;
    if (ruleDetail && isFunction(ruleDetail.clearErrorTextBatchViewbaleTextFiled)) {
      ruleDetail.clearErrorTextBatchViewbaleTextFiled();
      ruleDetail._clearErrorText();
    }
    // TariffAction.setCurrentSelectedId(null);
    var rule = Immutable.fromJS({
      Interval: 1440,
      Delay: 0
    });
    this.setState({
      infoTab: true,
      formStatus: formStatus.ADD,
      selectedId: null,
      selectedRule: rule
    });
  },
  _setEditStatus: function() {
    this.setState({
      formStatus: formStatus.EDIT
    });
  },

  _onChange: function(selectedId) {
    if (!!selectedId) {
      this._setViewStatus(selectedId);
    }
    this.setState({
      rules: VEEStore.getRules(),
      isLoading: false,
      errorTitle: null,
      errorContent: null
    });
  },
  _onError: function(error) {
    this.setState({
      errorTitle: error.title,
      errorContent: error.content,
      isLoading: false
    });
  },
  _renderErrorDialog: function() {
    if (!!this.state.errorTitle) {
      return (<Dialog
        ref = "_dialog"
        title={this.state.errorTitle}
        modal={false}
        openImmediately={!!this.state.errorTitle}
        >
        {this.state.errorContent}
      </Dialog>)
    } else {
      return null;
    }
  },
  componentWillMount: function() {
    document.title = I18N.MainMenu.Customer;
    VEEAction.GetVEERules(this.context.currentRoute.params.customerId);
    this.setState({
      isLoading: true
    });
  },
  componentDidMount: function() {
    VEEStore.addChangeListener(this._onChange);
    VEEStore.addErrorChangeListener(this._onError);
  },
  componentWillUnmount: function() {
    VEEStore.removeChangeListener(this._onChange);
    VEEStore.removeErrorChangeListener(this._onError);
    VEEAction.clearAll();
  },
  render: function() {
    var isView = this.state.formStatus === formStatus.VIEW;
    var listProps = {
        formStatus: this.state.formStatus,
        onAddBtnClick: this._setAddStatus,
        onRuleClick: this._handlerTouchTap,
        rules: this.state.rules,
        selectedId: this.state.selectedId
      },
      detailProps = {
        ref: 'jazz_vee_detail',
        key: this.state.selectedRule.get('Id'),
        rule: this.state.selectedRule,
        formStatus: this.state.formStatus,
        infoTab: this.state.infoTab,
        setEditStatus: this._setEditStatus,
        handlerCancel: this._handlerCancel,
        handleSaveRule: this._handleSaveRule,
        handleDeleteRule: this._handleDeleteRule,
        handlerSwitchTab: this._switchTab,
        toggleList: this._toggleList,
        closedList: this.state.closedList,
        merge: this._handlerMerge
      };
    let list = (!this.state.closedList) ? <div style={{
      display: 'flex'
    }}><RuleList {...listProps}/></div> : <div style={{
      display: 'none'
    }}><RuleList {...listProps}/></div>;
    let detail = (this.state.rules.size === 0 && isView) ? null : <Detail {...detailProps}/>;
    if (this.state.isLoading) {
      return (
        <div style={{
          display: 'flex',
          flex: 1,
          'alignItems': 'center',
          'justifyContent': 'center'
        }}>
        <CircularProgress  mode="indeterminate" size={80} />
      </div>
        );
    } else {
      return (
        <div style={{
          display: 'flex',
          flex: 1,
          overflow: 'auto'
        }}>
              {list}
              {detail}
              {this._renderErrorDialog()}
            </div>);
    }
  },
});
module.exports = VEERules;
