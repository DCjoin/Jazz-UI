'use strict';
import React, {Component,PropTypes} from 'react';
import Immutable from 'immutable';
import TagSelect from '../Single/TagSelect.jsx';
import MonthKPIAction from 'actions/KPI/MonthKPIAction.jsx';
import NewFlatButton from 'controls/NewFlatButton.jsx';
import FontIcon from 'material-ui/FontIcon';
import MonthKPIStore from 'stores/KPI/MonthKPIStore.jsx';
import {Type} from 'constants/actionType/KPI.jsx';
import SingleKPIAction from 'actions/KPI/SingleKPIAction.jsx';

var customerId;
export default class ActualTag extends Component {

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this._onTagSave = this._onTagSave.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  state={
    hasHistory:true,
    tagShow:false
  };

   _onChange(){
    this.setState({
      hasHistory:MonthKPIStore.getHasHistory()
    })
  }

  _tagSelect(show){
    this.setState({
      tagShow:show
    })
  }

  _onTagSave(tag){
    this.setState({
      tagShow:false
    },()=>{
      MonthKPIAction.merge([{
        path:'ActualTagName',
        value:tag.get('Name')
      },{
        path:'ActualTagId',
        value:tag.get('Id')
      },{
        path:'UomId',
        value:tag.get('UomId')
      }])
    })

  }

  _renderConfig(){
    let {isCreate}=this.props;
    let {CommodityId,UomId}=this.props.kpiInfo.toJS();
    let {HierarchyName,HierarchyId,ActualTagId,ActualTagName}=this.props.buildingInfo.toJS();
    if(!UomId){UomId=this.props.buildingInfo.get("UomId")}
    if(!CommodityId){CommodityId=this.props.buildingInfo.get("CommodityId")}
    let tagSelectProps={
    	key:'tagselect',
      title:I18N.Setting.KPI.Group.GroupConfig.SelectTag,
    	hierarchyId:HierarchyId,
    	hierarchyName:HierarchyName,
      tag:Immutable.fromJS({
        Id:ActualTagId,
        Name:ActualTagName,
        UomId,CommodityId
      }),
    	onSave:this._onTagSave,
    	onCancel:()=>{
        this._tagSelect(false)
      }
    };

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
            <div className="jazz-kpi-tag-wrap">
              {ActualTagName && <div style={{color:'#626469'}}>{ActualTagName}</div>}
              {isCreate && !ActualTagName && <NewFlatButton label={I18N.Setting.Tag.Tag} labelStyle={styles.label} secondary={true}
                                                icon={<FontIcon className="icon-add" style={styles.label}/>} style={styles.button}
                                                onClick={()=>{this._tagSelect(true)}}/>}
              {isCreate && ActualTagName && <div className="reelect" onTouchTap={()=>{this._tagSelect(true)}}>{I18N.SaveEffect.SelectTagAgain}</div>}
              {!this.state.hasHistory && ActualTagName && !this.props.isViewStatus && <div style={{color:'#dc0a0a',fontSize:'16px',display:'flex',marginLeft:'30px',alignItems:'baseline'}}>
                                            <FontIcon className="icon-no_ecm" color="#dc0a0a" style={{fontSize:'16px',marginRight:'5px'}}/>
                                            {I18N.Setting.KPI.Parameter.NoCalcViaHistory}
                </div>}
              {this.state.tagShow && <TagSelect {...tagSelectProps}/>}
            </div>
    )

  }

  isAutoCalculable(props){
    var {ActualTagId}=props.buildingInfo.toJS(),
        {Year,IndicatorClass}=props.kpiInfo.toJS();
        if(IndicatorClass===Type.Dosage){
          if(ActualTagId){
            SingleKPIAction.IsAutoCalculable(customerId,ActualTagId,Year);
          }
        }
  }
  componentDidMount(){
    customerId=parseInt(this.context.router.params.customerId);
    MonthKPIStore.addChangeListener(this._onChange);
    this.isAutoCalculable(this.props)

  }

  	componentWillReceiveProps(nextProps, nextContext) {
		if( this.props.buildingInfo.get("ActualTagId")!==nextProps.buildingInfo.get("ActualTagId")) {
      this.setState({
        hasHistory:true
      },()=>{
        this.isAutoCalculable(nextProps)
      })
			
    }
	}

  shouldComponentUpdate(nextProps, nextState) {
      return (nextState!==this.state || nextProps.buildingInfo !== this.props.buildingInfo || nextProps.isCreate !== this.props.isCreate);
  }

    componentWillUnmount(){
    MonthKPIStore.removeChangeListener(this._onChange);
  }

  render(){
    return(
      <div style={{marginTop:'15px'}}>
        <div className="jazz-kpi-tag-title">{I18N.Setting.KPI.Config.Tag}</div>
        {this._renderConfig()}
      </div>
    )
  }
}

ActualTag.propTypes={
  	kpiInfo:React.PropTypes.object,
    buildingInfo:React.PropTypes.object,
    isCreate:PropTypes.bool,
    isViewStatus:PropTypes.bool,
}
