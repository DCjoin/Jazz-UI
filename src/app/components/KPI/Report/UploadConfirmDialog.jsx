import React, { Component } from 'react';
import ReportAction from 'actions/KPI/ReportAction.jsx';
import ReportStore from 'stores/KPI/ReportStore.jsx';
import {ReportStatus} from '../../../constants/actionType/KPI.jsx';
import NewDialog from 'controls/NewDialog.jsx';
import FlatButton from 'controls/FlatButton.jsx';

export default class UploadConfirmDialog extends Component {

  static contextTypes = {
    router: React.PropTypes.object,
  };

    constructor(props) {
      super(props);
      this._onChange = this._onChange.bind(this);
    }

    state={
      res:null
    }

    _onChange(res){
      this.setState({
        res
      })
    }

    getActions(){
      if(this.state.res.Status!==ReportStatus.ExistAndCanNotReplaced){
        return[
          <FlatButton
            label={I18N.Common.Button.Confirm}
            onClick={this.props.onConfirm} />,
            <FlatButton
              label={I18N.Common.Button.Cancel2}
              onClick={this.props.onCancel} />
        ]
      }
      else {
        return[
          <FlatButton
            label={I18N.Common.Button.Confirm}
            onClick={this.props.onCancel} />
        ]
      }
    }

    getContent(){
      switch (this.state.res.Status) {
        case ReportStatus.ExistAndCanNotReplaced:
             return <div className="jazz-kpi-report-upload-confirm-title">{I18N.format(I18N.Setting.KPI.Report.ExistAndCanNotReplaced,this.props.name)}</div>
          break;
        case ReportStatus.ExistAndNoReference:
            return <div className="jazz-kpi-report-upload-confirm-title">{I18N.format(I18N.Setting.KPI.Report.ExistAndNoReference,this.props.name)}</div>
          break;
        case ReportStatus.ExistAndHaveReference:
            return (
                    <div>
                      <div className="jazz-kpi-report-upload-confirm-title">{I18N.format(I18N.Setting.KPI.Report.ExistAndHaveReference,this.props.name)}</div>
                      {this.state.res.ReportGroups.map(report=>(
                                                              <div className="jazz-kpi-report-upload-confirm-content">
                                                                <div className="jazz-kpi-report-upload-confirm-content-subtitle">
                                                                  {report.BuildingName}
                                                                </div>
                                                                <div className="jazz-kpi-report-upload-confirm-content-content">
                                                                  {report.ReportNames.join(' ，')}
                                                                </div>
                                                              </div>
                                                                ))}
                    </div>)

          break;

        default:

      }
    }

    componentDidMount(){
      ReportStore.addTemplateReferenceChangeListener(this._onChange);
      ReportAction.templateReference(this.props.name,parseInt(this.context.router.params.customerId))
    }

    componentWillReceiveProps(nextProps, nextContext) {
      if(this.props.name!==nextProps.name){
        ReportAction.templateReference(this.props.name,parseInt(this.context.router.params.customerId))
      }

    }

    componentWillUnmount(){
      ReportStore.removeTemplateReferenceChangeListener(this._onChange);
    }

    render(){
      if(this.state.res===null){
        return null
      }else {
        if(this.state.res.Status===ReportStatus.NotExist){
          this.props.onConfirm();
          return null
        }
        else {
          var styles={
            content:{
              padding:'30px',
              display:'flex',
              justifyContent:'center'
            },
            action:{
              padding:'0 30px'
            }
          };
          return(
            <NewDialog
              open={true}
              overlayStyle={{zIndex:'1000'}}
              actionsContainerStyle={styles.action}
              contentStyle={styles.content}
              actions={this.getActions()}
            >{this.getContent()}</NewDialog>
          )
        }
      }
    }
  }

  UploadConfirmDialog.propTypes = {
    name:React.PropTypes.object,
    onConfirm:React.PropTypes.func,
    onCancel:React.PropTypes.func
  };
