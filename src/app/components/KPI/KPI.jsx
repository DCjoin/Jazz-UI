'use strict';
import React, {Component} from 'react';
import classNames from 'classnames';
import TagSelect from './TagSelect.jsx';
import KPIAction from '../../actions/KPI/KPIAction.jsx';
import FlatButton from '../../controls/FlatButton.jsx';

export default class KPI extends Component {

	static propTypes = {
    hierarchyId:React.PropTypes.number,
    hierarchyName:React.PropTypes.string,
		kpiId:React.PropTypes.number,
		isCreate:React.PropTypes.bool,
		onSave:React.PropTypes.func,
		onCancel:React.PropTypes.func,
  };

	static contextTypes = {
		router: React.PropTypes.object,
		currentRoute: React.PropTypes.object,
	};

  constructor(props) {
    super(props);
    this._onDialogDismiss = this._onDialogDismiss.bind(this);
  }

  state = {
    tageSelectShow:false,
    selectTag:null
  };

  _onTagSave(){

  }

  _onDialogDismiss(){
    this.setState({
      tageSelectShow:false
    })
  }

  render(){
    //let {hierarchyId,hierarchyName}=this.props;
    let hierarchyId=100010,hierarchyName='楼宇A';
    let tagProps={
      hierarchyId,
      hierarchyName,
      onSave:this._onTagSave,
      onCancel:this._onDialogDismiss
    }
    return(
      <div>
        <FlatButton label='test' onTouchTap={()=>{
            this.setState({
              tageSelectShow:true
            })
          }}/>
        {this.state.tageSelectShow && <TagSelect {...tagProps}/>}
      </div>
    )
  }


}
