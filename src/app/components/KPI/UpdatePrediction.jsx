'use strict';
import React, {Component} from 'react';
import Immutable from 'immutable';
import Dialog from '../../controls/NewDialog.jsx';
import FlatButton from '../../controls/FlatButton.jsx';
import CommonFuns from '../../util/Util.jsx';
import KPIStore from '../../stores/KPI/KPIStore.jsx';
import KPIAction from '../../actions/KPI/KPIAction.jsx';
import Prediction from './Prediction.jsx';

export default class UpdatePrediction extends Component {

	static propTypes = {
		kpiId:React.PropTypes.number,
		year:React.PropTypes.number,
		onSave:React.PropTypes.func,
		onCancel:React.PropTypes.func,
    hierarchyId:React.PropTypes.number,
    hierarchyName:React.PropTypes.string,
	};

	static contextTypes = {
		router: React.PropTypes.object,
	};

  constructor(props) {
		super(props);
		this._onChange = this._onChange.bind(this);
	}

  state={
    kpiInfo:null
  }

	_onChange(){
		this.setState({
			kpiInfo:KPIStore.getKpiInfo()
		})
	}

  _onSave(){
    let kpi=KPIStore.transit(this.state.kpiInfo);
    KPIAction.updatePrediction(kpi.AdvanceSettings.PredictionSetting);
  }

  _onSuccess(){
    this.props.onSave();
  }

  getPredictionProps(){
      let {UomId,AdvanceSettings,CommodityId}=this.state.kpiInfo.toJS();
      let {PredictionSetting}=AdvanceSettings,
          {hierarchyId,hierarchyName}=this.props,
          uom=CommonFuns.getUomById(UomId).Code,
          tag=Immutable.fromJS({UomId,CommodityId});
      return{
        PredictionSetting,
        onPredictioChange:this._onPredictioChange,
        Year:this.props.year,
        onSelectTagShow:this._onSelectTagShow,
        uom,hierarchyId,hierarchyName,tag,
      }
    }

	componentWillMount(){
    let {kpiId,year}=this.props;
    KPIAction.getKPIPeriodByYear(this.context.router.params.customerId,year);
    KPIAction.getKPI(kpiId,year);
	}

	componentDidMount(){
		KPIStore.addChangeListener(this._onChange);
    KPIStore.addSuccessListener(this._onSuccess);
	}

	componentWillUnmount() {
		KPIStore.removeChangeListener(this._onChange);
    KPIStore.removeSuccessListener(this._onSuccess);
	}

	render(){
		let actions = [
			<FlatButton
			label={I18N.Common.Button.Save}
			onTouchTap={this._onSave}
			/>,
			<FlatButton
			label={I18N.Common.Button.Cancel2}
			onTouchTap={this.props.onCancel}
			/>
		];
		let  dialogProps = {
		        ref: 'prediction_dialog',
		        title: I18N.Setting.KPI.Parameter.UpdatePrediction,
		        actions: actions,
		        modal: true,
		        open: true,
						wrapperStyle:{
							width:'auto'
						}
		      };
		return(
			<Dialog {...dialogProps}>
        {this.state.kpiInfo && this.state.kpiInfo.size>0 && <Prediction {...this.getPredictionProps()}/>}
			</Dialog>
		)
	}
}

// UpdatePrediction.defaultProps = {
// 	hierarchyId: 100016,
// 	hierarchyName:'楼宇BADGOOD',
// 	year:2016,
// 	isCreate:true
// };
