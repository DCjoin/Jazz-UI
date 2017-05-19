import React, { Component} from 'react';
import FontIcon from 'material-ui/FontIcon';
import { RankType,UnitType} from 'constants/actionType/KPI.jsx';
import CircularProgress from 'material-ui/CircularProgress';
import RankingKPIStore from 'stores/KPI/RankingKPIStore.jsx';
import RankingKPIAction from 'actions/KPI/RankingKPIAction.jsx';
import Dialog from 'controls/NewDialog.jsx';
import CommonFuns from 'util/Util.jsx';

export default class RankHistory extends Component {

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
    this._renderTable = this._renderTable.bind(this);

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
    let style={
          fontSize:'12px'
        };
    let ratio=<FontIcon className="icon-rank-right" style={style}/>;
    if(dIndex===null){
      ratio='-'
    }
    else if(dIndex>0){
      ratio=<FontIcon className="icon-rank-up" color="#dc0a0a" style={style}><span style={{color:'#626469'}}>{dIndex}</span></FontIcon>
    }
    else if(dIndex<0){
      ratio=<FontIcon className="icon-rank-down" color="#32ad3d" style={style}><span style={{color:'#626469'}}>{-dIndex}</span></FontIcon>
    }
    return ratio
  }

  _getValue(type,value){
    if(type===UnitType.MonthRatio){
      return value
    }
    else {
      return CommonFuns.getLabelData(value)
    }
  }

  _renderTable(){
    var header,content;
    var type=this.state.record.getIn([0,'UnitType']),
      uom=this.props.uomLabel;
    header=(
      <div className="jazz-kpi-rank-history-header">
            <div>{I18N.Setting.Calendar.Time}</div>
            <div>{I18N.Common.Glossary.Rank}</div>
            <div>{I18N.Setting.KPI.Group.Ranking.History.Ratio}</div>
            {this.props.rankType===RankType.TopRank && <div>{`${RankingKPIStore.getUnitType(type)} (${uom})`}</div>}
      </div>
    );
    content=(
      <div className="jazz-kpi-rank-history-body">
          {this.state.record.map(record=>{
            var {Date,Index,DIndex,Count,RankValue}=record.toJS();
            // RankValue=100.1;
            var date=RankingKPIStore.getDate(Date),
                rank=Index?`${Index}/${Count}`:'-',
                ratio=this._getRatio(DIndex),
                value=RankValue!==null?this._getValue(type,RankValue):I18N.Setting.KPI.Group.Ranking.History.NoValue;
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
    let {rankType,groupKpiId,buildingId,year}=this.props,
        customerId=parseInt(this.context.router.params.customerId);
    RankingKPIStore.addChangeListener(this._onChange);
    RankingKPIAction.getRankRecord(customerId,groupKpiId,rankType,buildingId,year);
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
        titleStyle={{color:'#0f0f0f',fontSize:'16px',borderBottom:'solid 1px #e6e6e6',padding:'15px 12px',fontWeight:'bold',marginBottom:'15px'}}
        modal={false}
        open={true}
        onRequestClose={this.props.onClose}
        >
        {this.props.renderTitle && this.props.renderTitle()}
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
  onClose:React.PropTypes.func,
  uomLabel:React.PropTypes.string,
  year:React.PropTypes.number,
  renderTitle:React.PropTypes.func,
}

// RankHistory.defaultProps = {
// 	name:'用电量同比',
// 	rankType:RankType.TopRank,
// 	groupKpiId:1,
//   buildingId:1
// };
