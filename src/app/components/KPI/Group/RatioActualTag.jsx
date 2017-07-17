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
    let {IndicatorName}=this.props.kpiInfo.toJS();
    let {ActualTagName,ActualRatioTagName}=this.props.buildingInfo.toJS();
    let addIcon=<FontIcon className="icon-add" color="#32ad3c"/>;
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
        <NewFlatButton {...props.tagBtn}/>
          <hr/>
        <NewFlatButton {...props.ratioTagBtn}/>
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

  shouldComponentUpdate(nextProps, nextState) {
      return (nextState!==this.state || nextProps.buildingInfo !== this.props.buildingInfo || nextProps.isCreate !== this.props.isCreate);
  }

  render(){
    let {isCreate}=this.props;
    let {HierarchyName,HierarchyId,ActualTagId,ActualTagName,ActualRatioTagId,ActualRatioTagName}=this.props.buildingInfo.toJS();
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
        Id:this.state.tagIndex===1?ActualTagId:ActualRatioTagId,
        Name:this.state.tagIndex===1?ActualTagName:ActualRatioTagName
      }),
      onSave:(tag)=>this._onTagSave(tag,this.state.tagIndex),
      onCancel:()=>{
        this._tagSelect(false)
      }
    };
    return(
      <TitleComponent {...props}>
        {isCreate?this._renderCreateTag():this._renderViewTag()}
        {this.state.tagShow && <TagSelect {...tagSelectProps}/>}
      </TitleComponent>
    )
  }
}

RatioActualTag.propTypes={
  	kpiInfo:React.PropTypes.object,
    buildingInfo:React.PropTypes.object,
    isCreate:PropTypes.bool,
}
