'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {IconButton,DropDownMenu,DatePicker,FlatButton,FontIcon,Menu,Checkbox,TextField} from 'material-ui';
import classnames from 'classnames';
import HierarchyButton from './HierarchyButton.jsx';
import DimButton from './DimButton.jsx';
import TagStore from '../stores/TagStore.jsx';
import TagAction from '../actions/TagAction.jsx';
import TBSettingAction from '../actions/TBSettingAction.jsx'
import AlarmTagStore from '../stores/AlarmTagStore.jsx';
import EnergyStore from '../stores/EnergyStore.jsx';
import Pagination from './tag/Pagination.jsx';
import TagMenu from './tag/TagMenu.jsx';

var menuItems = [
   { payload: '1', text: '全部' },
   { payload: '2', text: '报警已配置' },
   { payload: '3', text: '基准值已配置' },
   { payload: '4', text: '未配置' },

];
var alarmType=null;//alarmType:0:neither 1:baseline 2:both null:all
var filters=null;
var tagStatus=[];
var selectTotal=0;
var page=0;
var alarmTagOption=null;



let DataSelectMainPanel=React.createClass({
    mixins:[Navigation,State],
    propTypes: {
        linkFrom: React.PropTypes.string
    },
    _onHierachyTreeClick:function(node){
      if(node!=this.state.dimParentNode){
        TagAction.setCurrentHierarchyId(node.Id);
      }
      TagAction.loadData(node.Id,2,1,alarmType,filters);
      TBSettingAction.setHierId(node.Id);
      page=1;
       this.refs.dimButton.resetButtonName();
       this.setState({
         dimActive:true,
         dimParentNode:node,
         tagId:node.Id,
         optionType:2,
         HierarchyShow:false,
         DimShow:true
       });
    },
    _onDimTreeClick:function(node){

      TagAction.loadData(node.Id,6,1,alarmType,filters);
      this.setState({
        tagId:node.Id,
        optionType:6,
        HierarchyShow:true,
        DimShow:false
       })
    },
    _onHierarchButtonClick:function(){
      React.findDOMNode(this.refs.searchIcon).style.display='block';
      this.refs.searchText.setValue("");
      this.setState({
        HierarchyShow:true,
        DimShow:false
      });
    },
    _onDimButtonClick:function(){
      React.findDOMNode(this.refs.searchIcon).style.display='block';
      this.refs.searchText.setValue("");
      this.setState({
        HierarchyShow:false,
        DimShow:true
      })
    },

    _onTagNodeChange:function(){
      var data=TagStore.getData();
      this.setState({
        tagList:data.GetTagsByFilterResult,
        total:data.total,
      })
    },
    _onAlarmTagNodeChange:function(){
      var data=TagStore.getData();
      var alarmTag=EnergyStore.getTagOpions()[0];
      page=data.pageIndex;
      this.setState({
        tagList:data.GetPageTagDataResult,
        total:data.totalCount,
        tagId:alarmTag.hierId,
        optionType:2,
        dimActive:true
      })
    },


    _onPrePage:function(){
     if(page>1){
       page=page-1;
       TagAction.loadData(this.state.tagId,this.state.optionType,page,alarmType,filters);
      }
    },
    _onNextPage:function(){
      if(20*page<this.state.total){
                  page=page+1;
                  TagAction.loadData(this.state.tagId,this.state.optionType,page,alarmType,filters);

                        }
    },
    jumpToPage:function(targetPage){
      page=targetPage;
      TagAction.loadData(this.state.tagId,this.state.optionType,page,alarmType,filters);
    },
    _onAlarmFilter:function(e, selectedIndex, menuItem){
      switch(selectedIndex)
      {
      case 0:this.setState({
            dropdownmenuStyle:{
              width:'77px',
              height:'46px',

              float:'right',
              paddingLeft:'0'
            }
              });
            break;
      case 1:this.setState({
            dropdownmenuStyle:{
              width:'122px',
              height:'46px',
              float:'right'
            }
              });
            break;
      case 2:this.setState({
            dropdownmenuStyle:{
              width:'137px',
              height:'46px',
              float:'right'
            }
              });
            break;
      case 3:
      this.setState({
            dropdownmenuStyle:{
              width:'92px',
              height:'46px',
              float:'right'
            }
              });
            break;
          }
      alarmType=3-selectedIndex;
      if(alarmType==3) alarmType=null;
      page=1;
      TagAction.loadData(this.state.tagId,this.state.optionType,page,alarmType,filters);

      },
    _onSearch:function(e){
      var value= e.target.value;
      if(value){
        React.findDOMNode(this.refs.cleanIcon).style.display='block';
        filters=[
        {
          "type": "string",
          "value": [value],
          "field": "Name"
        }
        ]
      }
      else{
          React.findDOMNode(this.refs.cleanIcon).style.display='none';
        filters=null
      };
      page=1;
      TagAction.loadData(this.state.tagId,this.state.optionType,page,alarmType,filters);

    },
    _onSearchClick:function(){
      React.findDOMNode(this.refs.searchIcon).style.display='none';
    },
    _onSearchBlur:function(e){
      if(!e.target.value){
          React.findDOMNode(this.refs.searchIcon).style.display='block';
      }
    },
    _onCleanButtonClick:function(){
      React.findDOMNode(this.refs.cleanIcon).style.display='none';
      this.refs.searchText.setValue("");
      filters=null;
      TagAction.loadData(this.state.tagId,this.state.optionType,page,alarmType,filters);
    },
    _onSelectFull:function(fullFlag){
      this.setState({
        checkAbled:fullFlag
      })

    },
    _onCheckSelect:function(checkFlag){
      this.setState({
        allCheckDisable:checkFlag
      })
    },
    _onClearTagList:function(){
      tagStatus.length=0;
      tagStatus[page]=new Array();

      this.setState({
        allChecked:false,
        allCheckDisable:false
      });
    },
    _onSearchTagListChange:function(){
      var searchTagList=AlarmTagStore.getSearchTagList();
      this.state.tagList.forEach(function(nodeData,i){
        var tagFlag=false;
        searchTagList.forEach(function(tagData){
          if(tagData.tagId==nodeData.Id){
            tagFlag=true;
            if(tagStatus[page][i]==false){
              tagStatus[page][i]=true;
              selectTotal++;
            }
          }
        });
        if(!tagFlag){
          tagStatus[page][i]=false;
          selectTotal--
        }
      });
    this.setState({
      searchTagListChanged:true
    });
    },
    _onTagTotalChange:function(){

    },
    getInitialState: function() {
          return {
            dimActive:false,
            dimNode:null,
            dimParentNode:null,
            HierarchyShow:false,
            DimShow:false,
            tagList:null,
            allChecked:false,
            tagId:null,
            optionType:null,
            total:0,
            checkAbled:false,
            allCheckDisable:false,
            searchTagListChanged:false,
            dropdownmenuStyle:{
              width:'77px',
              height:'46px',
              float:'right'
            }
          };
        },
    componentWillMount:function(){
      //linkFrom="Alarm"时，读取初始tag状态
      if(this.props.linkFrom=="Alarm"){
          alarmTagOption = EnergyStore.getTagOpions()[0];
          }
      },
    componentDidMount: function() {
      TagStore.addTagNodeListener(this._onTagNodeChange); //listener for load tag
      TagAction.resetTagInfo();
      if(this.props.linkFrom=="Alarm"){
        TagStore.addAlarmTagNodeListener(this._onAlarmTagNodeChange);
        TagAction.loadAlarmData(alarmTagOption);
        //set the first tag select status from alarm left panel
        TagAction.setTagStatusById(alarmTagOption.hierId,alarmTagOption.tagId);

      }
     },
    componentWillUnmount: function() {

       TagStore.removeTagNodeListener(this._onTagNodeChange);
       if(this.props.linkFrom=="Alarm"){
         TagStore.removeAlarmTagNodeListener(this._onAlarmTagNodeChange);

       }

      },

    render:function(){
      if(this.props.linkFrom!="Alarm"){
        alarmTagOption={
          hierId:null,
          tagId:null
        }
      }
      var buttonStyle = {
               height:'48px',
           },
           searchIconStyle={
             fontSize:'20px'
           },
           cleanIconStyle={
             marginTop:'3px',
             fontSize:'16px',
             display:'none'
           },
           textFieldStyle={
             flex:'1',
             height:'26px'
           };
      var menupaper,pagination;
      alarmType=null;
      filters=[];
      if(this.state.tagList){
       menupaper=<TagMenu tagList={this.state.tagList}/>;
       pagination=<Pagination onPrePage={this._onPrePage}
                                             onNextPage={this._onNextPage}
                                             jumpToPage={this.jumpToPage}
                                             curPageNum={page}
                                             totalPageNum={parseInt((this.state.total+19)/20)}/>;
      }

      return(
        <div className="jazz-dataselectmainpanel" style={{flex:1}}>

          <div  className="header">
            <HierarchyButton hierId={alarmTagOption.hierId} onTreeClick={this._onHierachyTreeClick} onButtonClick={this._onHierarchButtonClick} show={this.state.HierarchyShow}/>

            <div style={{color:'#ffffff'}}>-</div>

         <DimButton ref={'dimButton'} active={this.state.dimActive} onTreeClick={this._onDimTreeClick} parentNode={this.state.dimParentNode} onButtonClick={this._onDimButtonClick} show={this.state.DimShow}/>
          </div>
          <div  className="filter">
            <label className="search" onBlur={this._onSearchBlur}>
              <FontIcon className="icon-search" style={searchIconStyle} ref="searchIcon"/>
              <TextField style={textFieldStyle} className="input" ref="searchText" onClick={this._onSearchClick} onChange={this._onSearch}/>
              <FontIcon className="icon-clean" style={cleanIconStyle} hoverColor='#6b6b6b' color="#939796" ref="cleanIcon" onClick={this._onCleanButtonClick}/>
          </label>

          <DropDownMenu autoWidth={false}  className="dropdownmenu" style={this.state.dropdownmenuStyle} menuItems={menuItems} onChange={this._onAlarmFilter} />

          </div>

         {menupaper}
         {pagination}

        </div>


      )
    }
  });


  module.exports = DataSelectMainPanel;
