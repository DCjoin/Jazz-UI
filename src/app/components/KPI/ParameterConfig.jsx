'use strict';
import React, {Component,PropTypes} from 'react';
import TitleComponent from '../../controls/TtileComponent.jsx';
import ViewableTextField from '../../controls/ViewableTextField.jsx';
import FlatButton from '../../controls/FlatButton.jsx';

export default class ParameterConfig extends Component {

  render(){
    let {tagId}=this.props;
    if(tagId){
      // let props={
      //   title:I18N.Setting.KPI.Basic.Title
      // };
      // return(
      //   <TitleComponent {...props}>
      //     {this._renderConfig()}
      //   </TitleComponent>
      // )
    }
    else {
      return(
        <TitleComponent title={I18N.Setting.KPI.YearAndType.Title} titleStyle={{color:'#e4e7e9'}}/>
      )

    }

  }
}

ParameterConfig.propTypes={
  	tagId: PropTypes.number,
    year:PropTypes.number,
    IndicatorType:PropTypes.string,
    onYearChange:PropTypes.func,
    onIndicatorTypeChange:PropTypes.func,
};
ParameterConfig.defaultProps = {
};
