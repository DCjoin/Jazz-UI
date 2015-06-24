'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {IconButton,DropDownMenu,DatePicker,FlatButton,FontIcon,Menu,Checkbox} from 'material-ui';
import classnames from 'classnames';
import HierarchyButton from './HierarchyButton.jsx';
import DimButton from './DimButton.jsx';
import TagStore from '../stores/TagStore.jsx';
import TagAction from '../actions/TagAction.jsx';
import TBSettingAction from '../actions/TBSettingAction.jsx'
import AlarmTagStore from '../stores/AlarmTagStore.jsx';
import EnergyStore from '../stores/EnergyStore.jsx';
import Pagination from './Pagination.jsx'

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

var CheckboxItem=React.createClass({
  mixins:[Navigation,State],
  propTypes: {
      title: React.PropTypes.string.isRequired,
      label:React.PropTypes.number,
      defaultChecked:React.PropTypes.bool,
      payload:React.PropTypes.number,
      selectFull:React.PropTypes.func,
      disabled:React.PropTypes.bool,
      nodeData:React.PropTypes.object,
      allcheck:React.PropTypes.bool

  },
  _onClick:function(){
    if(!this.props.disabled){

      if(tagStatus[page]===null){
        tagStatus[page]=new Array();
        tagStatus[page]=false;
      }

      tagStatus[page][this.props.payload]=!this.state.boxChecked;


      let tagData={
        hierId:this.props.nodeData.HierarchyId,
        hierName:this.props.nodeData.HierarchyName,
        tagId:this.props.nodeData.Id,
        tagName:this.props.nodeData.Name
      };

      if(!this.state.boxChecked)  {
        selectTotal++;
        AlarmTagStore.addSearchTagList(tagData)
      }
      else{
        selectTotal--;
        AlarmTagStore.removeSearchTagList(tagData)
      }

      if(selectTotal>=30){
        this.props.selectFull(true);
      }
      else {
        this.props.selectFull(false);
      }

      this.setState({
        boxChecked:!this.state.boxChecked
      });

      }

  },
  getInitialState: function() {
    return {
      boxChecked:this.props.defaultChecked
    };
  },
  componentWillReceiveProps:function(nextProps){
    this.setState({
      boxChecked:nextProps.defaultChecked
    })
  },

  render:function(){
    var alarm,baseline,checkBox;
    switch(this.props.label){
      case 0:
        alarm=<div className="disable">基准值未配置,</div>;
        baseline=<div className="disable">报警未配置</div>;
        break;
      case 1:
        alarm=<div className="able">基准值已配置,</div>;
        baseline=<div className="disable">报警未配置</div>;
        break;
      case 2:
        alarm=<div className="able">基准值已配置,</div>;
        baseline=<div className="able">报警已配置</div>;
        break;
    };
    var boxStyle={
      marginLeft:'20px',
      width:'24px'
    },
      iconstyle={
      marginTop:'11px'
    },
      labelstyle={
      width:'0px',
      height:'0px'
    };

    return(
      <div className="taglist"  onClick={this._onClick} >
        <Checkbox
            checked={this.state.boxChecked}
            disabled={this.props.disabled}
            style={boxStyle}
            iconStyle={iconstyle}
            labelStyle={labelstyle}
            />
          <div className="label">
            <div className="title">
            {this.props.title}
            </div>
            <div className="font">
              {alarm}
              {baseline}
          </div>

          </div>



      </div>
    )
  }
});
var TagMenu=React.createClass({

  propTypes: {
      checked: React.PropTypes.bool,
      total:React.PropTypes.number,
      disalbed:React.PropTypes.bool,
      onSelectFull:React.PropTypes.func,
      tagList:React.PropTypes.object,
      onAllCheck:React.PropTypes.func,
      allCheckDisable:React.PropTypes.bool,
      initialTagId:React.PropTypes.number
  },
  _onCheckSelect:function(checkFlag){
    this.setState({
        allCheckDisable:checkFlag
      })
  },
  getInitialState: function() {
    return {
      allCheckDisable:false
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      allCheckDisable:nextProps.allCheckDisable
    })
  },
  render:function(){
    let me = this;
    let nodemenuItems=[];
    let menuItem;
    var buttonStyle = {
         height:'25px',
       };
    var disalbed,
        checked=this.props.checked,
        onSelectFull=function(selectFlag){
          me.props.onSelectFull(selectFlag);
        };

    this.props.tagList.forEach(function(nodeData,i){
        if(me.props.disalbed){
          disalbed=!(tagStatus[page][i] || checked)
        }
        else{
          disalbed=me.props.disalbe
        };
        if(nodeData.Id==me.props.initialTagId){
          tagStatus[page][i]=true;
        };
        menuItem=<CheckboxItem payload={i} style={buttonStyle}
                            title={nodeData.Name} label={nodeData.AlarmStatus}
                            defaultChecked={tagStatus[page][i] || checked}
                            selectFull={onSelectFull}
                            disabled={disalbed}
                            nodeData={nodeData}
                            allcheck={checked}
                          />;
        nodemenuItems.push(menuItem);

      });

     var allCheckStyle = {
             margin:'11px 0 0 20px',
             fontSize:'14px',
             color:'#464949'
           },
         iconStyle={
           marginRight:'10px'
         };

  return(
    <div>
      <div className="allcheck">
        <Checkbox
          label="全选"
          onCheck={this.props.onAllCheck}
          checked={this.props.checked}
          disabled={this.state.allCheckDisable}
          style={allCheckStyle}
          />
      </div>

      <div style={{'overflow':'auto',height:'480px'}}>
        {nodemenuItems}
      </div>


  </div>


  )
  }
});
let DataSelectMainPanel=React.createClass({
    mixins:[Navigation,State],
    propTypes: {
        linkFrom: React.PropTypes.string
    },
    _onHierachyTreeClick:function(node){
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
       })
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

      this.setState({
        HierarchyShow:true,
        DimShow:false
      })
    },
    _onDimButtonClick:function(){

      this.setState({
        HierarchyShow:false,
        DimShow:true
      })
    },
    _onTagNodeChange:function(){
      var data=TagStore.getData();
      if(tagStatus[page]==null){
        tagStatus[page]=new Array();
      }
         if(selectTotal>10){
           this.setState({
             tagList:data.GetTagsByFilterResult,
             total:data.total,
             allChecked:false,
             allCheckDisable:true
           })
         }
         else{
           this.setState({
             tagList:data.GetTagsByFilterResult,
             total:data.total,
             allChecked:false,
             allCheckDisable:false
           })
         }


    },
    _onAlarmTagNodeChange:function(){
      var data=TagStore.getData();
      var alarmTag=EnergyStore.getTagOpions()[0];
      selectTotal=1;
      page=data.pageIndex;
      tagStatus[data.pageIndex]=[];
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
    _onAllCheck:function(){
      var that=this;
        this.state.tagList.forEach(function(nodeData,i){
          tagStatus[page][i]=!that.state.allChecked;
          let tagData={
            hierId:nodeData.HierarchyId,
            hierName:nodeData.HierarchyName,
            tagId:nodeData.Id,
            tagName:nodeData.Name
          };
          if(!that.state.allChecked){
            AlarmTagStore.addSearchTagList(tagData)
          }
          else{
            AlarmTagStore.removeSearchTagList(tagData)
          }
        });
        selectTotal+=(this.state.allChecked?1:(-1))*20;
        if(selectTotal>10){
          this.setState({
            allChecked:!this.state.allChecked,
            allCheckDisable:true
          })
        }
        else{
          this.setState({
            allChecked:!this.state.allChecked,
            allCheckDisable:false
          })
        }

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
    _onSearch:function(){
      var value= document.getElementById("searchField").value;
      if(value){
        filters=[
        {
          "type": "string",
          "value": [value],
          "field": "Name"
        }
        ]
      }
      else{
        filters=null
      };
      page=1;
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
            page:0,
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
      if(this.props.linkFrom=="Alarm"){
          alarmTagOption = EnergyStore.getTagOpions()[0];
      }
      },
    componentDidMount: function() {
      TagStore.addTagNodeListener(this._onTagNodeChange);
      AlarmTagStore.addClearDataListener(this._onClearTagList);
      AlarmTagStore.addAddSearchTagListListener(this._onSearchTagListChange);
      AlarmTagStore.addRemoveSearchTagListListener(this._onSearchTagListChange);
      TBSettingAction.ResetHierId();
      TBSettingAction.ResetTagId();
      if(this.props.linkFrom=="Alarm"){
        TagStore.addAlarmTagNodeListener(this._onAlarmTagNodeChange);
        TagAction.loadAlarmData(alarmTagOption);

      }
     },
    componentWillUnmount: function() {

       TagStore.removeTagNodeListener(this._onTagNodeChange);
       AlarmTagStore.removeClearDataListener(this._onClearTagList);
       AlarmTagStore.removeAddSearchTagListListener(this._onSearchTagListChange);
       AlarmTagStore.removeRemoveSearchTagListListener(this._onSearchTagListChange);
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
           };
      var menupaper,pagination;
      alarmType=null;
      filters=[];
      if(this.state.tagList){
        menupaper=<TagMenu checked={this.state.allChecked}
                            total={this.state.total}
                            disalbed={this.state.checkAbled}
                            onSelectFull={this._onSelectFull}
                            tagList={this.state.tagList}
                            onAllCheck={this._onAllCheck}
                            allCheckDisable={this.state.allCheckDisable}
                            initialTagId={alarmTagOption.tagId}
                          />;
       pagination=<Pagination onPrePage={this._onPrePage}
                                             onNextPage={this._onNextPage}
                                             jumpToPage={this.jumpToPage}
                                             curPageNum={page}
                                             totalPageNum={parseInt((this.state.total+19)/20)}/>;
      }

      return(
        <div className="jazz-dataselectmainpanel">

          <div  className="header">
            <HierarchyButton hierId={alarmTagOption.hierId} onTreeClick={this._onHierachyTreeClick} onButtonClick={this._onHierarchButtonClick} show={this.state.HierarchyShow}/>

            <div style={{color:'#ffffff'}}>-</div>

            <DimButton ref={'dimButton'} active={this.state.dimActive} onTreeClick={this._onDimTreeClick} parentNode={this.state.dimParentNode} onButtonClick={this._onDimButtonClick} show={this.state.DimShow}/>
          </div>
          <div  className="filter">
            <label className="search">
              <img className="img" src={require('../less/images/search-input-search.png')}/>
              <input className="input" id="searchField" onChange={this._onSearch}/>
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
