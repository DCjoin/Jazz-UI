import React, { Component} from 'react';
import FontIcon from 'material-ui/FontIcon';
import { RankType} from 'constants/actionType/KPI.jsx';
import CircularProgress from 'material-ui/CircularProgress';
import RankingKPIStore from 'stores/KPI/RankingKPIStore.jsx';
import RankingKPIAction from 'actions/KPI/RankingKPIAction.jsx';
import Dialog from 'controls/NewDialog.jsx';
import GroupKPIStore from "stores/KPI/GroupKPIStore.jsx";
import CommonFuns from 'util/Util.jsx';

export default class RankHistory extends Component {

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
  }

  state={
        record:null,
      };

  _onChange(){
    this.setState({
      record:RankingKPIStore.getRankRecord()
    })
  }

  _getRatio(dIndex){
    let ratio='--',
        style={
          fontSize:'12px'
        };
    if(dIndex===null){
      ratio=''
    }
    else if(dIndex>0){
      ratio=<FontIcon className="icon-arrow-up" style={style}>{dIndex}</FontIcon>
    }
    else if(dIndex<0){
      ratio=<FontIcon className="icon-arrow-down" style={style}>{dIndex}</FontIcon>
    }
    return ratio
  }

  _renderTable(){
    var header,content;
    header=(
      <div className="jazz-kpi-rank-history-header">
            <div>{I18N.Setting.Calendar.Time}</div>
            <div>{I18N.Common.Glossary.Rank}</div>
            <div>{I18N.Setting.KPI.Group.Ranking.History.Ratio}</div>
            {this.props.rankType===RankType.TopRank && <div>{I18N.Setting.KPI.Group.Ranking.History.Value}</div>}
      </div>
    );
    content=(
      <div className="jazz-kpi-rank-history-body">
          {this.state.record.map(record=>{
            var {Date,Index,DIndex,Count,Value,CommodityId}=record.toJS()
            var date=RankingKPIStore.getDate(Date),
                rank=`${Index}/${Count}`,
                ratio=this._getRatio(DIndex),
                uom=CommonFuns.getUomById(GroupKPIStore.getUomByCommodityId(CommodityId)).Code,
                value=`${Value} ${uom}`;
            return(
              <div>
                <span>{date}</span>
                <span>{rank}</span>
                <span>{ratio}</span>
                {this.props.rankType===RankType.TopRank && <span>{value}</span>}
              </div>
            )
          })}
      </div>
    )
    return(
      <div className="jazz-kpi-rank-history">
        {header}
        {content}
      </div>
    )
  }

  componentDidMount(){
    let {rankType,groupKpiId,buildingId}=this.props,
        customerId=parseInt(this.context.router.params.customerId);
    RankingKPIStore.addChangeListener(this._onChange);
    RankingKPIAction.getRankRecord(customerId,groupKpiId,rankType,buildingId);
  }

  componentWillUnmount(){
    RankingKPIStore.removeChangeListener(this._onChange);
  }

  render(){
    var content;
    if(this.state.record===null){
      content=<div className="noContent flex-center"><CircularProgress  mode="indeterminate" size={80} /></div>
    }
    else {
      content=this._renderTable()
    }
    return(
      <Dialog
        ref = "_dialog"
        title={I18N.format(I18N.Setting.KPI.Group.Ranking.History.Name,this.props.name)}
        modal={false}
        open={true}
        onRequestClose={this.props.onClose}
        >
        {content}
      </Dialog>
    )
  }
}

RankHistory.propTypes={
  name:React.PropTypes.string,
  rankType:React.PropTypes.number,
  groupKpiId:React.PropTypes.number,
  buildingId:React.PropTypes.number,
  onClose:React.PropTypes.func
}

// RankHistory.defaultProps = {
// 	name:'用电量同比',
// 	rankType:RankType.TopRank,
// 	groupKpiId:1,
//   buildingId:1
// };