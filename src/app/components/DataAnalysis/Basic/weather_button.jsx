import React, { Component, PropTypes } from 'react';
import WeatherStore from 'stores/DataAnalysis/weather_store.jsx';
import ButtonMenu from 'controls/CustomButtonMenu.jsx';
import Checkbox from 'material-ui/Checkbox';
import WeatherAction from 'actions/DataAnalysis/weather_action.jsx';
import HierarchyStore from 'stores/HierarchyStore.jsx';
import util from 'util/Util.jsx';
import RoutePath from 'util/RoutePath.jsx';
import {find} from 'lodash-es';

function findBuilding(hierarchyId){
  return find(HierarchyStore.getBuildingList(), building => building.Id === hierarchyId * 1 );
}

export default class WeatherButton extends Component {

	static contextTypes = {
		hierarchyId: PropTypes.string,
    currentRoute:React.PropTypes.object,
	};

 constructor(props) {
    super(props);
    this._onChanged = this._onChanged.bind(this);
  }

  state={
    selectedTag:WeatherStore.getSelectedTag(),
  }

  _onChanged(){
    this.setState({
      selectedTag:WeatherStore.getSelectedTag()
    })
  }

  _onCheck(tag,ischecked){
    WeatherAction.checkedTag(tag,ischecked)
  }

  	_getHierarchyId(context) {
		return context.hierarchyId;
	}
  _weatherTagdisabled(tag){
    return this.props.step<2 && (tag.weatherType===3 || tag.weatherType===4)
  }

  componentDidMount(){
    WeatherStore.addChangeListener(this._onChanged);
  }

  componentWillUnmount() {
    WeatherStore.removeChangeListener(this._onChanged);
  }

  render(){
    var building=findBuilding(this._getHierarchyId(this.context));
    if(building){
      return(
      <div className="jazz-AuxiliaryCompareBtn-container">
        <ButtonMenu ref={'button_menu'} label={I18N.EM.Tool.Weather.WeatherData}  style={{
          marginLeft: '10px'
        }} backgroundColor="#f3f5f7" disabled={this.props.disabled}>
        {building.Location && this.props.taglist && this.props.taglist.map(tag=>{
          return(
          <Checkbox label={tag.tagName} iconStyle={{width:'16px',height:'16px',marginTop:'2px'}} labelStyle={{fontSize:'14px',color:'#505559'}} style={{marginLeft:'15px'}} checked={this.state.selectedTag.findIndex((selected)=>selected.get("tagId")===tag.tagId)>-1}
                    onCheck={(e,isInputChecked)=>{this._onCheck(tag,isInputChecked)}}
                    disabled={this._weatherTagdisabled(tag)}/>
        )
        })}
        {building.Location===null && <div className="no_weather_config">
          <span>{I18N.Setting.DataAnalysis.Weather.To}</span>
          <div onClick={()=>{util.openTab(RoutePath.customerSetting.hierNode(this.context.currentRoute.params)+'/'+this._getHierarchyId(this.context)+'?init_hierarchy_id='+this.context.hierarchyId)}}>{I18N.Setting.DataAnalysis.Weather.Location}</div>
          <span>{I18N.Setting.DataAnalysis.Weather.Config}</span>
          </div>}
       </ButtonMenu>
      </div>
    )
    }else{
      return null
    }

  }
}

WeatherButton.propTypes = {
  disabled:React.PropTypes.bool,
  taglist:React.PropTypes.array,
  step:React.PropTypes.number
};