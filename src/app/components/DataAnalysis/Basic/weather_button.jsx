import React, { Component } from 'react';
import WeatherStore from 'stores/DataAnalysis/weather_store.jsx';
import ButtonMenu from 'controls/CustomButtonMenu.jsx';
import Checkbox from 'material-ui/Checkbox';
import WeatherAction from 'actions/DataAnalysis/weather_action.jsx';

export default class WeatherButton extends Component {

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

  _onCheck(tag){
    WeatherAction.checkedTag(tag)
  }

  componentDidMount(){
    WeatherStore.addChangeListener(this._onChanged);
  }

  componentWillUnmount() {
    WeatherStore.removeChangeListener(this._onChanged);
  }

  render(){
     return(
      <div className="jazz-AuxiliaryCompareBtn-container">
        <ButtonMenu ref={'button_menu'} label={I18N.EM.Tool.Weather.WeatherData}  style={{
          marginLeft: '10px'
        }} backgroundColor="#f3f5f7" disabled={this.props.disabled}>
        {this.porps.taglist.map(tag=>(
          <Checkbox label={tag.TagName} checked={this.state.selectedTag.findIndex((selected)=>selected.TagId===tag.TagId)>-1}
                    onCheck={this._onCheck.bind(this,tag)}/>
        ))}
       </ButtonMenu>
      </div>
    )
  }
}

WeatherButton.propTypes = {
  disabled:React.PropTypes.bool,
  taglist:React.PropTypes.array,
};