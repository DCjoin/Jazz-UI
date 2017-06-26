import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';

export default class Problem extends Component {

    constructor(props) {
      super(props);
    }

    state={
      Name:"",
      Description:""
    }

    componentDidMount(){
      var {canEdit,measure}=this.props;
      var {EnergyProblem}=measure.toJS();
      var {Description,Name}=EnergyProblem;
      this.setState({
        Name,Description
      })
    }

    componentWillReceiveProps(nextProps){
      var {canEdit,measure}=this.props;
      var {EnergyProblem}=measure.toJS();
      var {Description,Name}=EnergyProblem;
      this.setState({
        Description,Name
      })
    }


    render(){
      var {canEdit,measure}=this.props;
      var {EnergyProblem}=measure.toJS();
      var {Description,Name}=this.state;
      var props={
        name:{
          key:'EnergyProblem'+EnergyProblem.Id+'_Name',
          id:'EnergyProblem'+EnergyProblem.Id+'_Name',
          onChange:(ev,value)=>{
                                if(value===''){value=EnergyProblem.Name}
                                this.props.merge(['EnergyProblem','Name'],value)
                              },
          value:Name,
          hintText:I18N.Setting.ECM.AddProblemName,
          hintStyle:{fontSize:"12px"},
          style:{marginTop:'-5px',width:'100%'},
          multiLine:true,
        },
        description:{
          key:'EnergyProblem'+EnergyProblem.Id+'_Description',
          id:'EnergyProblem'+EnergyProblem.Id+'_Description',
          onChange:(ev,value)=>{
                                if(value===''){value=EnergyProblem.Description}
                                this.props.merge(['EnergyProblem','Description'],value)
                              },
          value:Description,
          hintText:I18N.Setting.ECM.AddProblemDescription,
          hintStyle:{fontSize:"12px"},
          style:{marginTop:'-5px',width:'100%'},
          multiLine:true,
        },
      };
      return(
        <div className="jazz-ecm-measure-problem">
          <div className="name">
            {I18N.Setting.ECM.ProblemDetail}
          </div>
          <div className="row">
            <div className="label">
              {I18N.Setting.ECM.ProblemDetailName}
            </div>
            {canEdit?<TextField {...props.name}/>:<div className="jazz-ecm-measure-viewabletext">{MeasuresStore.getDisplayText(EnergyProblem.Name)}</div>}
          </div>
          <div className="row" style={{marginTop:"8px"}}>
            <div className="label">
              {I18N.Setting.UserManagement.Comment}
            </div>
            {canEdit?<TextField {...props.description}/>:<div className="jazz-ecm-measure-viewabletext">{MeasuresStore.getDisplayText(EnergyProblem.Description)}</div>}
          </div>
        </div>
      )



    }

}

Problem.propTypes = {
  measure:React.PropTypes.object,
  canEdit:React.PropTypes.bool,
  merge:React.PropTypes.func
};
