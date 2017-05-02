import React, { Component } from 'react';
import TextField from '../../../controls/CustomTextField.jsx';
import MeasuresStore from 'stores/ECM/MeasuresStore.jsx';

export default class Problem extends Component {

    constructor(props) {
      super(props);
    }

    render(){
      var {canEdit,measure}=this.props;
      var {EnergyProblem}=measure.toJS();
      var props={
        name:{
          key:'EnergyProblem'+EnergyProblem.Id+'_Name'+new Date(),
          isNumber:false,
          onChange:(ev,value)=>{
                                if(value===''){value=EnergyProblem.Name}
                                this.props.merge(['EnergyProblem','Name'],value)
                              },
          value:EnergyProblem.Name,
          style:{marginTop:'-5px'},
          width:'100%',
          multiLine:true,
          displayFn:MeasuresStore.getDisplayText
        },
        description:{
          key:'EnergyProblem'+EnergyProblem.Id+'_Description'+new Date(),
          isNumber:false,
          onChange:(ev,value)=>{
                                if(value===''){value=EnergyProblem.Description}
                                this.props.merge(['EnergyProblem','Description'],value);
                              },
          value:EnergyProblem.Description,
          style:{marginTop:'-5px'},
          width:'100%',
          multiLine:true,
          displayFn:MeasuresStore.getDisplayText
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
          <div className="row">
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
