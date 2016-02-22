'use strict';

import React from "react";
import List from './VEEList.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import { CircularProgress } from 'material-ui';
import VEEAction from '../../../actions/customerSetting/VEEAction.jsx';
import VEEStore from '../../../stores/customerSetting/VEEStore.jsx';
import Dialog from '../../../controls/PopupDialog.jsx';

var VEERules = React.createClass({
  getInitialState: function() {
    return {
      formStatus: formStatus.VIEW,
      selectedId: null,
      rules: VEEStore.getRules(),
      closedList: false,
      isLoading: true,
      errorTitle: null,
      errorContent: null,
      infoTab: true,
    };
  },
  _handlerTouchTap: function(selectedId) {
    this._setViewStatus(selectedId);
    if (this.state.selectedId !== selectedId) {
      VEEAction.setCurrentSelectedId(selectedId);
    }
  },
  _setViewStatus: function(selectedId = this.state.selectedId) {
    var id = selectedId,
      infoTab = this.state.infoTab;
    // if (!selectedId) {
    //   id = this.state.tariffs.getIn([0, "Id"]);
    //   TariffAction.setCurrentSelectedId(id);
    // }
    if (this.state.selectedId !== selectedId) {
      infoTab = true;
    }
    this.setState({
      infoTab: infoTab,
      formStatus: formStatus.VIEW,
      selectedId: id
    });
  },
  _setAddStatus: function() {
    // var tariffDetail = this.refs.pop_tariff_detail;
    // if (tariffDetail && isFunction(tariffDetail.clearErrorTextBatchViewbaleTextFiled)) {
    //   tariffDetail.clearErrorTextBatchViewbaleTextFiled();
    // }
    // TariffAction.setCurrentSelectedId(null);
    this.setState({
      infoTab: true,
      formStatus: formStatus.ADD,
      selectedId: null
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
  componentWillMount: function() {
    VEEAction.GetVEERules();
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
  //TariffAction.ClearAll();
  },
  render: function() {
    var isView = this.state.formStatus === formStatus.VIEW;
    var listProps = {
      formStatus: this.state.formStatus,
      onAddBtnClick: this._setAddStatus,
      onRuleClick: this._handlerTouchTap,
      rules: this.state.rules,
      selectedId: this.state.selectedId
    };
    let list = (!this.state.closedList) ? <div style={{
      display: 'flex'
    }}><List {...listProps}/></div> : <div style={{
      display: 'none'
    }}><List {...listProps}/></div>;
    if (this.state.isLoading) {
      return (
        <div style={{
          display: 'flex',
          flex: 1,
          'alignItems': 'center',
          'justifyContent': 'center'
        }}>
        <CircularProgress  mode="indeterminate" size={2} />
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

            </div>);
    }
  },
});
module.exports = VEERules;
