'use strict';

import React from "react";
import { isFunction } from "lodash";
import TariffList from './TariffList.jsx';
import TariffDetail from './TariffDetail.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import { CircularProgress } from 'material-ui';
import TariffAction from '../../../actions/energyConversion/TariffAction.jsx';
import TariffStore from '../../../stores/energyConversion/TariffStore.jsx';
import NewDialog from '../../../controls/NewDialog.jsx';

var Tariff = React.createClass({
  getInitialState: function() {
    return {
      formStatus: formStatus.VIEW,
      selectedId: null,
      tariffs: TariffStore.getTariffs(),
      closedList: false,
      isLoading: true,
      errorTitle: null,
      errorContent: null,
      infoTab: true,
    };
  },
  _handlerTouchTap: function(selectedId) {
    this._setViewStatus(selectedId);
    if (this.state.selectedId != selectedId) {
      TariffAction.setCurrentSelectedId(selectedId);
    }
  },
  _handleSaveTariff: function(tariffData) {
    if (this.state.infoTab) {
      TariffAction.SaveTouTariff(tariffData);
    } else {
      TariffAction.SavePeakTariff(tariffData);
    }

    this.setState({
      isLoading: true
    });
  },
  _handleDeleteTariff: function(tariff) {
    TariffAction.deleteTariff({
      Id: tariff.get('Id'),
      Version: tariff.get('Version')
    });
  },
  _switchTab(event) {
    if (event.target.getAttribute("data-tab-index") == 1) {
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
    TariffAction.reset();
  },
  _setViewStatus: function(selectedId = this.state.selectedId) {
    var id = selectedId,
      infoTab = this.state.infoTab;
    if (!selectedId) {
      id = this.state.tariffs.getIn([0, "Id"]);
      TariffAction.setCurrentSelectedId(id);
    }
    if (this.state.selectedId != selectedId) {
      infoTab = true;
    }
    this.setState({
      infoTab: infoTab,
      formStatus: formStatus.VIEW,
      selectedId: id
    });
  },
  _setAddStatus: function() {
    var tariffDetail = this.refs.pop_tariff_detail;
    if (tariffDetail && isFunction(tariffDetail.clearErrorTextBatchViewbaleTextFiled)) {
      tariffDetail.clearErrorTextBatchViewbaleTextFiled();
    }
    TariffAction.setCurrentSelectedId(null);
    this.setState({
      infoTab: true,
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
    TariffAction.reset();
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
      tariffs: TariffStore.getTariffs(),
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
    var that = this;
    var onClose = function() {
      that.setState({
        errorTitle: null,
        errorContent: null,
      });
    };
    return (<NewDialog
        ref = "_dialog"
        title={this.state.errorTitle}
        modal={false}
        open={!!this.state.errorTitle}
        onRequestClose={onClose}
        >
        {this.state.errorContent}
    </NewDialog>)
  },
  componentDidMount: function() {
    TariffStore.addChangeListener(this._onChange);
    TariffStore.addErrorChangeListener(this._onError);
    TariffAction.GetTouTariff();
    this.setState({
      isLoading: true
    });


  },
  componentWillUnmount: function() {
    TariffStore.removeChangeListener(this._onChange);
    TariffStore.removeErrorChangeListener(this._onError);
    TariffAction.ClearAll();
  },
  render: function() {
    var that = this,
      isView = this.state.formStatus === formStatus.VIEW;

    var listProps = {
        formStatus: this.state.formStatus,
        onAddBtnClick: that._setAddStatus,
        onTariffClick: that._handlerTouchTap,
        tariffs: that.state.tariffs,
        selectedId: that.state.selectedId
      },
      detailProps = {
        ref: 'pop_tariff_detail',
        tariff: isView ? TariffStore.getPersistedTariff() : TariffStore.getUpdatingTariff(),
        formStatus: this.state.formStatus,
        infoTab: this.state.infoTab,
        setEditStatus: this._setEditStatus,
        handlerCancel: this._handlerCancel,
        handleSaveTariff: this._handleSaveTariff,
        handleDeleteTariff: this._handleDeleteTariff,
        handlerSwitchTab: that._switchTab,
        toggleList: this._toggleList,
        closedList: this.state.closedList
      };

    let tarifflist = (!this.state.closedList) ? <div style={{
      display: 'flex'
    }}><TariffList {...listProps}/></div> : <div style={{
      display: 'none'
    }}><TariffList {...listProps}/></div>;
    let detail = (this.state.tariffs.size == 0 && isView) ? null : <TariffDetail {...detailProps}/>;
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
    {tarifflist}
{detail}
    {that._renderErrorDialog()}
    </div>);
    }
  },
});
module.exports = Tariff;
