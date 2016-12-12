'use strict';
import React, {Component,PropTypes} from 'react';
import Immutable from 'immutable';
import TitleComponent from 'controls/TitleComponent.jsx';
import ViewableTextField from 'controls/ViewableTextField.jsx';
import FlatButton from 'controls/FlatButton.jsx';
import TagSelect from '../Single/TagSelect.jsx';

export default class ActualTag extends Component {

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
  }

  state={
    tagShow:false
  };

  _tagSelect(){

  }
  
  _renderConfig(){
    let {isCreate}=this.props;
    let {CommodityId,UomId}=this.props.kpiInfo.toJS();
    let {HierarchyName,HierarchyId,ActualTagId,ActualTagName}=this.props.buildingInfo.toJS();

    let tagSelectProps={
    	key:'tagselect',
    	hierarchyId:HierarchyId,
    	hierarchyName:HierarchyName,
      tag:Immutable.fromJS({
        Id:ActualTagId,
        Name:ActualTagName,
        UomId,CommodityId
      }),
    	onSave:this._onTagSave,
    	onCancel:this._onDialogDismiss
    };

    let tagProps={
        title:I18N.Setting.KPI.Group.MonthConfig.TagSelect,
        contentStyle:{
          marginLeft:'0'
        }
      };

    return(
          <TitleComponent {...tagProps}>
            <div className="jazz-kpi-tag-wrap">
              {ActualTagName && <div style={{marginRight:'10px'}}>{tagName}</div>}
              {isCreate && <FlatButton
                              style={{border:'1px solid #e4e7e9'}}
                              label={ActualTagName?I18N.Setting.KPI.Tag.SelectAgain:I18N.Setting.KPI.Tag.Select}
                              onTouchTap={this.props.onSelectTagShow}
                              />}
            </div>
          </TitleComponent>
    )

  }

  shouldComponentUpdate(nextProps, nextState) {
      return (nextProps.name !== this.props.name || nextProps.tagName !== this.props.tagName || nextProps.isCreate !== this.props.isCreate);
    }

  render(){
    let props={
      title:I18N.Setting.KPI.Basic.Title,
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
