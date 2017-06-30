import React, { Component,PropTypes } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';
import {Status} from 'constants/actionType/Measures.jsx';
import IconButton from 'material-ui/IconButton';

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
        <DropDownMenu style={{height: '26px',marginLeft:'5px'}}
                      labelStyle={{fontSize:'14px',color:"#626469",border:"1px solid #e6e6e6",borderRadius: "4px",lineHeight:'26px',height:'26px',paddingLeft:'11px',paddingRight:'28px'}}
                      iconButton={<IconButton iconClassName="icon-arrow-down" iconStyle={{fontSize:"10px"}} style={{width:14,height:14}}/>}
                      iconStyle={{marginTop:'-12px',padding:'0',right:'15',width:'24px',top:'2px'}}
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
          <div className='jazz-ecm-push-operation-label'>{`${I18N.Setting.ECM.PushPanel.Status}：`}</div>
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
