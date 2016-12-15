'use strict';
import React, {Component,PropTypes} from 'react';
import Immutable from 'immutable';
import TitleComponent from 'controls/TitleComponent.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import TagSelect from '../Single/TagSelect.jsx';
import MonthKPIAction from 'actions/KPI/MonthKPIAction.jsx';

export default class ActualTag extends Component {

  constructor(props) {
    super(props);
    this._onTagSave = this._onTagSave.bind(this);
  }

  state={
    tagShow:false
  };

  _tagSelect(show){
    this.setState({
      tagShow:show
    })
  }

  _onTagSave(tag){
    this.setState({
      tagShow:false
    },()=>{
      MonthKPIAction.merge([{
        path:'ActualTagName',
        value:tag.get('Name')
      },{
        path:'ActualTagId',
        value:tag.get('Id')
      }])
    })

  }

  _renderConfig(){
    let {isCreate}=this.props;
    let {CommodityId,UomId}=this.props.kpiInfo.toJS();
    let {HierarchyName,HierarchyId,ActualTagId,ActualTagName}=this.props.buildingInfo.toJS();

    let tagSelectProps={
    	key:'tagselect',
      title:I18N.Setting.KPI.Group.GroupConfig.SelectTag,
    	hierarchyId:HierarchyId,
    	hierarchyName:HierarchyName,
      tag:Immutable.fromJS({
        Id:ActualTagId,
        Name:ActualTagName,
        UomId,CommodityId
      }),
    	onSave:this._onTagSave,
    	onCancel:()=>{
        this._tagSelect(false)
      }
    };

    return(
            <div className="jazz-kpi-tag-wrap">
              {ActualTagName && <div style={{marginRight:'10px'}}>{ActualTagName}</div>}
              {isCreate && <FlatButton
                              style={{border:'1px solid #e4e7e9'}}
                              label={ActualTagName?I18N.Setting.KPI.Tag.SelectAgain:I18N.Setting.KPI.Tag.Select}
                              onTouchTap={()=>{this._tagSelect(true)}}
                              />}
              {this.state.tagShow && <TagSelect {...tagSelectProps}/>}
            </div>
    )

  }

  shouldComponentUpdate(nextProps, nextState) {
      return (nextState!==this.state || nextProps.buildingInfo !== this.props.buildingInfo || nextProps.isCreate !== this.props.isCreate);
  }

  render(){
    let props={
      title:I18N.Setting.KPI.Group.MonthConfig.TagSelect,
      contentStyle:{
        marginLeft:'0'
      },
    };
    return(
      <TitleComponent {...props}>
        {this._renderConfig()}
      </TitleComponent>
    )
  }
}

ActualTag.propTypes={
  	kpiInfo:React.PropTypes.object,
    buildingInfo:React.PropTypes.object,
    isCreate:PropTypes.bool,
}
