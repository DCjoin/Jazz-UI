'use strict';
import React, {Component,PropTypes} from 'react';
import Immutable from 'immutable';
import TitleComponent from 'controls/TitleComponent.jsx';
import TagSelect from '../Single/TagSelect.jsx';
import MonthKPIAction from 'actions/KPI/MonthKPIAction.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';
import FontIcon from 'material-ui/FontIcon';

export default class RatioActualTag extends Component {

  constructor(props) {
    super(props);
    this._onTagSave = this._onTagSave.bind(this);
  }

  state={
    tagShow:false,
    tagIndex:1 //1:target1 2:target2  target1/target2
  };

  _tagSelect(show,index){
    this.setState({
      tagShow:show,
      tagIndex:index
    })
  }

  _onTagSave(tag,index){
    this.setState({
      tagShow:false,
      tagIndex:1
    },()=>{
      if(index===1){
        MonthKPIAction.merge([{
          path:'ActualTagName',
          value:tag.get('Name')
        },{
          path:'ActualTagId',
          value:tag.get('Id')
        },{
          path:'UomId',
          value:tag.get('UomId')
        },{
          path:'NumeratorCommodityId',
          value:tag.get('CommodityId')
        }])
      }else {
        MonthKPIAction.merge([{
          path:'ActualRatioTagName',
          value:tag.get('Name')
        },{
          path:'ActualRatioTagId',
          value:tag.get('Id')
        },{
          path:'RatioUomId',
          value:tag.get('UomId')
        },{
          path:'RatioCommodityId',
          value:tag.get('CommodityId')
        }])
      }

    })

  }

  _renderCreateTag(){
    let {isCreate}=this.props;
    let {IndicatorName}=this.props.kpiInfo.toJS();
    let {ActualTagName,ActualRatioTagName}=this.props.buildingInfo.toJS();
    let addIcon=<FontIcon className="icon-add" color="#32ad3c"/>;
    var styles={
      button:{
        marginRight:'15px',
        height:'30px',
        lineHeight:'30px'
      },
      label:{
        fontSize:'14px',
        lineHeight:'14px',
        verticalAlign:'baseline'
      }
    };
    let props={
      tagBtn:{
        secondary:true,
        icon:!ActualTagName && addIcon,
        label:ActualTagName,
        onTouchTap:()=>{this._tagSelect(true,1)}
      },
      ratioTagBtn:{
        secondary:true,
        icon:!ActualRatioTagName && addIcon,
        label:ActualRatioTagName,
        onTouchTap:()=>{this._tagSelect(true,2)}
      }
    }
    return(
      <div className="jazz-kpi-tag-wrap" style={{color:'#9fa0a4'}}>
        <span>{IndicatorName}</span>
        <span>=</span>
        <span>
          <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
          {ActualTagName && <div style={{color:'#626469'}}>{ActualTagName}</div>}
          {isCreate && !ActualTagName && <NewFlatButton label={I18N.Setting.Tag.Tag} labelStyle={styles.label} secondary={true}
                                                icon={<FontIcon className="icon-add" style={styles.label}/>} style={styles.button}
                                                onClick={()=>{this._tagSelect(true,1)}}/>}
          {isCreate && ActualTagName && <div className="reelect" onTouchTap={()=>{this._tagSelect(true,1)}}>{I18N.SaveEffect.SelectTagAgain}</div>}

          </div>

          <hr/>

          <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
          {ActualRatioTagName && <div style={{color:'#626469'}}>{ActualRatioTagName}</div>}
          {isCreate && !ActualRatioTagName && <NewFlatButton label={I18N.Setting.Tag.Tag} labelStyle={styles.label} secondary={true}
                                                icon={<FontIcon className="icon-add" style={styles.label}/>} style={styles.button}
                                                onClick={()=>{this._tagSelect(true,2)}}/>}
          {isCreate && ActualRatioTagName && <div className="reelect" onTouchTap={()=>{this._tagSelect(true,2)}}>{I18N.SaveEffect.SelectTagAgain}</div>}
          </div>
        </span>
      </div>
    )
  }

  _renderViewTag(){
    let {IndicatorName}=this.props.kpiInfo.toJS();
    let {ActualTagName,ActualRatioTagName}=this.props.buildingInfo.toJS();

    return(
      <div className="jazz-kpi-tag-wrap" style={{color:'#9fa0a4'}}>
        <span>{IndicatorName}</span>
        <span>=</span>
        <span>
          {ActualTagName}
          <hr/>
          {ActualRatioTagName}
        </span>
      </div>
    )
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //     return (nextState!==this.state || nextProps.buildingInfo !== this.props.buildingInfo || nextProps.isCreate !== this.props.isCreate);
  // }

  render(){
    var that=this;
    let {isCreate}=this.props;
    let {UomId,RatioUomId,RatioCommodityId,NumeratorCommodityId}=this.props.kpiInfo.toJS();
    let {HierarchyName,HierarchyId,ActualTagId,ActualTagName,ActualRatioTagId,ActualRatioTagName}=this.props.buildingInfo.toJS();

    if(!UomId){UomId=this.props.buildingInfo.get("UomId")}
    if(!RatioUomId){RatioUomId=this.props.buildingInfo.get("RatioUomId")}
    if(!RatioCommodityId){RatioCommodityId=this.props.buildingInfo.get("RatioCommodityId")}
    if(!NumeratorCommodityId){NumeratorCommodityId=this.props.buildingInfo.get("NumeratorCommodityId")}

    let props={
      title:I18N.Setting.KPI.Group.MonthConfig.TagSelect,
      contentStyle:{
        marginLeft:'0'
      },
    };
    let tagSelectProps={
      key:'tagselect',
      title:I18N.Setting.KPI.Group.GroupConfig.SelectTag,
      hierarchyId:HierarchyId,
      hierarchyName:HierarchyName,
      tag:Immutable.fromJS({
        Id:that.state.tagIndex===1?ActualTagId:ActualRatioTagId,
        Name:that.state.tagIndex===1?ActualTagName:ActualRatioTagName,
        UomId:that.state.tagIndex===1?UomId:RatioUomId,
        CommodityId:that.state.tagIndex===1?NumeratorCommodityId:RatioCommodityId,
      }),

      onSave:(tag)=>this._onTagSave(tag,this.state.tagIndex),
      onCancel:()=>{
        this._tagSelect(false)
      }
    };
    return(
      <div style={{marginTop:'25px'}}>
        {isCreate?this._renderCreateTag():this._renderViewTag()}
        {this.state.tagShow && <TagSelect {...tagSelectProps}/>}
      </div>
    )
  }
}

RatioActualTag.propTypes={
  	kpiInfo:React.PropTypes.object,
    buildingInfo:React.PropTypes.object,
    isCreate:PropTypes.bool,
}
