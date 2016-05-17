'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import { IconButton, DropDownMenu, DatePicker, FlatButton, FontIcon, Menu, Checkbox, TextField, CircularProgress } from 'material-ui';
import classnames from 'classnames';
import HierarchyButton from './Hierarchy/HierarchyButton.jsx';
import DimButton from './Dim/DimButton.jsx';
import TagStore from '../stores/TagStore.jsx';
import TagAction from '../actions/TagAction.jsx';
import TBSettingAction from '../actions/TBSettingAction.jsx'
import AlarmTagStore from '../stores/AlarmTagStore.jsx';
import EnergyStore from '../stores/EnergyStore.jsx';
import AlarmSettingStore from '../stores/AlarmSettingStore.jsx';
import Pagination from '../controls/paging/Pagination.jsx';
import TagMenu from './tag/TagMenu.jsx';
import LabelMenuAction from '../actions/LabelMenuAction.jsx';
import CommodityAction from '../actions/CommodityAction.jsx';
import CommodityStore from '../stores/CommodityStore.jsx';
import FolderAction from '../actions/FolderAction.jsx';


var alarmType = null; //alarmType:0:neither 1:baseline 2:both null:all
var filters = null;
var tagStatus = [];
var selectTotal = 0;
var page = 0;
var alarmTagOption = null;



