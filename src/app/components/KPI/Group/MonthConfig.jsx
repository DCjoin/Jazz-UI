'use strict';
import React, {Component} from 'react';
import Immutable from 'immutable';
import CircularProgress from 'material-ui/CircularProgress';
import TagSelect from './TagSelect.jsx';
import MonthKPIAction from 'actions/KPI/MonthKPIAction.jsx';
import MonthKPIStore from 'stores/KPI/MonthKPIStore.jsx'
import TitleComponent from 'controls/TitleComponent.jsx';
import YearAndTypeConfig from './YearAndTypeConfig.jsx';
import ParameterConfig from './ParameterConfig.jsx';
import {Type,DataStatus} from 'constants/actionType/KPI.jsx';
import FormBottomBar from 'controls/FormBottomBar.jsx';
import { formStatus } from 'constants/FormStatus.jsx';
import Dialog from 'controls/NewDialog.jsx';
import {DataConverter} from 'util/Util.jsx';
import ActualTag from './ActualTag.jsx';

var customerId=null;

export default class MonthConfig extends Component {

	static contextTypes = {
		router: React.PropTypes.object,
	};

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);

  }

  state = {
    buildingInfo:null
  };

	_onChange(){
    this.setState({
      buildingInfo:MonthKPIStore.getMonthKpi()
    })
	}

	componentWillMount(){
		customerId=this.context.router.params.customerId;
    let paths=this.props.path.split(".");
    MonthKPIAction.setDefalutMonthInfo(this.props.kpiInfo.getIn(paths));
	}

	componentDidMount(){
		MonthKPIStore.addChangeListener(this._onChange);
	}

	componentWillUnmount(){
		MonthKPIStore.removeChangeListener(this._onChange);
	}

  render(){
    let {isCreate}=this.props;
    let {CommodityId,UomId}=this.props.kpiInfo.toJS();
	  let {HierarchyName,HierarchyId,ActualTagId,ActualTagName}=this.state.buildingInfo.toJS();
    let titleProps={
			title:`${HierarchyName}-${I18N.Setting.KPI.Group.MonthConfig.Title}`,
			contentStyle:{
				marginLeft:'0'
			},
			titleStyle:{
				fontSize:'16px'
			},
			className:'jazz-kpi-config-wrap'
		},
    tagProps={
      kpiInfo:React.PropTypes.object,
      buildingInfo:React.PropTypes.object,
      isCreate:isCreate,
    };
				// tagProps={
				// 	key:'tagselect',
      	// 	hierarchyId:HierarchyId,
      	// 	hierarchyName:HierarchyName,
        //   tag:Immutable.fromJS({
        //     Id:ActualTagId,
        //     Name:ActualTagName,
        //     UomId,CommodityId
        //   }),
      	// 	onSave:this._onTagSave,
      	// 	onCancel:this._onDialogDismiss
        // };

    return(
      <TitleComponent {...titleProps}>
        <ActualTag {...tagProps}/>

				  <FormBottomBar isShow={true} allowDelete={false} allowEdit={false} enableSave={true}
				ref="actionBar" status={formStatus.EDIT} onSave={this._onSave} onCancel={this.props.onCancel}
				cancelBtnProps={{label:I18N.Common.Button.Cancel2}}/>
      </TitleComponent>
    )
  }
}
MonthConfig.propTypes = {
	kpiInfo:React.PropTypes.object,
  path:React.PropTypes.string,
	isCreate:React.PropTypes.bool,
	onSave:React.PropTypes.func,
	onCancel:React.PropTypes.func,
};
