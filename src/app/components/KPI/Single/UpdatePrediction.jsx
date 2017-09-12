'use strict';
import React, {Component} from 'react';
import Immutable from 'immutable';
import Dialog from 'controls/NewDialog.jsx';
import FlatButton from 'controls/NewFlatButton.jsx';
import CommonFuns from 'util/Util.jsx';
import SingleKPIStore from 'stores/KPI/SingleKPIStore.jsx';
import SingleKPIAction from 'actions/KPI/SingleKPIAction.jsx';
import Prediction from './PredictionView.jsx';

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
		this._onSave = this._onSave.bind(this);
		this._onSuccess = this._onSuccess.bind(this);
	}

  state={
    kpiInfo:null
  }

	_onChange(){
		this.setState({
			kpiInfo:SingleKPIStore.getKpiInfo()
		})
	}

  _onSave(){
    let kpi=SingleKPIStore.transit(this.state.kpiInfo);
    SingleKPIAction.updatePrediction(kpi.AdvanceSettings.PredictionSetting);
  }

  _onSuccess(){
    this.props.onSave();
  }

  getPredictionProps(){
      let {UomId,AdvanceSettings,NumeratorCommodityId ,ActualTagId}=this.state.kpiInfo.toJS();
      let {PredictionSetting}=AdvanceSettings,
          {hierarchyId,hierarchyName}=this.props,
          uom=CommonFuns.getUomById(UomId).Code,
          tag=Immutable.fromJS({Id:ActualTagId,UomId,CommodityId:NumeratorCommodityId });
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
    SingleKPIAction.getKPIPeriodByYear(this.context.router.params.customerId,year);
    SingleKPIAction.getKPI(kpiId,year);
	}

	componentDidMount(){
		SingleKPIStore.addChangeListener(this._onChange);
    SingleKPIStore.addSuccessListener(this._onSuccess);
	}

	componentWillUnmount() {
		SingleKPIStore.removeChangeListener(this._onChange);
    SingleKPIStore.removeSuccessListener(this._onSuccess);
	}

	render(){
		if(!this.state.kpiInfo || this.state.kpiInfo.size===0 || !this.state.kpiInfo.get('UomId')){
			return(
				<div/>
			)
		}
		let
		actions=[
        <FlatButton label={I18N.Common.Button.Cancel2} secondary={true} style={{float:'right',height:36,lineHeight:'34px'}} onTouchTap={this.props.onCancel}/>,
        <FlatButton label={I18N.Common.Button.Save} primary={true} disabled={!SingleKPIStore.validateKpiInfo(this.state.kpiInfo)} 
				style={{float:'right',marginRight:'20px',height:36,lineHeight:'34px'}} onTouchTap={this._onSave}/>
      ];
		let  dialogProps = {
		        ref: 'prediction_dialog',
						titleStyle:{margin:'0 22px',height:'19px',lineHeight:'19px',padding:"15px 0 15px 8px",fontSize:'16px', fontWeight: 600,borderBottom:'1px solid #e6e6e6'},
          	contentStyle:{display:'block',paddingLeft:"8px",margin:"0 22px"},
          	actionsContainerStyle:{margin:'35px 22px 20px 22px'},
		        title: I18N.Setting.KPI.Parameter.UpdatePrediction,
		        actions: actions,
		        modal: true,
		        open: true,
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
