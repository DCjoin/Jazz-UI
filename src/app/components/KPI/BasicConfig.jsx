'use strict';
import React, {Component,PropTypes} from 'react';
import TitleComponent from '../../controls/TtileComponent.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import FlatButton from '../../controls/FlatButton.jsx';

export default class BasicConfig extends Component {

  _renderConfig(){
    let {name,tagName,isCreate}=this.props;
    let nameProps={
      ref: 'kpiName',
      isViewStatus: false,
      didChanged: this.props.onNameChange,
      defaultValue: name || '',
      title: I18N.Setting.KPI.Basic.Name,
      isRequired: true
      },
      tagProps={
        title:I18N.Setting.KPI.Tag.Title,
        contentStyle:{
          marginLeft:'0'
        }
      };

    return(
      <div>
        <ViewableTextField {...nameProps}/>
          <TitleComponent {...tagProps}>
            <div className="jazz-kpi-tag-wrap">
              {tagName && <div style={{marginRight:'10px'}}>{tagName}</div>}
              {isCreate && <FlatButton
                              style={{border:'1px solid #e4e7e9'}}
                              label={tagName?I18N.Setting.KPI.Tag.SelectAgain:I18N.Setting.KPI.Tag.Select}
                              onTouchTap={this.props.onSelectTagShow}
                              />}
            </div>
          </TitleComponent>
      </div>
    )

  }

  shouldComponentUpdate(nextProps, nextState) {
      return (nextProps.name !== this.props.name || nextProps.tagName !== this.props.tagName || nextProps.isCreate !== this.props.isCreate);
    }

  render(){
    let props={
      title:I18N.Setting.KPI.Basic.Title
    };
    return(
      <TitleComponent {...props}>
        {this._renderConfig()}
      </TitleComponent>
    )
  }
}

BasicConfig.propTypes={
  	onNameChange: PropTypes.func,
    isCreate:PropTypes.bool,
    name:PropTypes.string,
    onSelectTagShow:PropTypes.func,
    tagName:PropTypes.string,
}
