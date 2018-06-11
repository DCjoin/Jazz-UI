'use strict';
import React, {Component} from 'react';
import Immutable from 'immutable';
import TagSelect from '../Single/TagSelect.jsx';
import MonthKPIAction from 'actions/KPI/MonthKPIAction.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';
import FontIcon from 'material-ui/FontIcon';
import SingleKPIAction from 'actions/KPI/SingleKPIAction.jsx';
import MonthKPIStore from 'stores/KPI/MonthKPIStore.jsx';
import PropTypes from 'prop-types';
var customerId;
export default class RatioActualTag extends Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this._onTagSave = this._onTagSave.bind(this);
    this._onChange = this._onChange.bind(this);
    
  }

  state={
    tagShow:false,
    tagIndex:1, //1:target1 2:target2  target1/target2
    tagHasHistory:true,
    ratioTagHasHistory:true
  };

 _onChange(index){
    this.setState({
      tagHasHistory:index===1?MonthKPIStore.getHasHistory():this.state.tagHasHistory,
      ratioTagHasHistory:index===2?MonthKPIStore.getHasHistory():this.state.ratioTagHasHistory
    })
  }

  _tagSelect(show,index){
    this.setState({
      tagShow:show,
      tagIndex:index
    })
  }

  _onTagSave(tag,index){
    this.setState({
      tagShow:false,
      tagIndex:1
    },()=>{
      if(index===1){
        MonthKPIAction.merge([{
          path:'ActualTagName',
          value:tag.get('Name')
        },{
          path:'ActualTagId',
          value:tag.get('Id')
        },{
          path:'UomId',
          value:tag.get('UomId')
        },{
          path:'NumeratorCommodityId',
          value:tag.get('CommodityId')
        }]);

      }else {
        MonthKPIAction.merge([{
          path:'ActualRatioTagName',
          value:tag.get('Name')
        },{
          path:'ActualRatioTagId',
          value:tag.get('Id')
        },{
          path:'RatioUomId',
          value:tag.get('UomId')
        },{
          path:'RatioCommodityId',
          value:tag.get('CommodityId')
        }])
      }

    })

  }

  _renderCreateTag(){
    let {isCreate}=this.props;
    let {IndicatorName}=this.props.kpiInfo.toJS();
    let {ActualTagName,ActualRatioTagName}=this.props.buildingInfo.toJS();
    let addIcon=<FontIcon className="icon-add" color="#32ad3c"/>;
    var styles={
      button:{
        marginRight:'15px',
        height:'30px',
        lineHeight:'30px'
      },
      label:{
        fontSize:'14px',
        lineHeight:'14px',
        verticalAlign:'baseline'
      }
    };

    return(
      <div className="jazz-kpi-tag-wrap" style={{color:'#9fa0a4'}}>
        <span style={{fontSize:'14px',color:'#626469'}}>{IndicatorName}</span>
        <span>=</span>
        <span>
          <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
          {ActualTagName && <div style={{color:'#626469'}}>{ActualTagName}</div>}
          {isCreate && !ActualTagName && <NewFlatButton label={I18N.Setting.Tag.Tag} labelStyle={styles.label} secondary={true}
                                                icon={<FontIcon className="icon-add" style={styles.label}/>} style={styles.button}
                                                onClick={()=>{this._tagSelect(true,1)}}/>}
          {isCreate && ActualTagName && <div className="reelect" onTouchTap={()=>{this._tagSelect(true,1)}}>{I18N.SaveEffect.SelectTagAgain}</div>}


          </div>

          <hr/>

          <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
          {ActualRatioTagName && <div style={{color:'#626469'}}>{ActualRatioTagName}</div>}
          {isCreate && !ActualRatioTagName && <NewFlatButton label={I18N.Setting.Tag.Tag} labelStyle={styles.label} secondary={true}
                                                icon={<FontIcon className="icon-add" style={styles.label}/>} style={styles.button}
                                                onClick={()=>{this._tagSelect(true,2)}}/>}
          {isCreate && ActualRatioTagName && <div className="reelect" onTouchTap={()=>{this._tagSelect(true,2)}}>{I18N.SaveEffect.SelectTagAgain}</div>}
          
          </div>

        </span>
        <span>
          <div style={{height:'22px',marginBottom:'5px'}}>
                {!this.state.tagHasHistory && ActualTagName && !this.props.isViewStatus && <div style={{color:'#dc0a0a',fontSize:'16px',display:'flex',alignItems:'baseline'}}>
                                            <FontIcon className="icon-no_ecm" color="#dc0a0a" style={{fontSize:'16px',marginRight:'5px'}}/>
                                            {I18N.Setting.KPI.Parameter.NoCalcViaHistory}
                </div>}
          </div>
          <div style={{marginTop:'14px',height:'22px'}}>
            {!this.state.ratioTagHasHistory && ActualRatioTagName && !this.props.isViewStatus && <div style={{color:'#dc0a0a',fontSize:'16px',display:'flex',alignItems:'baseline'}}>
                                            <FontIcon className="icon-no_ecm" color="#dc0a0a" style={{fontSize:'16px',marginRight:'5px'}}/>
                                            {I18N.Setting.KPI.Parameter.NoCalcViaHistory}
                </div>}
          </div>
      

        </span>
      </div>
    )
  }

  _renderViewTag(){
    let {IndicatorName}=this.props.kpiInfo.toJS();
    let {ActualTagName,ActualRatioTagName}=this.props.buildingInfo.toJS();

    return(
      <div className="jazz-kpi-tag-wrap" style={{color:'#9fa0a4'}}>
        <span style={{fontSize:'14px',color:'#626469'}}>{IndicatorName}</span>
        <span>=</span>
        <span>
          <div style={{fontSize:'14px',color:'#626469'}}>{ActualTagName}</div>
          <hr/>
          <div style={{fontSize:'14px',color:'#626469'}}>{ActualRatioTagName}</div>
        </span>
                <span>
          <div style={{height:'22px',marginBottom:'5px'}}>
                {!this.state.tagHasHistory && ActualTagName && !this.props.isViewStatus && <div style={{color:'#dc0a0a',fontSize:'16px',display:'flex',alignItems:'baseline'}}>
                                            <FontIcon className="icon-no_ecm" color="#dc0a0a" style={{fontSize:'16px',marginRight:'5px'}}/>
                                            {I18N.Setting.KPI.Parameter.NoCalcViaHistory}
                </div>}
          </div>
          <div style={{marginTop:'14px',height:'22px'}}>
            {!this.state.ratioTagHasHistory && ActualRatioTagName && !this.props.isViewStatus && <div style={{color:'#dc0a0a',fontSize:'16px',display:'flex',alignItems:'baseline'}}>
                                            <FontIcon className="icon-no_ecm" color="#dc0a0a" style={{fontSize:'16px',marginRight:'5px'}}/>
                                            {I18N.Setting.KPI.Parameter.NoCalcViaHistory}
                </div>}
          </div>
      

        </span>
      </div>
    )
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //     return (nextState!==this.state || nextProps.buildingInfo !== this.props.buildingInfo || nextProps.isCreate !== this.props.isCreate);
  // }

   isAutoCalculable(id,index,props){
    var {Year}=props.kpiInfo.toJS();
    SingleKPIAction.IsAutoCalculable(customerId,id,Year,index);
  }

    componentDidMount(){
   let {ActualTagId,ActualRatioTagId}=this.props.buildingInfo.toJS();
    customerId=parseInt(this.context.router.params.customerId);
    MonthKPIStore.addChangeListener(this._onChange);
    if(!this.props.isCreate){
      this.isAutoCalculable(ActualTagId,1,this.props);
      this.isAutoCalculable(ActualRatioTagId,2,this.props);
    }
    
  }

  	componentWillReceiveProps(nextProps, nextContext) {
      if(this.props.buildingInfo.get("ActualTagId")!==nextProps.buildingInfo.get("ActualTagId")){
        this.setState({
        tagHasHistory:true,
      },()=>{
        if(nextProps.buildingInfo.get("ActualTagId")){this.isAutoCalculable(nextProps.buildingInfo.get("ActualTagId"),1,nextProps);}
      })
      }
		if(this.props.buildingInfo.get("ActualRatioTagId")!==nextProps.buildingInfo.get("ActualRatioTagId")) {
      this.setState({
        ratioTagHasHistory:true
      },()=>{
        if(nextProps.buildingInfo.get("ActualRatioTagId")){this.isAutoCalculable(nextProps.buildingInfo.get("ActualRatioTagId"),2,nextProps);}
      })
			
    }

    if(this.props.isViewStatus!==nextProps.isViewStatus){
      this.isAutoCalculable(nextProps.buildingInfo.get("ActualTagId"),1,nextProps);
      this.isAutoCalculable(nextProps.buildingInfo.get("ActualRatioTagId"),2,nextProps);
    }
	}

  shouldComponentUpdate(nextProps, nextState) {
      return (nextState!==this.state || nextProps.buildingInfo !== this.props.buildingInfo || nextProps.isCreate !== this.props.isCreate);
  }

  componentWillUnmount(){
    MonthKPIStore.removeChangeListener(this._onChange);
  }


  render(){
    var that=this;
    let {isCreate}=this.props;
    let {UomId,RatioUomId,RatioCommodityId,NumeratorCommodityId}=this.props.kpiInfo.toJS();
    let {HierarchyName,HierarchyId,ActualTagId,ActualTagName,ActualRatioTagId,ActualRatioTagName}=this.props.buildingInfo.toJS();

    if(!UomId){UomId=this.props.buildingInfo.get("UomId")}
    if(!RatioUomId){RatioUomId=this.props.buildingInfo.get("RatioUomId")}
    if(!RatioCommodityId){RatioCommodityId=this.props.buildingInfo.get("RatioCommodityId")}
    if(!NumeratorCommodityId){NumeratorCommodityId=this.props.buildingInfo.get("NumeratorCommodityId")}

    let props={
      title:I18N.Setting.KPI.Group.MonthConfig.TagSelect,
      contentStyle:{
        marginLeft:'0'
      },
    };
    let tagSelectProps={
      key:'tagselect',
      title:I18N.EM.Report.SelectTag,
      hierarchyId:HierarchyId,
      hierarchyName:HierarchyName,
      tag:Immutable.fromJS({
        Id:that.state.tagIndex===1?ActualTagId:ActualRatioTagId,
        Name:that.state.tagIndex===1?ActualTagName:ActualRatioTagName,
        UomId:that.state.tagIndex===1?UomId:RatioUomId,
        CommodityId:that.state.tagIndex===1?NumeratorCommodityId:RatioCommodityId,
      }),

      onSave:(tag)=>this._onTagSave(tag,this.state.tagIndex),
      onCancel:()=>{
        this._tagSelect(false)
      }
    };
    return(
      <div style={{marginTop:'25px'}}>
        {isCreate?this._renderCreateTag():this._renderViewTag()}
        {this.state.tagShow && <TagSelect {...tagSelectProps}/>}
      </div>
    )
  }
}

RatioActualTag.propTypes={
  	kpiInfo:PropTypes.object,
    buildingInfo:PropTypes.object,
    isCreate:PropTypes.bool,
    isViewStatus:PropTypes.bool,
}
