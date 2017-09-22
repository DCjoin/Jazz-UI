'use strict';
import React, { Component }  from "react";
import Dialog from 'controls/NewDialog.jsx';
import CircularProgress from 'material-ui/CircularProgress';
import AlarmTagStore from 'stores/AlarmTagStore.jsx';
import CommonFuns from 'util/Util.jsx';
import DataAnalysisStore from 'stores/DataAnalysis/DataAnalysisStore.jsx';
import MultipleTimespanStore from 'stores/Energy/MultipleTimespanStore.jsx';

var isMultiTime;

export default class IntervalDialog extends Component {

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);

  }

  state={
    gatherInfo:null,
  }

  getTitle(){
    // var isMultiTime=false;
    if(isMultiTime){
      var tagName=AlarmTagStore.getSearchTagList()[0].tagName;
      return I18N.EM.Tool.DataStatistics+' '+tagName
    }else {
      let j2d = CommonFuns.DataConverter.JsonToDateTime;
      var startDate=new Date(j2d(this.props.timeRanges[0].StartTime)),endDate=new Date(j2d(this.props.timeRanges[0].EndTime));
      return I18N.EM.Tool.DataStatistics+'   '+DataAnalysisStore.getDisplayDate(startDate,false)+' '+I18N.Setting.DataAnalysis.To+' '+DataAnalysisStore.getDisplayDate(endDate,true)
    }
  }

  componentWillMount(){
    isMultiTime=MultipleTimespanStore.getSubmitTimespans()!==null;
  }

  render(){
    var title=this.getTitle();
    var content;
    var style={
      title:{
        fontSize:'16px',
        fontWeight:'600',
        color:'#0f0f0f',
        height:'52px',
        borderBottom:'1px solid #e6e6e6',
        paddingTop:'0',
        lineHeight:'52px',
        marginBottom:'0',
        paddingLeft:'10px',
        marginLeft:'72px',
        marginRight:'72px',
        alignItems:'center'
      },
      content:{
        marginLeft:'72px',
        marginRight:'72px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        overflowY:'auto'
      },
      closeIcon:{
        fontSize:'15px',
        lingHeight:'15px',
        height:'15px',
        margin:'0',
        color:'#505559',
        position:'absolute',
        right:'20px'
      }
    };
        if(this.state.gatherInfo===null){
          content=(
            <div className="flex-center">
             <CircularProgress  mode="indeterminate" size={80} />
           </div>
          )
        }
        else {
          content=this._renderContent()
        }
    return(
      <Dialog title={title} titleStyle={style.title} style={{position:'relative'}} closeIconStyle={{fontSize:'15px',lingHeight:'15px',height:'15px',margin:'0',color:'#505559'}} open={true}  modal={false} onRequestClose={this.props.onCloseDialog} contentStyle={style.content}>

        {content}

      </Dialog>
    )
  }
}

IntervalDialog.propTypes = {
  onCloseDialog:React.PropTypes.func,
  timeRanges:React.PropTypes.object,
  analysisPanel:React.PropTypes.object
};