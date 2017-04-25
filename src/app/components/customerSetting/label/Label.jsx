'use strict';

import React from "react";
import { CircularProgress } from 'material-ui';
import Item from '../../../controls/SelectableItem.jsx';
import SelectablePanel from '../../../controls/SelectablePanel.jsx';
import LabelAction from '../../../actions/customerSetting/LabelAction.jsx';
import LabelStore from '../../../stores/customerSetting/labelStore.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import LabelDetail from './LabelDetail.jsx';
import Immutable from 'immutable';

var Label = React.createClass({
  contextTypes:{
      currentRoute: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      isLoading: true,
      formStatus: formStatus.VIEW,
      showDeleteDialog: false,
      showLeft: true,
      enableSave: true
    };
  },
  _isValid: function() {
    var labelDetail = this.refs.labelDetail;
    var labelNameIsValid = labelDetail.refs.labelName.isValid();
    var labelBasicIsValid = labelDetail.refs.labelBasic._isValid();
    var gradeIsValid = labelDetail.refs.gradeContainer._isValid();
    return labelNameIsValid && labelBasicIsValid && gradeIsValid;

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
  _mergeLabel: function(data) {
    var selectedLabel = this.state.selectedLabel;
    var labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    var i;
    var list = [];
    if (data.path === 'Order') {
      list = selectedLabel.get('LabellingItems').toJS().reverse();
      for (i = 0; i < list.length; i++) {
        list[i].Name = labels[i];
      }
      selectedLabel = selectedLabel.set('LabellingItems', Immutable.fromJS(list));
    } else if (data.path === 'Grade') {
      var gradeLevel = data.value;
      for (i = 0; i < gradeLevel; i++) {
        list.push({
          'MinValue': '',
          'MaxValue': '',
          'Name': labels[i]
        });
      }
      selectedLabel = selectedLabel.set('LabellingItems', Immutable.fromJS(list));
    } else if (data.path === 'LabellingType' || data.path === 'CommodityId') {
      for (i = 0; i < selectedLabel.get('LabellingItems').size; i++) {
        list.push({
          'MinValue': '',
          'MaxValue': '',
          'Name': labels[i]
        });
      }
      selectedLabel = selectedLabel.set('LabellingItems', Immutable.fromJS(list));
    }
    selectedLabel = selectedLabel.set(data.path, data.value);
    this.setState({
      selectedLabel: selectedLabel
    }, () => {
      this.setState({
        enableSave: this._isValid()
      });
    });
  },
  _onEdit: function() {
    this.setState({
      formStatus: formStatus.EDIT,
      enableSave: true
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
  _onCloseDialog() {
    this.setState({
      showDeleteDialog: false
    });
  },
  _onError: function() {
    this.setState({
      isLoading: false,
      showDeleteDialog: false
    });
  },
  _onDeleteLabel() {
    var selectedLabel = this.state.selectedLabel;
    LabelAction.deleteLabelById(selectedLabel.get('Id'));
  },
  _onAddLabel() {
    var list = [];
    var labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    for (var i = 0; i < 5; i++) {
      list.push({
        'MinValue': null,
        'MaxValue': null,
        'Name': labels[i]
      });
    }
    var label = {
      Id: null,
      Version: null,
      CommodityId: 1,
      UomId: 1,
      Grade: 5,
      CustomerId: parseInt(this.context.currentRoute.params.customerId),
      Order: 0,
      LabellingType: 1,
      Comment: '',
      LabellingItems: list
    };
    this.setState({
      selectedIndex: null,
      selectedLabel: Immutable.fromJS(label),
      formStatus: formStatus.ADD,
      enableSave: false
    });
  },
  componentWillMount: function() {
    document.title = I18N.MainMenu.CustomerSetting;
  },
  componentDidMount: function() {
    LabelAction.getLabelList(this.context.currentRoute.params.customerId);
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
      selectedLabel = me.state.selectedLabel,
      isAdd = this.state.formStatus === formStatus.ADD;
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
    if (me.state.isLoading) {
      return (<div className='jazz-customer-label-loading'><div style={{
          margin: 'auto',
          width: '100px'
        }}><CircularProgress  mode="indeterminate" size={80} /></div></div>);
    } else if (selectedLabel !== null) {
      var rightProps = {
        ref: 'labelDetail',
        formStatus: me.state.formStatus,
        selectedLabel: selectedLabel,
        showLeft: me.state.showLeft,
        showDeleteDialog: me.state.showDeleteDialog,
        onCancel: this._onCancel,
        onSave: this._onSave,
        onDelete: this._onDelete,
        onCloseDialog: this._onCloseDialog,
        onDeleteLabel: this._onDeleteLabel,
        onEdit: this._onEdit,
        onToggle: this._onToggle,
        mergeLabel: this._mergeLabel,
        enableSave: this.state.enableSave
      };
      rightPanel = (<LabelDetail {...rightProps}/>);
    }
    var leftProps = {
      addBtnLabel: I18N.Setting.Labeling.Label.Labeling,
      isAddStatus: isAdd,
      isLoading: false,
      contentItems: items,
      onAddBtnClick: me._onAddLabel
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
