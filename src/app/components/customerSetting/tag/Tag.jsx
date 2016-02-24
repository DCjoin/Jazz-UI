'use strict';
import React from "react";
import classnames from "classnames";
import { CircularProgress } from 'material-ui';
import Item from '../../../controls/SelectableItem.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import Dialog from '../../../controls/PopupDialog.jsx';
import FlatButton from '../../../controls/FlatButton.jsx';
import TagList from './TagList.jsx';
//import TagNode from './TagNode.jsx';
import TagStore from '../../../stores/customerSetting/TagStore.jsx';
import TagAction from '../../../actions/customerSetting/TagAction.jsx';


let Tag = React.createClass({
  propTypes: {
    tagType: React.PropTypes.number
  },
  getDefaultProps: function() {
    return {
      tagType: 1
    };
  },
  getInitialState: function() {
    var filterObj = {
      CustomerId: parseInt(window.currentCustomerId),
      Type: this.props.tagType
    };
    if (this.props.tagType === 2) {
      filterObj.ReverseFormula = true;
    }
    return {
      isLoading: true,
      formStatus: formStatus.VIEW,
      filterObj: filterObj,
      showLeft: true,
      filterStatus: false,
      total: 0,
      curPageNum: 1
    };
  },
  _onToggle: function() {
    var showLeft = this.state.showLeft;
    this.setState({
      showLeft: !showLeft
    });
  },
  _onTagListChange: function() {
    var tagList = TagStore.getTagList();
    this.setState({
      tagList: tagList,
      total: TagStore.getTagTotalNum()
    });
  },
  _onError: function() {
    this.setState({
      isLoading: false
    });
  },
  _onSelectedTagChange: function() {
    var selectedIndex = TagStore.getSelectedTagIndex();
    var selectedData = TagStore.getSelectedTag();
    this.setState({
      isLoading: false,
      showDeleteDialog: false,
      formStatus: formStatus.VIEW,
      selectedIndex: selectedIndex,
      selectedData: selectedData
    });
  },
  _onPrePage: function() {
    var curPageNum = this.state.curPageNum;
    if (curPageNum > 1) {
      this.setState({
        curPageNum: curPageNum - 1
      }, () => {
        TagAction.getTagListByType(this.props.tagType, this.state.curPageNum, this.state.filterObj);
      });
    }
  },
  _onNextPage: function() {
    var curPageNum = this.state.curPageNum;
    if (20 * curPageNum < this.state.total) {
      this.setState({
        curPageNum: curPageNum + 1
      }, () => {
        TagAction.getTagListByType(this.props.tagType, this.state.curPageNum, this.state.filterObj);
      });
    }
  },
  _onJumpToPage: function(targetPage) {
    this.setState({
      curPageNum: targetPage
    }, () => {
      TagAction.getTagListByType(this.props.tagType, this.state.curPageNum, this.state.filterObj);
    });
  },
  _onSearch: function(value) {
    var filterObj = this.state.filterObj;
    filterObj.LikeCodeOrName = value;
    this.setState({
      filterObj: filterObj
    }, () => {
      TagAction.getTagListByType(this.props.tagType, this.state.curPageNum, this.state.filterObj);
    });
  },
  _onSearchCleanButtonClick: function() {
    var filterObj = this.state.filterObj;
    filterObj.LikeCodeOrName = null;
    this.setState({
      filterObj: filterObj
    }, () => {
      TagAction.getTagListByType(this.props.tagType, this.state.curPageNum, this.state.filterObj);
    });
  },
  _onExportTag: function() {
    var filterObj = this.state.filterObj;
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'TagImportExcel.aspx?filter=' + encodeURIComponent(JSON.stringify(filterObj)) + '&filters=' + encodeURIComponent(JSON.stringify([])) + '&sorters=' + encodeURIComponent(JSON.stringify([]));
    iframe.onload = function() {
      document.body.removeChild(iframe);
    };
    document.body.appendChild(iframe);
  },
  componentDidMount: function() {
    TagAction.getTagListByType(this.props.tagType, this.state.curPageNum, this.state.filterObj);
    TagStore.addTagListChangeListener(this._onTagListChange);
    TagStore.addSelectedTagChangeListener(this._onSelectedTagChange);
    TagStore.addErrorChangeListener(this._onError);
  },
  componentWillUnMount: function() {
    TagStore.removeTagListChangeListener(this._onTagListChange);
    TagStore.removeSelectedTagChangeListener(this._onSelectedTagChange);
    TagStore.removeErrorChangeListener(this._onError);
  //TagAction.setSelectedTagIndex(null);
  },
  componentWillMount: function() {
    document.title = I18N.MainMenu.CustomerSetting;
  },
  componentDidUpdate: function() {
    if (window.lastLanguage !== window.currentLanguage) {
      document.title = I18N.MainMenu.CustomerSetting;
      window.lastLanguage = window.currentLanguage;
    }
  },
  render() {
    var me = this,
      selectedTag = me.state.selectedTag,
      rightPanel = null,
      isView = this.state.formStatus === formStatus.VIEW,
      isEdit = this.state.formStatus === formStatus.EDIT,
      isAdd = this.state.formStatus === formStatus.ADD;
    if (me.state.isLoading) {
      return (<div className='jazz-tag-loading'><div style={{
          margin: 'auto',
          width: '100px'
        }}><CircularProgress  mode="indeterminate" size={2} /></div></div>);
    } else if (selectedTag !== null) {
    }
    var totalPageNum = parseInt((this.state.total + 19) / 20),
      hasJumpBtn = (this.state.total === 0) ? false : true;
    let items = [];
    var tagList = me.state.tagList;
    if (tagList && tagList.size !== 0) {
      items = tagList.map(function(item, i) {
        let props = {
          index: i,
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
      isViewStatus: isView,
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
      filterStatus: me.state.filterStatus,
      tagType: me.props.tagType
    };
    var leftPanel = (this.state.showLeft) ? <div style={{
      display: 'flex'
    }}><TagList {...leftProps}/></div> : <div style={{
      display: 'none'
    }}><TagList {...leftProps}/></div>;
    return (
      <div style={{
        display: 'flex',
        flex: 1
      }}>
      {leftPanel}
        <div className={classnames({
        "jazz-framework-right-expand": !me.state.showLeft,
        "jazz-framework-right-fold": me.state.showLeft
      })}>
          {rightPanel}
        </div>
      </div>
      );
  },
});

module.exports = Tag;
