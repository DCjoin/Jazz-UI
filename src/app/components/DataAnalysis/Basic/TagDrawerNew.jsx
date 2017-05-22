'use strict';
import React, { Component }  from "react";
import ReactDom from 'react-dom';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import ProjectSelect from './ProjectSelect.jsx';
import IconButton from 'material-ui/IconButton';
import {CircularProgress,FontIcon,FlatButton,TextField} from 'material-ui';
import DataAnalysisStore from 'stores/DataAnalysis/DataAnalysisStore.jsx';
import Tree from 'controls/tree/Tree.jsx';
import DimAction from 'actions/DimAction.jsx';
import {nodeType} from 'constants/TreeConstants.jsx';
import TagStore from 'stores/TagStore.jsx';
import TagAction from 'actions/TagAction.jsx';
import TagMenu from '../../tag/TagMenu.jsx';
import Pagination from 'controls/paging/Pagination.jsx';
import CommodityStore from 'stores/CommodityStore.jsx';
import Immutable from 'immutable';

var page = 0;
var total=0;
var filters = null;
var timeoutID = null;

export default class TagDrawer extends Component {

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
    this._onProjectSelect = this._onProjectSelect.bind(this);
    this._onSelectDimNode = this._onSelectDimNode.bind(this);
    this._onTagNodeChange = this._onTagNodeChange.bind(this);
    this._onSearchShow = this._onSearchShow.bind(this);
    this._onSearchClick = this._onSearchClick.bind(this);
    this._onSearch = this._onSearch.bind(this);
    this._onSearchBlur = this._onSearchBlur.bind(this);
    this._onCleanButtonClick = this._onCleanButtonClick.bind(this);
    this._onAlarmTagNodeChange = this._onAlarmTagNodeChange.bind(this);

  }

  state={
    selectedHierId:this.props.hierarchyId,
    selectedDimNode:null,
    searchShow:false,
    searchFilter:null,
    dimTree:null,
    tagList:null,
    tagId: null,
    optionType: null,
  }

  _onChange(){
    this.setState({
      dimTree:DataAnalysisStore.getAreaDimTree()
    })
  }

  _onTagNodeChange() {
    var data = TagStore.getData();
    total=data.total;
    this.setState({
      tagList: data.Data,
    });
    }

    _onAlarmTagNodeChange() {
    var data = TagStore.getData();
    var tagId;

    let hierNode = CommodityStore.getHierNode();
      if (!!hierNode) {
        tagId = hierNode.hierId;
      }


    page = data.pageIndex;
    total=data.total;

    this.setState({
      tagList: data.Data,
      tagId: tagId,
      // optionType: 2,
      isLoading: false,
    });
  }

  _onProjectSelect(hierarchyId){
    this.setState({
      selectedHierId:hierarchyId,
      dimTree:null,
      tagList:[],
      tagId: hierarchyId,
      optionType: nodeType.HierarchyOnly,
    },()=>{
      DimAction.loadall(hierarchyId);
      TagAction.setCurrentHierarchyId(hierarchyId);
      if(this.state.searchShow){
        this._onSearch({target:{value:this.state.searchFilter}})
      }
    })
  }

  _onSelectDimNode(node){
    if(node.get("Type")===nodeType.Customer || node.get("Type")===nodeType.Building){
      filters = null;
      TagAction.loadData(this.props.customerId,node.get("Id"), nodeType.HierarchyOnly, 1, null, filters);
      page = 1;
      this.setState({
        tagId: node.get("Id"),
        optionType: nodeType.HierarchyOnly,
        selectedDimNode:node,
        tagList:null
      })
    }
    else {
      filters=null;
      page = 1;
      TagAction.loadData(this.props.customerId,node.get("Id"), nodeType.DimensionOnly, 1, null, filters);
      this.setState({
          tagId: node.get("Id"),
          optionType: nodeType.DimensionOnly,
          selectedDimNode:node,
          tagList:null
        })
      }
  }

  _onDimRollBack(){
    this.setState({
      selectedDimNode:null
    })
  }

  _onSearchShow(){
    page=0;
    filters=null;
    let searchShow=!this.state.searchShow;
    this.setState({
      searchShow,
      searchFilter:null,
      tagList:[],
      optionType:searchShow?nodeType.Hierarchy:nodeType.HierarchyOnly
    })
  }

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
  }

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
          //treeNodeClass: 'jazz-copy-tree',
          arrowClass: 'jazz-new-foldertree-arrow',
          arrowIconCollapsedClass: 'icon-arrow-fold',
          arrowIconExpandClass: 'icon-arrow-unfold',
          treeNodeClass: 'jazz-new-foldertree-node',
       };
       return (<Tree {...treeProps}/>);
    }
  }

  _onPrePage() {
  if (page > 1) {
    page = page - 1;
    TagAction.loadData(this.props.customerId,this.state.tagId, this.state.optionType, page, null, filters);
  }
  }
  _onNextPage() {
  if (20 * page < total) {
    page = page + 1;
    TagAction.loadData(this.props.customerId,this.state.tagId, this.state.optionType, page, null, filters);

  }
  }
  _jumpToPage(targetPage) {
    page = targetPage;
    TagAction.loadData(this.props.customerId,this.state.tagId, this.state.optionType, page, null, filters);
  }


  _renderTagList(){
    var menupaper, pagination,
        totalPageNum = parseInt((total + 19) / 20),
        hasJumpBtn = (total === 0) ? false : true;

    if (this.state.tagList) {
      menupaper = <TagMenu tagList={this.state.tagList} widgetType={'DataAnalysis'}/>;
      pagination = <Pagination previousPage={()=>{this._onPrePage()}}
      nextPage={()=>{this._onNextPage()}}
      jumpToPage={(page)=>{this._jumpToPage(page)}}
      curPageNum={page}
      totalPageNum={totalPageNum}
      hasJumpBtn={hasJumpBtn}/>;
    }

    if (this.state.tagList===null) {
      return(  <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
      alignItems: 'center',
      marginTop: '160px'
    }}>
        <CircularProgress  mode="indeterminate" size={80} />
      </div>
    )
  } else {
    return(
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
  }

  _onSearch(e) {
    var value = e.target.value;
      if (value!=="") {
        ReactDom.findDOMNode(this.refs.cleanIcon).style.display = 'block';
        filters = [
          {
            "type": "string",
            "value": [value],
            "field": "Name"
          }
        ];
        this.setState({
          searchFilter:value
        })
      } else {
        ReactDom.findDOMNode(this.refs.cleanIcon).style.display = 'none';
        filters = [
          {
            "type": "string",
            "value": [null],
            "field": "Name"
          }
        ];
        page=1;
        total=0;
        this.setState({
          searchFilter:value,
          tagList:[]
        })
      }
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
      timeoutID = setTimeout(() => {
        page = 1;
        TagAction.loadData(this.props.customerId,this.state.selectedHierId, nodeType.Hierarchy, page, null, filters);
      }, 200);


  }

  _onSearchClick() {
    ReactDom.findDOMNode(this.refs.searchIcon).style.display = 'none';
  }

  _onSearchBlur(e) {
    if (!e.target.value) {
      ReactDom.findDOMNode(this.refs.searchIcon).style.display = 'block';
    }
  }

  _onCleanButtonClick() {
    ReactDom.findDOMNode(this.refs.cleanIcon).style.display = 'none';
    //this.refs.searchText.setValue("");
    filters = null;
    //TagAction.loadData(this.props.customerId,this.state.selectedHierId, nodeType.Hierarchy, page, null, filters);
    this.setState({
      searchFilter:'',
      tagList:[]
    })
  }
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
            <TextField style={textFieldStyle} underlineShow={false} value={this.state.searchFilter || ''} className="input" hintStyle={{fontSize:'12px',top:'3px'}}
              ref="searchText" onClick={this._onSearchClick} onChange={this._onSearch} hintText={I18N.Setting.DataAnalysis.SearchHintText}/>

            <FontIcon className="icon-clean" style={cleanIconStyle} hoverColor='#6b6b6b' color="#939796" ref="cleanIcon" onClick={this._onCleanButtonClick}/>
          </label>
        </div>
        {this._renderTagList()}
      </div>
    )
  }

  componentDidMount(){
    DataAnalysisStore.addAreaDimListener(this._onChange);
    TagStore.addTagNodeListener(this._onTagNodeChange);
    // if(this.props.hierarchyId){
    //   DimAction.loadall(this.props.hierarchyId)
    // }

    if(this.props.hierarchyId){
        DimAction.loadall(this.props.hierarchyId);
      if(this.props.tagId){
        TagStore.addAlarmTagNodeListener(this._onAlarmTagNodeChange);
        let data = {
          hierId: this.props.hierarchyId,
          tagId: this.props.tagId,
          dimId:null
        },
        optionType=nodeType.HierarchyOnly;

        let hierNode=Immutable.fromJS({
          Id:this.props.hierarchyId,
          Name:DataAnalysisStore.getHierarchyName(this.props.hierarchyId)
        })
        let dimNode=Immutable.fromJS({
          Id:TagStore.getCurrentDimInfo().dimId,
          Name:TagStore.getCurrentDimInfo().dimName
        });
        if(dimNode.get('Id')){
          data.dimId=dimNode.get('Id'),
          optionType=nodeType.DimensionOnly
        }
        this.setState({
          selectedDimNode:TagStore.getCurrentDimInfo().dimId?dimNode:hierNode,
          optionType
        },()=>{
          TagAction.loadAlarmData(data);
        })
      }
      // else {
      //   page=1;
      //   this.setState({
      //     tagId:this.props.hierarchyId,
      //     optionType:nodeType.HierarchyOnly
      //   },()=>{
      //     TagAction.loadData(this.props.customerId,this.props.hierarchyId, nodeType.Hierarchy, page, null, null);
      //   })
      // }

    }
  }

  componentWillReceiveProps(nextProps){
      if(this.props.hierarchyId!==nextProps.hierarchyId){
        this.setState({
          selectedHierId:nextProps.hierarchyId
        },()=>{
          DimAction.loadall(nextProps.hierarchyId)
        })
      }
    }

  componentWillUnmount(){
    DataAnalysisStore.removeAreaDimListener(this._onChange);
    TagStore.removeTagNodeListener(this._onTagNodeChange);
  }

  render(){
    var styles={
      label:{
        fontSize:'14px',
        color:'#ffffff',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        marginLeft:'15px'
      }
    }
    return(
      <Drawer
        docked={false}
        width={237}
        open={this.props.open}
        onRequestChange={this.props.onClose}
        overlayStyle={{opacity:'0'}}
        containerStyle={{display:'flex',overflow:'hidden'}}>
        <div className="jazz-analysis-tag">
          {this.state.selectedDimNode===null && <div className="header">
            <ProjectSelect hierarchyId={this.state.selectedHierId} customerId={this.props.customerId} onProjectSelected={this._onProjectSelect}/>
            {!this.state.searchShow && <IconButton iconClassName="icon-search" iconStyle={{fontSize:"15px",color:'#fff'}} className="jazz-analysis-tag-search-icon" onTouchTap={this._onSearchShow}/>}
            {this.state.searchShow && <div className="jazz-analysis-tag-search-cancel" onClick={this._onSearchShow}>{I18N.Common.Button.Cancel2}</div>}
          </div>}
          {this.state.selectedDimNode!==null && <div className="header">
            <div className="jazz-analysis-tag-rollback" onClick={this._onDimRollBack.bind(this)} title={this.state.selectedDimNode.get('Name')}>
              <FontIcon className="icon-return" style={{fontSize:'14px', color:'#ffffff'}}/>
              <div style={styles.label}>
                {this.state.selectedDimNode.get('Name')}
              </div>
            </div>
          </div>}
        {this.state.selectedDimNode===null && !this.state.searchShow && this._renderTree()}
        {this.state.selectedDimNode===null && this.state.searchShow && this._renderSearchTag()}
        {this.state.selectedDimNode!==null && this._renderTagList()}
        </div>
      </Drawer>
    )
  }
}

TagDrawer.propTypes = {
	hierarchyId:React.PropTypes.number,
  isBuilding:React.PropTypes.bool,
  customerId:React.PropTypes.number,
};