let DataSelectMainPanel = React.createClass({
  mixins: [Navigation, State],
  propTypes: {
    linkFrom: React.PropTypes.string,
    widgetType: React.PropTypes.string, //energy,unit,ratio,labelling
  },
  _onHierachyTreeClick: function(node) {
    if (node != this.state.dimParentNode) {
      TagAction.setCurrentHierarchyId(node.Id);
      filters = null;
      alarmType = null;
      React.findDOMNode(this.refs.searchIcon).style.display = 'block';
      TagAction.setCurrentDimentionInfo(null, null);
      CommodityAction.setCurrentDimInfo(null);
      this.refs.searchText.setValue("");
      if (this.props.widgetType) {
        CommodityAction.setCurrentHierarchyInfo(node);
      }

      if (this.props.widgetType == 'Energy' || this.props.linkFrom == "Alarm") {
        this.refs.dropDownMenu.setState({
          selectedIndex: 0
        });
      }

    }
    TagAction.loadData(node.Id, 2, 1, alarmType, filters);
    TBSettingAction.setHierId(node.Id);
    LabelMenuAction.setHierNode(node);
    page = 1;
    this.refs.dimButton.resetButtonName();
    this.setState({
      dimActive: true,
      dimParentNode: node,
      tagId: node.Id,
      optionType: 2,
      HierarchyShow: false,
      DimShow: true,
      isLoading: true,
      dimId: null
    });
  },
  _onDimTreeClick: function(node) {
    page = 1;
    if (node.Id !== 0) {
      TagAction.setCurrentDimentionInfo(node.Id, node.Name);
      CommodityAction.setCurrentDimInfo(node);
      TagAction.loadData(node.Id, 6, 1, alarmType, filters);
      this.setState({
        tagId: node.Id,
        dimId: node.Id,
        optionType: 6,
        HierarchyShow: true,
        DimShow: false,
        isLoading: true
      });
    } else {
      TagAction.setCurrentDimentionInfo(null, null);
      CommodityAction.setCurrentDimInfo(null);
      let id = TagStore.getCurrentHierarchyId();
      TagAction.loadData(id, 2, 1, alarmType, filters);
      this.setState({
        tagId: id,
        dimId: null,
        optionType: 2,
        HierarchyShow: true,
        DimShow: false,
        isLoading: true
      });
    }

  },
  _onHierarchButtonClick: function() {
    React.findDOMNode(this.refs.searchIcon).style.display = 'block';
    this.refs.searchText.setValue("");
    this.setState({
      HierarchyShow: true,
      DimShow: false
    });
  },
  _onDimButtonClick: function() {
    React.findDOMNode(this.refs.searchIcon).style.display = 'block';
    this.refs.searchText.setValue("");
    this.setState({
      HierarchyShow: false,
      DimShow: true
    });
  },

  _onTagNodeChange: function() {
    var data = TagStore.getData();
    this.setState({
      tagList: data.Data,
      total: data.total,
      isLoading: false,
    });
  },
  _onAlarmTagNodeChange: function() {
    var data = TagStore.getData();
    var node, tagId;
    if (this.props.widgetType) {
      let hierNode = CommodityStore.getHierNode();
      if (!!hierNode) {
        node = {
          Id: hierNode.hierId,
          Name: hierNode.hierName
        };
        tagId = hierNode.hierId;
      }
    } else {
      var alarmTag = EnergyStore.getTagOpions()[0];
      node = {
        Id: alarmTag.hierId,
        Name: alarmTag.hierName
      };
      tagId = alarmTag.hierId;
    }

    page = data.pageIndex;
    this.refs.dimButton.resetButtonName();
    this.setState({
      tagList: data.Data,
      total: data.total,
      tagId: tagId,
      dimParentNode: node,
      optionType: 2,
      dimActive: true,
      isLoading: false,
    });
  },


  _onPrePage: function() {
    if (page > 1) {
      page = page - 1;
      TagAction.loadData(this.state.tagId, this.state.optionType, page, alarmType, filters);
    }
  },
  _onNextPage: function() {
    if (20 * page < this.state.total) {
      page = page + 1;
      TagAction.loadData(this.state.tagId, this.state.optionType, page, alarmType, filters);

    }
  },
  jumpToPage: function(targetPage) {
    page = targetPage;
    TagAction.loadData(this.state.tagId, this.state.optionType, page, alarmType, filters);
  },
  _onAlarmFilter: function(e, selectedIndex, menuItem) {
    switch (selectedIndex) {
      case 0:this.setState({
          dropdownmenuStyle: {
            width: '77px',
            height: '46px',
            minWidth: '77px',
            float: 'right',
            paddingLeft: '0'
          }
        });
        break;
      case 1:this.setState({
          dropdownmenuStyle: {
            width: '122px',
            minWidth: '122px',
            height: '46px',
            float: 'right'
          }
        });
        break;
      case 2:this.setState({
          dropdownmenuStyle: {
            width: '137px',
            minWidth: '137px',
            height: '46px',
            float: 'right'
          }
        });
        break;
      case 3:
        this.setState({
          dropdownmenuStyle: {
            width: '92px',
            minWidth: '92px',
            height: '46px',
            float: 'right'
          }
        });
        break;
    }
    alarmType = 3 - selectedIndex;
    if (alarmType == 3)
      alarmType = null;
    page = 1;
    TagAction.loadData(this.state.tagId, this.state.optionType, page, alarmType, filters);

  },
  _onSearch: function(e) {
    var value = e.target.value;
    if (TagStore.getData().length === 0) {
      FolderAction.setDisplayDialog('errornotice', null, I18N.Tag.SelectError);
    } else {
      if (value) {
        React.findDOMNode(this.refs.cleanIcon).style.display = 'block';
        filters = [
          {
            "type": "string",
            "value": [value],
            "field": "Name"
          }
        ];
      } else {
        React.findDOMNode(this.refs.cleanIcon).style.display = 'none';
        filters = null;
      }
      page = 1;
      TagAction.loadData(this.state.tagId, this.state.optionType, page, alarmType, filters);
    }


  },
  _onSearchClick: function() {
    React.findDOMNode(this.refs.searchIcon).style.display = 'none';
  },
  _onSearchBlur: function(e) {
    if (!e.target.value) {
      React.findDOMNode(this.refs.searchIcon).style.display = 'block';
    }
  },
  _onCleanButtonClick: function() {
    React.findDOMNode(this.refs.cleanIcon).style.display = 'none';
    this.refs.searchText.setValue("");
    filters = null;
    TagAction.loadData(this.state.tagId, this.state.optionType, page, alarmType, filters);
  },
  _onSelectFull: function(fullFlag) {
    this.setState({
      checkAbled: fullFlag
    });

  },
  _onCheckSelect: function(checkFlag) {
    this.setState({
      allCheckDisable: checkFlag
    });
  },
  _onClearTagList: function() {
    tagStatus.length = 0;
    tagStatus[page] = new Array();

    this.setState({
      allChecked: false,
      allCheckDisable: false
    });
  },
  _onNodeLoadingChange: function() {
    this.setState({
      isLoading: TagStore.getNodeLoading(),
    });
  },
  _onSettingDataChange: function() {
    TagAction.loadData(this.state.tagId, this.state.optionType, page, alarmType, filters);
  },
  getInitialState: function() {
    return {
      isLoading: false,
      dimActive: false,
      dimId: null,
      dimParentNode: null,
      HierarchyShow: false,
      DimShow: false,
      tagList: [],
      allChecked: false,
      tagId: null,
      optionType: null,
      total: 0,
      checkAbled: false,
      allCheckDisable: false,
      searchTagListChanged: false,
      dropdownmenuStyle: {
        width: '77px',
        minWidth: '77px',
        height: '46px',
        float: 'right'
      }
    };
  },
  componentWillMount: function() {
    //linkFrom="Alarm"时，读取初始tag状态
    if (this.props.linkFrom == "Alarm") {
      alarmTagOption = EnergyStore.getTagOpions()[0];
      let node = {
        Id: alarmTagOption.hierId,
        Name: alarmTagOption.hierName
      };
      this.setState({
        dimParentNode: node
      });
    }

    if (!this.props.widgetType) {
      TagAction.resetTagInfo(this.props.widgetType);
    }



  },
  componentWillReceiveProps: function() {
    if (this.props.linkFrom == "Alarm") {
      alarmTagOption = EnergyStore.getTagOpions()[0];
      TagAction.resetTagInfo(this.props.widgetType);
      TagAction.loadAlarmData(alarmTagOption);
      this.setState({
        isLoading: true
      });
      //set the first tag select status from alarm left panel
      if (AlarmTagStore.getSearchTagList().length !== 0) {
        TagAction.setTagStatusById(alarmTagOption.hierId, alarmTagOption.tagId);
      }

    }

  },
  componentDidMount: function() {
    TagStore.addTagNodeListener(this._onTagNodeChange); //listener for load tag
    TagStore.addNodeLoadingListener(this._onNodeLoadingChange);
    TagStore.addSettingDataListener(this._onSettingDataChange);


    if (this.props.linkFrom == "Alarm") {
      TagStore.addAlarmTagNodeListener(this._onAlarmTagNodeChange);
      TagAction.loadAlarmData(alarmTagOption);
      this.setState({
        isLoading: true
      });

      //set the first tag select status from alarm left panel
      if (AlarmTagStore.getSearchTagList().length !== 0) {
        TagAction.setTagStatusById(alarmTagOption.hierId, alarmTagOption.tagId);
      }


    }
    if (this.props.widgetType) {
      let hierNode = CommodityStore.getHierNode();
      let dimNode = CommodityStore.getCurrentDimNode();
      let node;
      if (!!dimNode) {
        this.setState({
          dimId: dimNode.dimId
        });
      }
      if (!!hierNode) {
        node = {
          Id: hierNode.hierId,
          Name: hierNode.hierName
        };
        this.setState({
          dimParentNode: node,
          dimActive: true,
        });
        let tagId = TagStore.getCurrentHierIdTagStatus().last();
        let data = {
          hierId: hierNode.hierId,
          tagId: tagId
        };
        if (!!tagId) {
          TagStore.addAlarmTagNodeListener(this._onAlarmTagNodeChange);
          TagAction.loadAlarmData(data);
          this.setState({
            isLoading: true
          });
        } else {
          page = 1;
          TagAction.loadData(hierNode.hierId, 2, 1, null, null);
          this.setState({
            tagId: hierNode.hierId,
            optionType: 2,
            isLoading: true
          });
        }

      }
    }
  },
  componentWillUnmount: function() {

    TagStore.removeTagNodeListener(this._onTagNodeChange);
    TagStore.removeNodeLoadingListener(this._onNodeLoadingChange);
    TagStore.removeSettingDataListener(this._onSettingDataChange);
    if (this.props.linkFrom == "Alarm" || this.props.widgetType) {
      TagStore.removeAlarmTagNodeListener(this._onAlarmTagNodeChange);

    }
    if (this.props.linkFrom != "Alarm") {
      TagAction.clearAlarmSearchTagList();
    }
    // TagAction.setCurrentDimentionInfo(null, null);
    // CommodityAction.setCurrentDimInfo(null);

  },
  handleHierClickAway: function() {
    this.setState({
      HierarchyShow: false
    });
  },
  handleDimClickAway: function() {
    this.setState({
      DimShow: false
    });
  },
  render: function() {
    var menuItems = [
      {
        payload: '1',
        text: I18N.ALarm.Menu1
      },
      {
        payload: '2',
        text: I18N.ALarm.Menu2
      },
      {
        payload: '3',
        text: I18N.ALarm.Menu3
      },
      {
        payload: '4',
        text: I18N.ALarm.Menu4
      },

    ];

    var buttonStyle = {
        height: '48px',
      },
      searchIconStyle = {
        fontSize: '16px',
        marginLeft: '5px',
        marginTop: '3px'
      },
      cleanIconStyle = {
        marginTop: '3px',
        fontSize: '16px',
        display: 'none',
        marginRight: '5px'
      },
      textFieldStyle = {
        flex: '1',
        height: '26px'
      };
    var menupaper, pagination,
      totalPageNum = parseInt((this.state.total + 19) / 20),
      hasJumpBtn = (this.state.total == 0) ? false : true;

    if (this.state.tagList) {
      menupaper = <TagMenu tagList={this.state.tagList} widgetType={this.props.widgetType}/>;
      pagination = <Pagination previousPage={this._onPrePage}
      nextPage={this._onNextPage}
      jumpToPage={this.jumpToPage}
      curPageNum={page}
      totalPageNum={totalPageNum}
      hasJumpBtn={hasJumpBtn}/>;
    }
    var content;
    if (this.state.isLoading) {
      content = (  <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '160px'
      }}>
            <CircularProgress  mode="indeterminate" size={1} />
          </div>
      )
    } else {
      content = (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden'
        }}>
            {menupaper}
            <div style={{
          minHeight: '52px',
          paddingRight: '10px'
        }}>
              {pagination}
            </div>

          </div>

      )
    }
    var hierId = (this.state.dimParentNode === null) ? null : this.state.dimParentNode.Id;
    var dropDownMenu = (this.props.widgetType == 'Energy' || this.props.linkFrom == "Alarm") ?
      <DropDownMenu  ref="dropDownMenu"  disabled={this.state.dimParentNode === null} autoWidth={false}  className="dropdownmenu" style={this.state.dropdownmenuStyle} menuItems={menuItems} onChange={this._onAlarmFilter} />
      : <div style={{
        width: '20px'
      }}/>;
    return (
      <div className="jazz-dataselectmainpanel" style={{
        borderLeft: '1px solid #ececec'
      }}>

          <div  className="header">
            <HierarchyButton hierId={hierId}
      onTreeClick={this._onHierachyTreeClick}
      onButtonClick={this._onHierarchButtonClick}
      show={this.state.HierarchyShow}
      handleClickAway={this.handleHierClickAway}
      isDimTreeShow={false}/>

            <div style={{
        color: '#ffffff'
      }}>-</div>

         <DimButton ref={'dimButton'}
      lang={window.currentLanguage}
      active={this.state.dimActive}
      onTreeClick={this._onDimTreeClick}
      parentNode={this.state.dimParentNode}
      onButtonClick={this._onDimButtonClick}
      show={this.state.DimShow}
      handleClickAway={this.handleDimClickAway}
      dimId={this.state.dimId}/>
          </div>
          <div  className="filter">
            <label className="search" onBlur={this._onSearchBlur}>
              <FontIcon className="icon-search" style={searchIconStyle} ref="searchIcon"/>
              <TextField style={textFieldStyle} className="input" ref="searchText" onClick={this._onSearchClick} onChange={this._onSearch}/>
              <FontIcon className="icon-clean" style={cleanIconStyle} hoverColor='#6b6b6b' color="#939796" ref="cleanIcon" onClick={this._onCleanButtonClick}/>
          </label>

          {dropDownMenu}

          </div>

          {content}

        </div>


      )
  }
});


module.exports = DataSelectMainPanel;
