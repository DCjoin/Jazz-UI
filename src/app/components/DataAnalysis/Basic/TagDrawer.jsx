'use strict';
import React, { Component }  from "react";
import ReactDom from 'react-dom';
import Drawer from 'material-ui/Drawer';
import Header from 'controls/HierAndDimHeader.jsx';
import {nodeType} from 'constants/TreeConstants.jsx';
import { FontIcon, TextField,CircularProgress} from 'material-ui';
import TagStore from 'stores/TagStore.jsx';
import TagAction from 'actions/TagAction.jsx';
import TagMenu from '../../tag/TagMenu.jsx';
import Pagination from 'controls/paging/Pagination.jsx';
import CommodityStore from 'stores/CommodityStore.jsx';

var filters = null;
var timeoutID = null;
var customerId=null;
var page = 0;
var total=0;

export default class TagDrawer extends Component {

  contextTypes:{
    router: React.PropTypes.object,
  }

  constructor(props) {
		super(props);
		this._onSearch = this._onSearch.bind(this);
		this._onSearchClick = this._onSearchClick.bind(this);
		this._onSearchBlur = this._onSearchBlur.bind(this);
		this._onCleanButtonClick = this._onCleanButtonClick.bind(this);
		this._onHierachyTreeClick = this._onHierachyTreeClick.bind(this);
    this._onTagNodeChange = this._onTagNodeChange.bind(this);
    this._onAlarmTagNodeChange = this._onAlarmTagNodeChange.bind(this);


	}

  state={
    isLoading:this.props.hierarchyId?true:false,
    searchValue:'',
    tagList: [],
    tagId: this.props.tagId,
    optionType: null,
  }

  _onTagNodeChange() {
    var data = TagStore.getData();
    total=data.total;
    this.setState({
      tagList: data.Data,
      isLoading: false,
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
    optionType: 2,
    isLoading: false,
  });
}
  _onHierachyTreeClick(node,optionType){
    if(optionType===nodeType.Hierarchy){
      filters = null;
      ReactDom.findDOMNode(this.refs.searchIcon).style.display = 'block';
      TagAction.loadData(customerId,node.Id, nodeType.Hierarchy, 1, null, filters);
      page = 1;
      this.setState({
        isLoading: true,
        searchValue:'',
        tagId: node.Id,
        optionType: nodeType.Hierarchy,
      })
    }
    else {
      page = 1;
      if(node.Id !== 0){
        TagAction.loadData(customerId,node.Id, nodeType.Dimension, 1, null, filters);
        this.setState({
          tagId: node.Id,
          optionType: nodeType.Dimension,
          isLoading: true
        })
      }
      else {
        let id = this.refs.header.getCurrentHierarchyId();
        TagAction.loadData(customerId,id, nodeType.Hierarchy, 1, null, filters);
        this.setState({
          tagId: id,
          optionType: nodeType.Hierarchy,
          isLoading: true
        })
      }
    }
  }

  _onSearch(e) {
    var value = e.target.value;
    if (TagStore.getData().length === 0) {
      //FolderAction.setDisplayDialog('errornotice', null, I18N.Tag.SelectError);
    } else {
      if (value) {
        ReactDom.findDOMNode(this.refs.cleanIcon).style.display = 'block';
        filters = [
          {
            "type": "string",
            "value": [value],
            "field": "Name"
          }
        ];
      } else {
        ReactDom.findDOMNode(this.refs.cleanIcon).style.display = 'none';
        filters = null;
      }
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
      timeoutID = setTimeout(() => {
        page = 1;
        TagAction.loadData(customerId,this.state.tagId, this.state.optionType, page, null, filters);
      }, 200);
      this.setState({
        searchValue:value
      })
    }


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
    TagAction.loadData(customerId,this.state.tagId, this.state.optionType, page, null, filters);
    this.setState({
      searchValue:''
    })
  }

  _onPrePage() {
  if (page > 1) {
    page = page - 1;
    TagAction.loadData(customerId,this.state.tagId, this.state.optionType, page, null, filters);
  }
  }
  _onNextPage() {
  if (20 * page < total) {
    page = page + 1;
    TagAction.loadData(customerId,this.state.tagId, this.state.optionType, page, null, filters);

  }
  }
  _jumpToPage(targetPage) {
    page = targetPage;
    TagAction.loadData(customerId,this.state.tagId, this.state.optionType, page, null, filters);
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

    if (this.state.isLoading) {
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

  componentWillMount(){
    customerId=parseInt(this.props.customerId);
    //TagAction.resetTagInfo('DataAnalysis');
  }

  componentDidMount(){
    TagStore.addTagNodeListener(this._onTagNodeChange);
    if(this.props.hierarchyId){
      if(this.props.tagId){
        TagStore.addAlarmTagNodeListener(this._onAlarmTagNodeChange);
        let data = {
          hierId: this.props.hierarchyId,
          tagId: this.props.tagId
        };
        TagAction.loadAlarmData(data);
      }
      else {
        page=1;
        this.setState({
          tagId:this.props.hierarchyId,
          optionType:nodeType.Hierarchy
        },()=>{
          TagAction.loadData(customerId,this.props.hierarchyId, nodeType.Hierarchy, page, null, null);
        })
      }

    }
  }

  componentWillReceiveProps(){
      // this.setState({
      //   open:true
      // })
  }

  componentWillUnmount(){
      TagStore.removeTagNodeListener(this._onTagNodeChange);
    }

  render(){
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
      <Drawer
        docked={false}
        width={320}
        open={this.props.open}
        onRequestChange={this.props.onClose}
        overlayStyle={{opacity:'0'}}
        containerStyle={{display:'flex',overflow:'hidden'}}>
        <div className="jazz-analysis-tag">
          <div className="header">
            <Header ref="header" hierarchyId={this.props.hierarchyId} onHierachyTreeClick={this._onHierachyTreeClick} isBuilding={this.props.isBuilding}/>
          </div>
          <div  className="filter">
            <label className="search" onBlur={this._onSearchBlur}>
              <FontIcon className="icon-search" style={searchIconStyle} ref="searchIcon"/>
              <TextField style={textFieldStyle} underlineShow={false} value={this.state.searchValue} className="input" ref="searchText" onClick={this._onSearchClick} onChange={this._onSearch}/>
              <FontIcon className="icon-clean" style={cleanIconStyle} hoverColor='#6b6b6b' color="#939796" ref="cleanIcon" onClick={this._onCleanButtonClick}/>
            </label>
          </div>
          {this._renderTagList()}
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
