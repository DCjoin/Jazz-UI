'use strict';

import React from "react";
import classnames from "classnames";
import { isFunction, isObject } from "lodash/lang";
import CarbonList from './CarbonList.jsx';
import CarbonDetail from './CarbonDetail.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import { CircularProgress } from 'material-ui';
import CarbonAction from '../../../actions/energyConversion/CarbonAction.jsx';
import CarbonStore from '../../../stores/energyConversion/CarbonStore.jsx';

import Dialog from '../../../controls/PopupDialog.jsx';
var Carbon = React.createClass({
  getInitialState: function() {
    return {
      formStatus: formStatus.VIEW,
      selectedId: null,
      carbons: CarbonStore.getCarbons(),
      closedList: false,
      isLoading: true,
      errorTitle: null,
      errorContent: null
    };
  },
  _handlerTouchTap: function(selectedId) {
    this._setViewStatus(selectedId);
    if (this.state.selectedId != selectedId) {
      CarbonAction.setCurrentSelectedId(selectedId);
    }
  },
  _handleSaveCarbon: function(carbonData) {
    CarbonAction.SaveCarbonFactor(carbonData);
    this.setState({
      isLoading: true
    });
  },
  _handleDeleteCarbon: function(carbon) {
    CarbonAction.deleteCarbon(carbon.toJS());
  },
  _setViewStatus: function(selectedId = this.state.selectedId) {
    var id = selectedId;
    if (!selectedId) {
      id = this.state.carbons.getIn([0, "Id"]);
      CarbonAction.setCurrentSelectedId(id);
    }
    this.setState({
      formStatus: formStatus.VIEW,
      selectedId: id
    });
  },
  _setAddStatus: function() {
    var carbonDetail = this.refs.pop_carbon_detail;
    if (carbonDetail && isFunction(carbonDetail.clearErrorTextBatchViewbaleTextFiled)) {
      carbonDetail.clearErrorTextBatchViewbaleTextFiled();
    }
    CarbonAction.setCurrentSelectedId(null);
    this.setState({
      formStatus: formStatus.ADD,
      selectedId: null
    });
  },
  _setEditStatus: function() {
    this.setState({
      formStatus: formStatus.EDIT
    });
  },
  _handlerCancel: function() {
    //RoleActionCreator.resetRole();
    this._setViewStatus();
  },
  _toggleList: function() {
    var {closedList} = this.state;
    this.setState({
      closedList: !closedList
    });
  },
  _onChange: function(selectedId) {
    if (!!selectedId) {
      this._setViewStatus(selectedId);
    }
    this.setState({
      carbons: CarbonStore.getCarbons(),
      isLoading: false,
      errorTitle: null,
      errorContent: null
    });
  },
  componentDidMount: function() {
    CarbonStore.addChangeListener(this._onChange);
    CarbonAction.GetConversionPairs();
    this.setState({
      isLoading: true
    });


  },
  componentWillUnmount: function() {
    CarbonStore.removeChangeListener(this._onChange);
    CarbonAction.ClearAll();
  },
  render: function() {
    var that = this,
      isView = this.state.formStatus === formStatus.VIEW;

    var listProps = {
        formStatus: this.state.formStatus,
        onAddBtnClick: that._setAddStatus,
        onCarbonClick: that._handlerTouchTap,
        carbons: that.state.carbons,
        selectedId: that.state.selectedId
      },
      detailProps = {
        ref: 'pop_carbon_detail',
        carbon: isView ? CarbonStore.getPersistedCarbon() : CarbonStore.getUpdatingCarbon(),
        formStatus: this.state.formStatus,
        setEditStatus: this._setEditStatus,
        handlerCancel: this._handlerCancel,
        handleSaveCarbon: this._handleSaveCarbon,
        handleDeleteCarbon: this._handleDeleteCarbon,
        toggleList: this._toggleList
      };

    let carbonlist = (!this.state.closedList) ? <div style={{
      display: 'flex'
    }}><CarbonList {...listProps}/></div> : <div style={{
      display: 'none'
    }}><CarbonList {...listProps}/></div>;
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
          flex: 1
        }}>
    {carbonlist}
    <CarbonDetail {...detailProps}/>
    </div>);
    }
  },
});
module.exports = Carbon;
