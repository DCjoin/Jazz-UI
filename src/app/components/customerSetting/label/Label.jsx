'use strict';

import React from "react";
import { CircularProgress } from 'material-ui';
import Item from '../../../controls/SelectableItem.jsx';
import SelectablePanel from '../../../controls/SelectablePanel.jsx';
import LabelAction from '../../../actions/customerSetting/LabelAction.jsx';
import LabelStore from '../../../stores/customerSetting/LabelStore.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import LabelDetail from './LabelDetail.jsx';
import Immutable from 'immutable';

var Label = React.createClass({
  getInitialState: function() {
    return {
      isLoading: true,
      formStatus: formStatus.VIEW,
      showDeleteDialog: false,
      showLeft: true
    };
  },
  _onToggle: function() {
    var showLeft = this.state.showLeft;
    this.setState({
      showLeft: !showLeft
    });
  },
  _onLabelListChange: function() {
    var labelList = LabelStore.getLabelList();
    this.setState({
      labelList: labelList
    });
  },
  _onSelectedItemChange: function() {
    var selectedIndex = LabelStore.getSelectedLabelIndex();
    var selectedLabel = LabelStore.getSelectedLabel();
    this.setState({
      isLoading: false,
      showDeleteDialog: false,
      formStatus: formStatus.VIEW,
      selectedIndex: selectedIndex,
      selectedLabel: selectedLabel
    });
  },
  _onItemClick: function(index) {
    LabelAction.setSelectedLabelIndex(index);
  },
  _onEdit: function() {
    this.setState({
      formStatus: formStatus.EDIT
    });
  },
  _onCancel: function() {
    LabelAction.cancelSaveLabel();
  },
  _onSave: function() {
    this.setState({
      isLoading: true
    });
    var selectedLabel = this.state.selectedLabel.toJS();
    if (selectedLabel.Id === null) {
      LabelAction.createLabel(selectedLabel);
    } else {
      LabelAction.modifyLabel(selectedLabel);
    }
  },
  _onDelete: function() {
    this.setState({
      showDeleteDialog: true
    });
  },
  _onError: function() {
    this.setState({
      isLoading: false
    });
  },
  _handleDialogDismiss() {
    this.setState({
      showDeleteDialog: false
    });
  },
  _deleteLabel() {
    var selectedLabel = this.state.selectedLabel;
    LabelAction.deleteLabelById(selectedLabel.get('Id'), selectedLabel.get('Version'));
  },
  _addLabel() {
    var label = {
    };
    this.setState({
      selectedIndex: null,
      selectedLabel: Immutable.fromJS(label),
      formStatus: formStatus.ADD
    });
  },

  componentDidMount: function() {
    LabelAction.getLabelList();
    LabelStore.addLabelListChangeListener(this._onLabelListChange);
    LabelStore.addSelectedLabelChangeListener(this._onSelectedItemChange);
    LabelStore.addErrorChangeListener(this._onError);
  },
  componentWillUnmount: function() {
    LabelStore.removeLabelListChangeListener(this._onLabelListChange);
    LabelStore.removeSelectedLabelChangeListener(this._onSelectedItemChange);
    LabelStore.removeErrorChangeListener(this._onError);
    LabelStore.setSelectedLabelIndex(null);
  },


  render: function() {
    let me = this,
      isAdd = this.state.formStatus === formStatus.ADD,
      isView = this.state.formStatus === formStatus.VIEW;
    let rightPanel = null;
    let items = [];
    var labelList = me.state.labelList;
    if (labelList && labelList.size !== 0) {
      items = labelList.map(function(item, i) {
        let props = {
          index: i,
          label: item.get('Name'),
          text: I18N.Setting.CustomizedLabeling.Configurationer + ' : ' + item.get('UpdateUser'),
          selectedIndex: me.state.selectedIndex,
          onItemClick: me._onItemClick
        };
        return (
          <Item {...props}/>
          );
      });
    }
    let selectedLabel = me.state.selectedLabel;
    if (me.state.isLoading) {
      return (<div className='jazz-customer-label-loading'><div style={{
          margin: 'auto',
          width: '100px'
        }}><CircularProgress  mode="indeterminate" size={2} /></div></div>);
    } else if (selectedLabel !== null) {
      //rightPanel = (<LabelDetail/>);
    }
    var leftProps = {
      addBtnLabel: I18N.Setting.Labeling.Label.Labeling,
      isViewStatus: isView,
      isLoading: false,
      contentItems: items,
      onAddBtnClick: me._addLabel
    };
    var leftPanel = (this.state.showLeft) ? <div style={{
      display: 'flex'
    }}><SelectablePanel {...leftProps}/></div> : <div style={{
      display: 'none'
    }}><SelectablePanel {...leftProps}/></div>;
    return (
      <div style={{
        display: 'flex',
        flex: 1
      }}>
        {leftPanel}
        {rightPanel}
      </div>
      );
  }
});

module.exports = Label;
