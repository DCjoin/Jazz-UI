'use strict';
import React, {Component,PropTypes} from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TitleComponent from '../../controls/TtileComponent.jsx';
import ViewableDropDownMenu from '../../controls/ViewableDropDownMenu.jsx';
import KPIStore from '../../stores/KPI/KPIStore.jsx';
import {Type} from '../../constants/actionType/KPI.jsx';


export default class YearAndTypeConfig extends Component {

  _renderConfig(){
    let {Year,IndicatorType}=this.props;
    IndicatorType=IndicatorType || Type.Quota;
    let yearProps={
      ref: 'year',
      isViewStatus: false,
      title: I18N.Setting.KPI.YearAndType.SelectYear,
      defaultValue: Year,
      dataItems: KPIStore._getYearList(),
      didChanged:this.props.onYearChange
    },typeProps={
      title:I18N.Setting.KPI.YearAndType.SelectType,
      contentStyle:{
        marginTop:'10px',
        marginLeft:'0'
      }
    };
    return(
      <div>
        <ViewableDropDownMenu {...yearProps}/>
          <TitleComponent {...typeProps}>
            <RadioButtonGroup name="type" valueSelected={IndicatorType}
                              onChange={this.props.onIndicatorTypeChange} style={{display:'flex'}}>
              <RadioButton
                value={Type.Quota}
                label={I18N.Setting.KPI.YearAndType.Quota}
                style={{width:'200px'}}
                />
              <RadioButton
                value={Type.SavingRate}
                label={I18N.Setting.KPI.YearAndType.SavingRate}
                style={{width:'200px',marginLeft:'50px'}}
                />
            </RadioButtonGroup>
          </TitleComponent>
      </div>
    )

  }

  render(){
    let {tagId}=this.props;
    if(tagId){
      let props={
        title:I18N.Setting.KPI.YearAndType.Title
      };
      return(
        <TitleComponent {...props}>
          {this._renderConfig()}
        </TitleComponent>
      )
    }
    else {
      return(
        <TitleComponent title={I18N.Setting.KPI.YearAndType.Title} titleStyle={{color:'#e4e7e9'}}/>
      )

    }

  }
}

YearAndTypeConfig.propTypes={
  	tagId: PropTypes.number,
    Year:PropTypes.number,
    IndicatorType:PropTypes.string,
    onYearChange:PropTypes.func,
    onIndicatorTypeChange:PropTypes.func,
};
// YearAndTypeConfig.defaultProps = {
// 	Year:2016,
// };
