'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {IconButton,DropDownMenu,DatePicker,FlatButton,FontIcon,Menu,Checkbox} from 'material-ui';
import classnames from 'classnames';
import HierarchyButton from './HierarchyButton.jsx';
import DimButton from './DimButton.jsx';
import TagStore from '../stores/TagStore.jsx';
import TagAction from '../actions/TagAction.jsx';
import AlarmTagStore from '../stores/AlarmTagStore.jsx';
import EnergyStore from '../stores/EnergyStore.jsx'

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

var CheckboxItem=React.createClass({
  mixins:[Navigation,State],
  propTypes: {
      title: React.PropTypes.string.isRequired,
      label:React.PropTypes.number,
      defaultChecked:React.PropTypes.bool,
      payload:React.PropTypes.number,
      selectFull:React.PropTypes.func,
      disabled:React.PropTypes.bool,
      nodeData:React.PropTypes.object

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
    })
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
        alarm=<div style={{color:'rgb(187, 184, 184)'}}>基准值未配置,</div>;
        baseline=<div style={{color:'rgb(187, 184, 184)'}}>报警未配置</div>;
        break;
      case 1:
        alarm=<div>基准值已配置,</div>;
        baseline=<div style={{color:'rgb(187, 184, 184)'}}>报警未配置</div>;
        break;
      case 2:
        alarm=<div>基准值已配置,</div>;
        baseline=<div>报警已配置</div>;
        break;
    };

    return(
      <div onClick={this._onClick} >
      <Checkbox
            label={this.props.title}
            checked={this.state.boxChecked}
            disabled={this.props.disabled}
            />
          <div style={{'margin-left':'40px',display:'inline-flex','font-size':'15px'}}>
            {alarm}
            {baseline}
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
      onLeftPage:React.PropTypes.func,
      onRightPage:React.PropTypes.func,
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
                          />;
      nodemenuItems.push(menuItem);

    });

     var pageButtonStyle = {
             width:'20px'
                };

  return(
  <div>
    <Checkbox
      label="全选"
      onCheck={this.props.onAllCheck}
      checked={this.props.checked}
      disabled={this.state.allCheckDisable}
      />
    <div style={{'overflow':'auto',height:'450px'}}>
      {nodemenuItems}
    </div>


    <div style={{display:'inline-block',width:'100%','text-align':'center'}}>
      <FlatButton style={pageButtonStyle} onClick={this.props.onLeftPage}>
        <FontIcon className="fa fa-caret-left fa-lg" style={{margin:'30px'}}/>
      </FlatButton>
      {page}/{parseInt((this.props.total+19)/20)}

      <FlatButton style={pageButtonStyle} onClick={this.props.onRightPage}>
        <FontIcon className="fa fa-caret-right fa-lg" style={{margin:'30px'}} />
      </FlatButton>
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
        allCheckDisable:false
      };
    },

    _onHierachyTreeClick:function(node){
      TagAction.loadData(node.Id,2,1,alarmType,filters);
       tagStatus.length=0;
       page=1;
       tagStatus[1]=new Array();
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
      tagStatus.length=0;
      page=1;
      tagStatus[1]=new Array();
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
        optionType:2
      })
    },

    componentDidMount: function() {
      TagStore.addTagNodeListener(this._onTagNodeChange);
      if(this.props.linkFrom=="Alarm"){
        var alarmTagOption = EnergyStore.getTagOpions()[0];

        TagStore.addAlarmTagNodeListener(this._onAlarmTagNodeChange);

        TagAction.loadAlarmData(alarmTagOption);
      }


     },
    componentWillUnmount: function() {

       TagStore.removeTagNodeListener(this._onTagNodeChange);
       if(this.props.linkFrom=="Alarm"){
         TagStore.removeAlarmTagNodeListener(this._onAlarmTagNodeChange);
       }

      },
      _onLeftPage:function(){
       if(page>1){
         page=page-1;
         if(tagStatus[page]==null){
           tagStatus[page]=new Array();
         }
         TagAction.loadData(this.state.tagId,this.state.optionType,page,alarmType,filters);



       }
      },
      _onRightPage:function(){

        if(20*page<this.state.total){
                    page=page+1;

                    if(tagStatus[page]==null){
                      tagStatus[page]=new Array();
                    }

                    TagAction.loadData(this.state.tagId,this.state.optionType,page,alarmType,filters);

                          }
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

    render:function(){
      var alarmTagOption;
      if(this.props.linkFrom=="Alarm"){
        alarmTagOption=EnergyStore.getTagOpions()[0];
      }else{
        alarmTagOption={
          hierId:null,
          tagId:null
        }
      }
      var buttonStyle = {
               height:'48px',
           };

    var dropdownmenuStyle = {
                  width:'120px',
                  float:'right',
                  marginLeft: '5px'
                          };

        var menupaper;
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
                            onLeftPage={this._onLeftPage}
                            onRightPage={this._onRightPage}
                            initialTagId={alarmTagOption.tagId}
                          />;
      }

      return(
        <div className="jazz-dataselectmainpanel">

          <div  style={{display:'flex','flex-flow':'row nowrap','align-items':'center'}}>
            <HierarchyButton hierId={alarmTagOption.hierId} onTreeClick={this._onHierachyTreeClick} onButtonClick={this._onHierarchButtonClick} show={this.state.HierarchyShow}/>

            <FontIcon className="fa fa-minus" style={{margin:'30px'}}/>

            <DimButton active={this.state.dimActive} onTreeClick={this._onDimTreeClick} parentNode={this.state.dimParentNode} onButtonClick={this._onDimButtonClick} show={this.state.DimShow}/>
          </div>
          <div  style={{display:'inline-block','padding':'5px 0','border-width':'2px','border-style':'solid','border-color':'green transparent',width:'100%'}}>
            <label style={{display:'inline-block',width:'156px',height:'25px',border:'3px solid gray','border-radius':'20px','margin-top':'10px'}}>
              <img style={{float:'left'}} src={require('../less/images/search-input-search.png')}/>
              <input style={{width:'130px',height:'20px','background-color':'transparent',border:'transparent'}} id="searchField" onChange={this._onSearch}/>
            </label>

            <DropDownMenu autoWidth={false} style={dropdownmenuStyle} menuItems={menuItems} onChange={this._onAlarmFilter} />

          </div>
            {menupaper}
        </div>


      )
    }
  });


  module.exports = DataSelectMainPanel;
