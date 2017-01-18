'use strict';
import React from "react";
import { CircularProgress } from 'material-ui';
import Item from '../../../controls/SelectableItem.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import TagList from './TagList.jsx';
import TagDetail from './TagDetail.jsx';
import TagFilter from './TagFilter.jsx';
import TagStore from '../../../stores/customerSetting/TagStore.jsx';
import TagAction from '../../../actions/customerSetting/TagAction.jsx';
import GlobalErrorMessageAction from '../../../actions/GlobalErrorMessageAction.jsx';
import Immutable from 'immutable';
import RawDataList from './RawDataList.jsx';

var timeoutID = null;
var customerId=null;
let Tag = React.createClass({
  propTypes: {
    tagType: React.PropTypes.number.isRequired
  },
  contextTypes:{
      currentRoute: React.PropTypes.object
  },
  getInitialState: function() {
    var filterObj = this._getInitFilterObj();
    return {
      isLoading: true,
      formStatus: formStatus.VIEW,
      filterObj: filterObj,
      showLeft: true,
      isFilter: false,
      total: 0,
      curPageNum: 1,
      showFilter: false,
      showBasic: true,
      showDeleteDialog: false,
      enableSave: true,
      showRawDataList: false,
      isRawData: false
    };
  },
  _isValid: function() {
    var codeIsValid,
      meterCodeIsValid,
      channelIsValid,
      comAndUomIsValid,
      calculationStepIsValid,
      calculationTypeIsValid,
      slopeIsValid = true,
      offsetIsValid = true,
      commentIsValid = true;
    var tagDetail = this.refs.tagDetail;
    var nameIsValid = tagDetail.refs.tagName.isValid();
    if (this.state.showBasic && this.props.tagType === 1) {
      var pTagBasic = tagDetail.refs.pTagBasic;
      codeIsValid = pTagBasic.refs.code.isValid();
      meterCodeIsValid = pTagBasic.refs.meterCode.isValid();
      channelIsValid = pTagBasic.refs.channel.isValid();
      comAndUomIsValid = pTagBasic.refs.comAndUom.isValid();
      calculationStepIsValid = pTagBasic.refs.calculationStep.isValid();
      calculationTypeIsValid = pTagBasic.refs.calculationType.isValid();
      if (pTagBasic.refs.slope) {
        slopeIsValid = pTagBasic.refs.slope.isValid();
      }
      if (pTagBasic.refs.offset) {
        offsetIsValid = pTagBasic.refs.offset.isValid();
      }
      if (pTagBasic.refs.comment) {
        commentIsValid = pTagBasic.refs.comment.isValid();
      }

      return nameIsValid && codeIsValid && meterCodeIsValid && channelIsValid && comAndUomIsValid && calculationStepIsValid && calculationTypeIsValid && slopeIsValid && offsetIsValid && commentIsValid;
    } else if (this.state.showBasic && this.props.tagType === 2) {
      var vTagBasic = tagDetail.refs.vTagBasic;
      codeIsValid = vTagBasic.refs.code.isValid();
      comAndUomIsValid = vTagBasic.refs.comAndUom.isValid();
      calculationStepIsValid = vTagBasic.refs.calculationStep.isValid();
      calculationTypeIsValid = vTagBasic.refs.calculationType.isValid();
      if (vTagBasic.refs.comment) {
        commentIsValid = vTagBasic.refs.comment.isValid();
      }

      return nameIsValid && codeIsValid && comAndUomIsValid && calculationStepIsValid && calculationTypeIsValid && commentIsValid;
    } else if (!this.state.showBasic && this.props.tagType === 2) {
      var vTagFormula = tagDetail.refs.vTagFormula;
      var fomulaIsValid = vTagFormula.refs.formula.isValid();
      return fomulaIsValid;
    }
  },
  _resetFilterObj: function() {
    var filterObj = this._getInitFilterObj();
    TagAction.setFilterObj(filterObj);
    this.setState({
      filterObj: filterObj,
      isFilter: false,
      curPageNum: 1
    }, () => {
      this.getTagList();
    });
  },
  _getInitFilterObj: function() {
    var filterObj = {
      CommodityId: null,
      UomId: null,
      LikeCodeOrName: ''
    };
    return filterObj;
  },
  _onToggle: function() {
    var showLeft = !this.state.showLeft,
      showRawDataList;
    if (this.state.showLeft) {
      showRawDataList = this.state.showRawDataList;
    } else {
      if (this.state.showRawDataList) {
        showRawDataList = false;
      } else {
        showRawDataList = this.state.showRawDataList;
      }
    }
    this.setState({
      showLeft: showLeft,
      showRawDataList: showRawDataList
    });
  },
  _onSwitchRawDataListView: function(switchFlag, isRawData) {
    var showLeft,
      showRawDataList;
    if (switchFlag) {
      showRawDataList = !this.state.showRawDataList;
      if (this.state.showRawDataList) {
        showLeft = this.state.showLeft;
      } else {
        if (this.state.showLeft) {
          showLeft = false;
        } else {
          showLeft = this.state.showLeft;
        }
      }
    } else {
      showLeft = this.state.showLeft;
      showRawDataList = this.state.showRawDataList;
    }

    this.setState({
      showLeft: showLeft,
      showRawDataList: showRawDataList,
      isRawData: isRawData
    });
  },
  _onTagListChange: function() {
    var tagList = TagStore.getTagList();
    this.setState({
      tagList: tagList,
      total: TagStore.getTagTotalNum()
    });
  },
  _onSelectedTagChange: function() {
    var selectedIndex = TagStore.getSelectedTagIndex();
    var selectedTag = TagStore.getSelectedTag();
    this.setState({
      isLoading: false,
      showDeleteDialog: false,
      formStatus: formStatus.VIEW,
      selectedIndex: selectedIndex,
      selectedTag: selectedTag,
      isRawData: selectedTag === null ? false : (selectedTag.get('IsAccumulated') ? false : true),
    });
  },
  _onItemClick: function(index) {
    TagAction.setSelectedTagIndex(index);
  },
  _onError: function() {
    var errorMsg = '';
    this.setState({
      isLoading: false,
      showDeleteDialog: false
    });
    let code = TagStore.getErrorCode(),
      messages = TagStore.getErrorMessage();
    if (!code) {
      return;
    } else if (code === '06182') {
      var associateItems = [],
        deleteLabel = '',
        deleteName,
        colon = ' : ',
        deleteType = this.props.tagType,
        pl = I18N.Setting.Tag.PTagManagement,
        vl = I18N.Setting.Tag.VTagManagement,
        kl = I18N.Setting.Tag.KPI,
        hl = I18N.Setting.Tag.PanelTitle,
        rl=I18N.Setting.KPI.Report.Name,
        il=I18N.Setting.KPI.Name,
        br = '<br/>',
        divStart = '<div>',
        divEnd = '</div>';
      switch (deleteType) {
        case 1:
          deleteLabel = pl;
          break;
        case 2:
          deleteLabel = vl;
          break;
        case 4:
          deleteLabel = kl;
          break;
      }
      if (messages) {
        var message,
          type,
          name,
          vtags = [],
          kpis = [],
          hierarchys = [],
          reports=[],
          indicators=[];
        for (var i = 0, len = messages.length; i < len; i++) {
          message = messages[i];
          if (message && messages.length > 1) {
            type = message.charAt(0);
            name = message.substring(1);
            switch (type) {
              case 'S':
                deleteName = name;
                break;
              case 'V':
                vtags.push(name);
                break;
              case 'K':
                kpis.push(name);
                break;
              case 'H':
                hierarchys.push(name);
                break;
              case 'R':
                reports.push(name);
                break;
              case 'I':
                indicators.push(name);
                break;
            }
          }
        }
        var hd = false;
        if (vtags.length) {
          associateItems.push(br+divStart+vl + colon);
          associateItems.push(vtags.join(','));
          hd = true;
        }
        if (kpis.length) {
          associateItems.push((hd ? ' ; ' : divStart) + (kl + colon));
          associateItems.push( kpis.join(','));
          hd = true;
        }
        if (hierarchys.length) {
          associateItems.push((hd ? ' ; ' : divStart) + (hl + colon));
          associateItems.push( hierarchys.join(','));
          hd = true;
        }
        if (reports.length) {
          associateItems.push((hd ? ' ; ' : divStart) + (rl + colon));
          associateItems.push(reports.join(','));
          hd = true;
        }
        if (indicators.length) {
          associateItems.push((hd ? ' ; ' : divStart) + (il + colon));
          associateItems.push(indicators.join(','));
        }
        associateItems.push(divEnd);
        errorMsg = I18N.format(I18N.Message.M06182, deleteLabel, deleteName, associateItems.join(''));
      } else {
        deleteName = this.state.selectedTag.get('Name');
        errorMsg = I18N.format(I18N.Message.M06182, deleteLabel, deleteName, '');
      }
      setTimeout(() => {
        GlobalErrorMessageAction.fireGlobalErrorMessage(errorMsg, code, true);
      }, 0);
    } else if (code === '06201') {
      var step = this.state.selectedTag.get('CalculationStep');
      var stepList = [],
        stepText = '';
      if (this.props.tagType === 1) {
        stepList = this.refs.tagDetail.refs.pTagBasic._getCalculationStepList();
      } else {
        stepList = this.refs.tagDetail.refs.vTagBasic._getCalculationStepList();
      }
      var index = stepList.findIndex((item) => {
        if (item.payload === step) {
          return true;
        }
      });
      if (index !== -1) {
        stepText = stepList[index].text;
      }
      errorMsg = I18N.format(I18N.Message.M06201, stepText);
      setTimeout(() => {
        GlobalErrorMessageAction.fireGlobalErrorMessage(errorMsg, code, false);
      }, 0);
    }
  },
  _onPrePage: function() {
    var curPageNum = this.state.curPageNum;
    if (curPageNum > 1) {
      this.setState({
        curPageNum: curPageNum - 1
      }, () => {
        this.getTagList();
      });
    }
  },
  _onNextPage: function() {
    var curPageNum = this.state.curPageNum;
    if (20 * curPageNum < this.state.total) {
      this.setState({
        curPageNum: curPageNum + 1
      }, () => {
        this.getTagList();
      });
    }
  },
  _onJumpToPage: function(targetPage) {
    this.setState({
      curPageNum: targetPage
    }, () => {
      this.getTagList();
    });
  },
  _onSearch: function(value) {
    var me = this;
    var filterObj = this.state.filterObj;
    filterObj.LikeCodeOrName = value;
    this.setState({
      filterObj: filterObj,
      curPageNum: 1
    }, () => {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
      timeoutID = setTimeout(() => {
        me.getTagList();
        timeoutID = null;
      }, 200);
    });
  },
  _onSearchCleanButtonClick: function() {
    var filterObj = this.state.filterObj;
    filterObj.LikeCodeOrName = '';
    this.setState({
      filterObj: filterObj,
      curPageNum: 1
    }, () => {
      this.getTagList();
    });
  },
  _onExportTag: function() {
    var filterObj = this.state.filterObj;
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'TagImportExcel.aspx?filter=' + encodeURIComponent(JSON.stringify(filterObj));
    iframe.onload = function() {
      document.body.removeChild(iframe);
    };
    document.body.appendChild(iframe);
  },
  _handleShowFilterSideNav: function() {
    this.setState({
      showFilter: true
    });
  },
  _handleCloseFilterSideNav: function() {
    var filterObj = TagStore.getFilterObj().toJS();
    this.setState({
      showFilter: false,
      filterObj: filterObj
    });
  },
  _handleFilter: function() {
    var isFilter;
    var filterObj = this.state.filterObj;
    TagAction.setFilterObj(filterObj);
    if (filterObj.CommodityId === null && filterObj.UomId === null) {
      isFilter = false;
    } else {
      isFilter = true;
    }
    this.setState({
      curPageNum: 1,
      showFilter: false,
      isFilter: isFilter
    }, () => {
      this.getTagList();
    });
  },
  _mergeFilterObj: function(data) {
    var filterObj = this.state.filterObj;
    filterObj[data.path] = data.value;
    this.setState({
      filterObj: filterObj
    });
  },
  _mergeTag: function(data) {
    var selectedTag = this.state.selectedTag;
    selectedTag = selectedTag.set(data.path, data.value);
    if (data.path === 'Formula') {
      selectedTag = selectedTag.set('TagModifyMode', 1);
    }
    this.setState({
      selectedTag: selectedTag
    }, () => {
      this.setState({
        enableSave: this._isValid()
      });
    });
  },
  _onSwitchTab: function(event) {
    if (event.target.getAttribute("data-tab-index") === '1') {
      if (this.state.showBasic) {
        return;
      } else {
        this.setState({
          showBasic: true,
          formStatus: formStatus.VIEW,
          showRawDataList: false,
          isRawData: false
        });
      }
    } else {
      if (!this.state.showBasic) {
        return;
      } else {
        this.setState({
          showBasic: false,
          formStatus: formStatus.VIEW
        });
      }
    }
  },
  _onEdit: function() {
    this.setState({
      formStatus: formStatus.EDIT,
      enableSave: true
    });
  },
  _onCancel: function() {
    TagAction.cancelSaveTag();
  },
  _onSave: function() {
    this.setState({
      isLoading: true
    });
    var selectedTag = this.state.selectedTag.toJS();
    if (selectedTag.Id === 0) {
      TagAction.createTag(selectedTag);
    } else {
      TagAction.modifyTag(selectedTag);
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
  _onDeleteTag: function() {
    var selectedTag = this.state.selectedTag;
    TagAction.deleteTagById(selectedTag.get('Id'), selectedTag.get('Version'));
  },
  _onAddTag: function() {
    var tag = {
      Checked: 0,
      Id: 0,
      Version: 0,
      Type: this.props.tagType,
      TypeName: "",
      Comment: '',
      TagGroupType: 0,
      TimezoneId: 1,
      CalculationType: 1,
      UomId: 1,
      UomName: "",
      CommodityId: 1,
      CommodityName: "",
      StartTime: null,
      HierarchyId: null,
      SystemDimensionId: null,
      AreaDimensionId: null,
      CustomerId: parseInt(customerId),
      GuidCode: 0,
      EnergyConsumption: 0,
      CalculationStep: this.props.tagType === 1 ? 6 : 1,
      Formula: "",
      DayNightRatio: false,
      ReverseFormula: false,
      HasAlarmSetting: false,
      IsAccumulated: false,
      Associatiable: false,
      SystemDimensionName: "",
      AreaDimensionName: "",
      HierarchyName: "",
      DimensionName: "",
      TagModifyMode: 0
    };
    this.setState({
      selectedIndex: null,
      selectedTag: Immutable.fromJS(tag)
    }, () => {
      this.setState({
        formStatus: formStatus.ADD,
        showBasic: true,
        enableSave: false
      });
    });
  },

  getTagList: function() {
    TagAction.getTagListByType(customerId,this.props.tagType, this.state.curPageNum, this.state.filterObj);
  },

  _onRawDataChange:function(newData,orgData){
      this.refs.tagDetail._setLoading();
      TagAction.modifyTagRawData(newData,orgData);

  },

  // _onTagDataChanged(){
  //   this.setState({
  //     isLoading:false
  //   })
  // },
  _onRawDataRollBack(tagId,start,end){
    this.refs.tagDetail._setLoading();
    if(this.refs.rawDataList){
      this.refs.rawDataList._setLoading();
    }
    TagAction.rollBack(tagId,start,end);
  },
  componentDidMount: function() {
    this.getTagList();
    //TagStore.addTagDatasChangeListener(this._onTagDataChanged);
    TagStore.addTagListChangeListener(this._onTagListChange);
    TagStore.addSelectedTagChangeListener(this._onSelectedTagChange);
    TagStore.addErrorChangeListener(this._onError);
  },
  componentWillUnmount: function() {
    //TagStore.removeTagDatasChangeListener(this._onTagDataChanged);
    TagStore.removeTagListChangeListener(this._onTagListChange);
    TagStore.removeSelectedTagChangeListener(this._onSelectedTagChange);
    TagStore.removeErrorChangeListener(this._onError);
    TagAction.setSelectedTagIndex(null);
  },
  componentWillMount: function() {
    customerId=this.context.currentRoute.params.customerId;
    // document.title = I18N.MainMenu.CustomerSetting;
  },
  componentDidUpdate: function() {
    // if (window.lastLanguage !== window.currentLanguage) {
    //   document.title = I18N.MainMenu.CustomerSetting;
    //   window.lastLanguage = window.currentLanguage;
    // }
  },
  render() {
    var me = this,
      selectedTag = me.state.selectedTag,
      rightPanel = null,
      isAdd = this.state.formStatus === formStatus.ADD,
      filterProps = {
        handleFilter: me._handleFilter,
        onClose: me._handleCloseFilterSideNav,
        filterObj: me.state.filterObj,
        mergeFilterObj: me._mergeFilterObj
      };
    var filterPanel = null;
    if (me.state.showFilter) {
      filterPanel = <TagFilter {...filterProps}/>;
    }
    if (me.state.isLoading) {
      return (<div className='jazz-tag-loading'><div style={{
          margin: 'auto',
          width: '100px'
        }}><CircularProgress  mode="indeterminate" size={80} /></div></div>);
    } else if (selectedTag !== null) {
      var rightProps = {
        ref: 'tagDetail',
        formStatus: me.state.formStatus,
        selectedTag: selectedTag,
        showLeft: me.state.showLeft,
        showBasic: me.state.showBasic,
        showDeleteDialog: me.state.showDeleteDialog,
        tagType: me.props.tagType,
        onCancel: this._onCancel,
        onSave: this._onSave,
        onDelete: this._onDelete,
        onCloseDialog: this._onCloseDialog,
        onDeleteTag: this._onDeleteTag,
        onEdit: this._onEdit,
        onToggle: this._onToggle,
        onSwitchTab: this._onSwitchTab,
        mergeTag: this._mergeTag,
        enableSave: this.state.enableSave,
        onSwitchRawDataListView: this._onSwitchRawDataListView,
        showRawDataList: this.state.showRawDataList,
        onRawDataRollBack:this._onRawDataRollBack
      };
      rightPanel = <TagDetail {...rightProps}/>;
    }
    var totalPageNum = parseInt((me.state.total + 19) / 20),
      hasJumpBtn = (me.state.total === 0) ? false : true;
    let items = [];
    var tagList = me.state.tagList;
    if (tagList && tagList.size !== 0) {
      items = tagList.map(function(item, i) {
        let props = {
          index: i,
          key: i,
          label: item.get('Name'),
          text: I18N.Common.Glossary.Code + ' : ' + item.get('Code'),
          selectedIndex: me.state.selectedIndex,
          onItemClick: me._onItemClick
        };
        return (
          <Item {...props}/>
          );
      });
    }
    var leftProps = {
      ref: 'tagList',
      isAddStatus: isAdd,
      contentItems: items,
      onAddBtnClick: me._onAddTag,
      onExportBtnClick: me._onExportTag,
      onPrePage: me._onPrePage,
      onNextPage: me._onNextPage,
      onJumpToPage: me._onJumpToPage,
      hasJumpBtn: hasJumpBtn,
      curPageNum: me.state.curPageNum,
      totalPageNum: totalPageNum,
      onSearch: me._onSearch,
      onSearchCleanButtonClick: me._onSearchCleanButtonClick,
      onFilter: me._handleShowFilterSideNav,
      isFilter: me.state.isFilter,
      filterObj: me.state.filterObj,
      resetFilterObj: me._resetFilterObj,
      tagType: me.props.tagType
    };
    var leftPanel = (me.state.showLeft) ? <div style={{
      display: 'flex'
    }}><TagList {...leftProps}/></div> : <div style={{
      display: 'none'
    }}><TagList {...leftProps}/></div>;
    var RawDataListPanel = null;
    if (this.state.selectedTag !== null && this.props.tagType === 1) {
      var listProps = {
        ref:'rawDataList',
        isRawData: this.state.isRawData,
        step: this.state.selectedTag.get('CalculationStep'),
        onRawDataChange:this._onRawDataChange
      };
      RawDataListPanel = (me.state.showRawDataList) ? <div style={{
        display: 'flex'
      }}><RawDataList {...listProps}/></div> : <div style={{
        display: 'none'
      }}><RawDataList {...listProps}/></div>;
    }

    return (
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'auto'
      }}>
        {leftPanel}
        {rightPanel}
        {filterPanel}
        {RawDataListPanel}
      </div>
      );
  },
});

module.exports = Tag;
