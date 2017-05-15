'use strict';
import React from "react";
import ReactDom from 'react-dom';
import classNames from 'classnames';
import { CircularProgress,Checkbox,IconButton,FlatButton,FontIcon,TextField} from 'material-ui';
import TagList from './TagList.jsx';
// import Header from 'controls/HierAndDimHeader.jsx';
import SearchBar from 'controls/SearchBar.jsx';
import ReportStore from 'stores/KPI/ReportStore.jsx';
import ReportAction from 'actions/KPI/ReportAction.jsx';
import Immutable from 'immutable';
import {nodeType} from 'constants/TreeConstants.jsx';
import DimAction from 'actions/DimAction.jsx';
import ProjectSelect from '../../DataAnalysis/Basic/ProjectSelect.jsx';
import Tree from 'controls/tree/Tree.jsx';
import DataAnalysisStore from 'stores/DataAnalysis/DataAnalysisStore.jsx';
var filters = null;

var customerId;
let TagSelectWindow = React.createClass({
  //mixins: [Navigation, State],
  contextTypes:{
        currentRoute: React.PropTypes.object
    },
  getInitialState: function() {
    return {
      isLeftLoading: true,
      isRightLoading: true,
      checkAll: false,
      checkAllDisabled: true,
      tagList: Immutable.fromJS([]),
      selectedTagList: Immutable.fromJS([]),
      searchValue:'',
      nodeId:this.props.hierarchyId,
      optionType:2,
      selectedHierId:this.props.hierarchyId,
      selectedDimNode:null,
      searchShow:false,
      dimTree:null,
    };
  },
  _getSelectedTagList() {
    return this.state.selectedTagList.map((item, i) => {
      return Immutable.fromJS({
        TagId: item.get('Id'),
        TagIndex: i
      });
    });
  },
  _getTagIds: function(tagList) {
    return tagList.map((item) => {
      return item.get('TagId');
    }).toJS();
  },
  _onCheckAll: function(e, checked) {
    var index,
      i;
    var tagList = this.state.tagList;
    var selectedTagList = this.state.selectedTagList;
    if (tagList.size !== 0) {
      if (checked) {
        for (i = 0; i < tagList.size; i++) {
          index = selectedTagList.findIndex((item) => {
            if (tagList.getIn([i, 'Id']) === item.get('Id')) {
              return true;
            }
          });
          if (index === -1) {
            selectedTagList = selectedTagList.push(tagList.get(i));
          }
        }
      } else {
        for (i = 0; i < tagList.size; i++) {
          index = selectedTagList.findIndex((item) => {
            if (tagList.getIn([i, 'Id']) === item.get('Id')) {
              return true;
            }
          });
          if (index !== -1) {
            selectedTagList = selectedTagList.delete(index);
          }
        }
      }
    }
    this.setState({
      checkAll: checked,
      selectedTagList: selectedTagList
    });
  },
  _onChange(){
  this.setState({
    dimTree:DataAnalysisStore.getAreaDimTree()
  })
  },
  _onTagListChange: function() {
    var checkAll = true;
    var tagList = ReportStore.getTagList();
    var selectedTagList = this.state.selectedTagList;
    var index;
    if (tagList.size === 0) {
      checkAll = false;
    } else {
      for (var i = 0; i < tagList.size; i++) {
        index = selectedTagList.findIndex((item) => {
          if (tagList.getIn([i, 'Id']) === item.get('Id')) {
            return true;
          }
        });
        if (index === -1) {
          checkAll = false;
          break;
        }
      }
    }
    this.setState({
      tagList: tagList,
      isLeftLoading: false,
      checkAll: checkAll
    });
  },
  _onSelectedTagListChange: function() {
    var selectedTagList = ReportStore.getSelectedTagList();
    var tagList = this.state.tagList;
    var index;
    var checkAll = true;
    if (tagList.size === 0) {
      checkAll = false;
    } else {
      for (var i = 0; i < tagList.size; i++) {
        index = selectedTagList.findIndex((item) => {
          if (tagList.getIn([i, 'Id']) === item.get('Id')) {
            return true;
          }
        });
        if (index === -1) {
          checkAll = false;
          break;
        }
      }
    }
    this.setState({
      selectedTagList: selectedTagList,
      isRightLoading: false,
      checkAll: checkAll
    });
  },
  _onTagItemSelected: function(id) {
    var tagList = this.state.tagList;
    var index;
    var checkAll = true;
    var addTag = tagList.find((item) => {
      if (id === item.get('Id')) {
        return true;
      }
    });
    var selectedTagList = this.state.selectedTagList;
    if (addTag) {
      selectedTagList = selectedTagList.push(addTag);
      for (var i = 0; i < tagList.size; i++) {
        index = selectedTagList.findIndex((item) => {
          if (tagList.getIn([i, 'Id']) === item.get('Id')) {
            return true;
          }
        });
        if (index === -1) {
          checkAll = false;
          break;
        }
      }
      this.setState({
        selectedTagList: selectedTagList,
        checkAll: checkAll
      });
    }
  },
  _onTagItemUnselected: function(id) {
    var tagList = this.state.tagList;
    var selectedTagList = this.state.selectedTagList;
    var index;
    var checkAll = true;
    var deleteTagIndex = selectedTagList.findIndex((item) => {
      if (id === item.get('Id')) {
        return true;
      }
    });
    if (deleteTagIndex !== -1) {
      selectedTagList = selectedTagList.delete(deleteTagIndex);
      for (var i = 0; i < tagList.size; i++) {
        index = selectedTagList.findIndex((item) => {
          if (tagList.getIn([i, 'Id']) === item.get('Id')) {
            return true;
          }
        });
        if (index === -1) {
          checkAll = false;
          break;
        }
      }
      if(selectedTagList.size===0){
        checkAll = false;
      }
      this.setState({
        selectedTagList: selectedTagList,
        checkAll: checkAll
      });
    }

  },
  _onProjectSelect(hierarchyId){
    this.setState({
      selectedHierId:hierarchyId,
      dimTree:null,
      tagList:[],
      nodeId: hierarchyId,
      optionType: nodeType.HierarchyOnly,
      isLeftLoading: true,
    },()=>{
      DimAction.loadall(hierarchyId);
      if(this.state.searchShow){
        this._onSearch({target:{value:this.state.searchValue}})
      }
    })
    },
  // _onHierachyTreeClick: function(node,optionType) {
  //   if (node.Id === this.state.nodeId && optionType === this.state.optionType) {
  //     return;
  //   }
  //
  //   filters = null;
  //
  //   ReportAction.getTagData(customerId,node.Id, optionType, filters,this.props.type);
  //   this.setState({
  //     isLeftLoading: true,
  //     nodeId: node.Id,
  //     optionType: optionType,
  //     searchValue:''
  //   });
  // },
  _onDimRollBack(){
    this.setState({
      selectedDimNode:null
    })
  },
  _onSearchShow(){
  this.setState({
    searchShow:!this.state.searchShow,
    searchValue:null,
    tagList:[]
  })
},
  _onSearch: function(e) {
    var value = e.target.value;
    if(value!==""){
      ReactDom.findDOMNode(this.refs.cleanIcon).style.display = 'block';
    }
    else {
      ReactDom.findDOMNode(this.refs.cleanIcon).style.display = 'none';
    }
    filters = [
      {
        "type": "string",
        "value": [value],
        "field": "Name"
      }
    ];
    this.setState({
      searchValue:value
    },()=>{
      ReportAction.getTagData(customerId,this.state.selectedHierId, nodeType.Hierarchy, filters,this.props.type);
    })

  },
  _onSearchCleanButtonClick: function() {
    ReactDom.findDOMNode(this.refs.cleanIcon).style.display = 'none';
    filters = null;
    this.setState({
      searchValue:'',
      tagList:[]
    },()=>{
      //ReportAction.getTagData(customerId,this.state.nodeId, this.state.optionType, filters,this.props.type);
    })

  },
  _onSearchBlur(e) {
  if (!e.target.value) {
    ReactDom.findDOMNode(this.refs.searchIcon).style.display = 'block';
  }
},
_onSearchClick() {
  ReactDom.findDOMNode(this.refs.searchIcon).style.display = 'none';
},
_onSelectDimNode(node){
  if(node.get("Type")===nodeType.Customer || node.get("Type")===nodeType.Building){
    filters = null;
    ReportAction.getTagData(customerId,node.get("Id"), nodeType.HierarchyOnly, filters,this.props.type);
    this.setState({
      nodeId: node.get("Id"),
      optionType: nodeType.HierarchyOnly,
      selectedDimNode:node,
      tagList:null
    })
  }
  else {
    filters=null;
    ReportAction.getTagData(customerId,node.get("Id"), nodeType.DimensionOnly, filters,this.props.type);
    this.setState({
        nodeId: node.get("Id"),
        optionType: nodeType.DimensionOnly,
        selectedDimNode:node,
        tagList:null
      })
    }
},
  _renderTagList(){
    var leftTagListHeader = <div style={{
      display: 'flex',
      flexDirection: 'row',
      paddingLeft: '7px',
      backgroundColor: '#f7f7f7',
      height: '33px',
      minHeight: '33px',
      'line-height': '30px',
      marginTop:'3px'
    }}>
        <div className='jazz-report-tag-checkbox'><Checkbox disabled={this.props.disabled} checked={this.state.checkAll} onCheck={this._onCheckAll}/></div>
        <div style={{
      width: '150px',
      fontSize:'14px',
      color:"#626469"
    }}>{I18N.Common.Glossary.Name}</div>
</div>;
    return(
      <div className='jazz-report-taglist'>
        {leftTagListHeader}
        <TagList tagList={this.state.tagList} selectedTagList={this.state.selectedTagList} isLoading={this.state.isLeftLoading} disabled={this.props.disabled} leftPanel={true} onTagItemSelected={this._onTagItemSelected} onTagItemUnselected={this._onTagItemUnselected}></TagList>
      </div>
    )
  },
  _renderSearchTag(){
  var searchIconStyle = {
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

  return(
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden'
      }}>
      <div  className="filter">
        <label className="search" onBlur={this._onSearchBlur}>
          <FontIcon className="icon-search" style={searchIconStyle} ref="searchIcon"/>
          <TextField style={textFieldStyle} underlineShow={false} value={this.state.searchValue || ''} className="input" hintStyle={{fontSize:'12px',top:'3px'}}
            ref="searchText" onClick={this._onSearchClick} onChange={this._onSearch} hintText={I18N.Setting.DataAnalysis.SearchHintText}/>
          <FontIcon className="icon-clean" style={cleanIconStyle} hoverColor='#6b6b6b' color="#939796" ref="cleanIcon" onClick={this._onSearchCleanButtonClick}/>
        </label>
      </div>
      {this._renderTagList()}
    </div>
  )
},
_renderDimTreeNode(nodeData){
  var type = nodeData.get("Type");
  var icon = (
  <div className="node-content-icon">
        <div className={classNames({
            "icon-customer": type === nodeType.Customer,
            "icon-building": type === nodeType.Building,
            "icon-dimension-node": type !== nodeType.Customer && type !== nodeType.Building,
  })}/>
      </div>
  );

  var text = (
  <div className="node-content-text">{nodeData.get("Name")}</div>
  );
  return (
    <div className="tree-node-content" style={{maxWidth:300}}>
      {icon}
      {text}

    </div>
    );
},
  _renderTree(){
  if(this.state.dimTree===null){
    return(
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
      alignItems: 'center',
      marginTop: '160px'
    }}>
        <CircularProgress  mode="indeterminate" size={80} />
      </div>
    )
  }
  else {
    var treeProps = {
        ref: 'dimtree',
        key: 'dimtree',
        collapsedLevel: 0,
        allNode: this.state.dimTree,
        onSelectNode: this._onSelectDimNode,
        selectedNode: this.state.selectedDimNode,
        generateNodeConent:this._renderDimTreeNode,
        nodeOriginPaddingLeft:0,
        treeClass:'jazz-analysis-tag-treeview',
        treeNodeClass: 'jazz-copy-tree'
     };
     return (<Tree {...treeProps}/>);
  }
},
  _renderLeftPanel(){
    var styles={
      label:{
        fontSize:'14px',
        color:'#0f0f0f'
      }
    }
    var leftPanelField = (<div style={{
      display: 'flex',
      flexDirection: 'column',
      height:'100%'
    }}>
      <div style={{
      fontSize:'14px',
      color:'#626469',
      marginBottom: '10px'
    }}>{I18N.EM.Report.AllTag}</div>
      <div className='jazz-report-taglist-container-left'>
        <div className="jazz-report-taglist-tagselect" >
          {this.state.selectedDimNode===null && <div className="header">
            <ProjectSelect width='250' hierarchyId={this.state.selectedHierId} customerId={customerId} onProjectSelected={this._onProjectSelect}/>
            {!this.state.searchShow && <IconButton iconClassName="icon-search" iconStyle={{fontSize:"15px",color:'#0f0f0f'}} className="jazz-analysis-tag-search-icon" onTouchTap={this._onSearchShow}/>}
            {this.state.searchShow && <div className="jazz-analysis-tag-search-cancel" onClick={this._onSearchShow} style={{marginRight:'10px'}}>{I18N.Common.Button.Cancel2}</div>}
          </div>}
          {this.state.selectedDimNode!==null && <div className="header">
            <FlatButton label={this.state.selectedDimNode.get('Name')}
              labelStyle={styles.label} className="jazz-analysis-tag-rollback" hoverColor="rgba(0,0,0,0)"
              icon={<FontIcon className="icon-return" style={styles.label}/>} onClick={this._onDimRollBack}/>
          </div>}
          {this.state.selectedDimNode===null && !this.state.searchShow && this._renderTree()}
          {this.state.selectedDimNode===null && this.state.searchShow && this._renderSearchTag()}
          {this.state.selectedDimNode!==null && this._renderTagList()}

        </div>

      </div></div>);

      return leftPanelField
  },
  componentWillMount:function(){
    customerId=this.context.currentRoute.params.customerId;
  },
  componentWillReceiveProps: function(nextProps) {
    var selectedTaglist = nextProps.selectedTagList;
    if (selectedTaglist && selectedTaglist.size !== 0) {
      var selectedTagIds = this._getTagIds(selectedTaglist);
      ReportAction.getSelectedTagData(customerId,selectedTagIds);
    }
    if(this.props.hierarchyId!==nextProps.hierarchyId){
      this.setState({
        selectedHierId:nextProps.hierarchyId
      },()=>{
        DimAction.loadall(nextProps.hierarchyId)
      })
}
  },
  componentDidMount: function() {
    DataAnalysisStore.addAreaDimListener(this._onChange);
    var selectedTaglist = this.props.selectedTagList;
    if (selectedTaglist && selectedTaglist.size !== 0) {
      var selectedTagIds = this._getTagIds(selectedTaglist);
      ReportAction.getSelectedTagData(customerId,selectedTagIds);
    } else if (selectedTaglist.size === 0) {
      this.setState({
        selectedTagList: Immutable.fromJS([]),
        isRightLoading: false
      });
    }
    if(this.props.hierarchyId){
    DimAction.loadall(this.props.hierarchyId);
  }
    ReportAction.getTagData(customerId,this.props.hierarchyId, 2, null,this.props.type);
    ReportStore.addTagListChangeListener(this._onTagListChange);
    ReportStore.addSelectedTagListChangeListener(this._onSelectedTagListChange);
  },
  componentWillUnmount: function() {
    ReportStore.removeTagListChangeListener(this._onTagListChange);
    ReportStore.removeSelectedTagListChangeListener(this._onSelectedTagListChange);
    DataAnalysisStore.removeAreaDimListener(this._onChange);
  },
  render() {
    var rightPanel = null;

    var rightTagListHeader = <div style={{
      display: 'flex',
      flexDirection: 'row',
      paddingLeft: '7px',
      backgroundColor: '#f7f7f7',
      height: '33px',
      minHeight: '33px',
      'line-height': '30px',
      fontSize:'14px',
      color:"#626469"
    }}>
          <div style={{
      width: '45px'
    }}>{I18N.Common.Glossary.Index}</div>
          <div style={{
      width: '135px'
    }}>{I18N.Common.Glossary.Name}</div>
          <div>{I18N.Setting.KPI.Report.Hierarchy}</div>
          <div></div>
        </div>;


    rightPanel = <div style={{
      display: 'flex',
      flexDirection: 'column',
      height:'100%'
    }}><div style={{
      marginLeft: '10px',
      marginBottom: '10px',
      fontSize:'14px',color:"#626469"
    }}>{I18N.EM.Report.SelectedTag}</div><div className='jazz-report-taglist-container-right'>
      {rightTagListHeader}
      <div className='jazz-report-taglist'>
          <TagList
            tagList={this.state.selectedTagList}
            isLoading={this.state.isRightLoading}
            disabled={this.props.disabled}
            leftPanel={false}
            onTagItemUnselected={this._onTagItemUnselected}
            onChangeOrder={(fromIdx, toIdx) => {
              let newSelectedTagList = this.state.selectedTagList.splice(
                fromIdx > toIdx ? toIdx : toIdx + 1, 0,
                this.state.selectedTagList.get(fromIdx));
              this.setState({
                selectedTagList: newSelectedTagList.delete(fromIdx > toIdx ? fromIdx + 1 : fromIdx)
              });

            }}/>
        </div></div></div>;

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        alignItems:'center'
      }}>
          {this._renderLeftPanel()}
          <FontIcon className="icon-arrow-right" style={{fontSize:'20px',margin:'0 15px'}} color="#83848a"/>
          {rightPanel}
        </div>
      );
  },
});

module.exports = TagSelectWindow;
