import React, { Component } from 'react';
import TextField from '../../../controls/CustomTextField.jsx';

export default class Problem extends Component {

    constructor(props) {
      super(props);
    }

    render(){
      var {canEdit,measure}=this.props;
      var {EnergyProblem}=measure.toJS();
      var props={
        name:{
          isNumber:false,
          onChange:(ev,value)=>{
                                if(value===''){value=null}
                                this.props.merge(['EnergyProblem','Name'],value)
                              },
          value:EnergyProblem.Name,
          style:{marginTop:'-5px'},
          width:'100%',
          multiLine:true
        },
        description:{
          isNumber:false,
          onChange:(ev,value)=>{
                                if(value===''){value=null}
                                this.props.merge(['EnergyProblem','Description'],value)
                              },
          value:EnergyProblem.Description,
          style:{marginTop:'-5px'},
          width:'100%',
          multiLine:true
        },
      };
      return(
        <div className="jazz-ecm-measure-problem">
          <div className="name">
            {I18N.Setting.ECM.ProblemDetail}
          </div>
          <div className="row">
            <div className="label">
              {I18N.Common.Glossary.Name}
            </div>
            {canEdit?<TextField {...props.name}/>:EnergyProblem.Name}
          </div>
          <div className="row">
            <div className="label">
              {I18N.Setting.UserManagement.Comment}
            </div>
            {canEdit?<TextField {...props.description}/>:EnergyProblem.Name}
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
