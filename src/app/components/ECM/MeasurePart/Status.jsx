import React, { Component,PropTypes } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import {Status} from 'constants/actionType/Measures.jsx';

function getItems(status){
  switch (status) {
    case Status.ToBe:
        return[
          <MenuItem style={{fontSize:'12px'}} primaryText={MeasuresStore.getStatusText(Status.ToBe)} value={Status.ToBe}/>,
          <MenuItem style={{fontSize:'12px'}} primaryText={MeasuresStore.getStatusText(Status.Canceled)} value={Status.Canceled}/>
                ]
      break;
    case Status.Being:
          return[
            <MenuItem style={{fontSize:'12px'}} primaryText={MeasuresStore.getStatusText(Status.Being)} value={Status.Being}/>,
            <MenuItem style={{fontSize:'12px'}} primaryText={MeasuresStore.getStatusText(Status.Done)} value={Status.Done}/>,
            <MenuItem style={{fontSize:'12px'}} primaryText={MeasuresStore.getStatusText(Status.Canceled)} value={Status.Canceled}/>
                  ]
      break;
    case Status.Canceled:
            return[
              <MenuItem style={{fontSize:'12px'}} primaryText={MeasuresStore.getStatusText(Status.Canceled)} value={Status.Canceled}/>,
              <MenuItem style={{fontSize:'12px'}} primaryText={MeasuresStore.getStatusText(Status.ToBe)} value={Status.ToBe}/>
                    ]
      break;
    default:

  }
}

export default class StatusCmp extends Component {

    constructor(props) {
      super(props);
    }

    _renderEditStatus(){
      return(
        <DropDownMenu style={{marginTop:'-10px',border:'1px solid #abafae',height:'25px',borderRadius:'20px'}}
                      labelStyle={{lineHeight:'25px',fontSize:'12px'}}
                      iconStyle={{marginTop:'-10px'}}
                      underlineStyle={{border:'none'}}
                      value={this.props.status}
                      onChange={(e, selectedIndex, value)=>{
                        this.props.onChange(value)
                      }}>
        {getItems(this.props.status)}
      </DropDownMenu>
      )
    }

    render(){
      return(
        <div className="measure-status">
          <div>{`${I18N.Setting.ECM.PushPanel.Status}：`}</div>
          {this.props.canEdit && status!==Status.Done?this._renderEditStatus():MeasuresStore.getStatusText(this.props.status)}
        </div>
      )

    }
  }

  StatusCmp.propTypes={
    status:PropTypes.number,
    canEdit:PropTypes.bool,
    onChange:PropTypes.func
  }
