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

    _renderMultiText(text){
      if(text===null) return ' — ';
      var arr = text.split('\n');

      if (arr.length > 1) {
        text = arr.map(item => {
          return <div>{item}</div>;
        });
      }

      return text
      }

    componentDidMount(){
      var {canEdit,measure}=this.props;
      var {Problem}=measure.toJS();
      var {Description,Name}=Problem;
      this.setState({
        Name,Description
      })
    }

    componentWillReceiveProps(nextProps){
      var {canEdit,measure}=nextProps;
      var {Problem}=measure.toJS();
      var {Description,Name}=Problem;
      this.setState({
        Description,Name
      })
    }


    render(){
      var {canEdit,measure}=this.props;
      var {Problem}=measure.toJS();
      var {Description,Name}=this.state;
      var props={
        name:{
          key:'EnergyProblem'+Problem.Id+'_Name',
          id:'EnergyProblem'+Problem.Id+'_Name',
          onChange:(ev,value)=>{
                                if(value===''){value=Name}
                                this.props.merge(['Problem','Name'],value)
                              },
          value:Name,
          hintText:I18N.Setting.ECM.AddProblemName,
          hintStyle:{fontSize:"12px",color:'#626469'},
          inputStyle:{fontSize:"14px",color:"#626469"},
          style:{marginTop:'-5px',width:'100%'},
          multiLine:true,
        },
        description:{
          key:'EnergyProblem'+Problem.Id+'_Description',
          id:'EnergyProblem'+Problem.Id+'_Description',
          onChange:(ev,value)=>{
                                if(value===''){value=Description}
                                this.props.merge(['Problem','Description'],value)
                              },
          value:Description,
          hintText:I18N.Setting.ECM.AddProblemDescription,
          hintStyle:{fontSize:"12px",color:'#626469'},
          inputStyle:{fontSize:"14px",color:"#626469"},
          style:{marginTop:'-5px',width:'100%'},
          multiLine:true,
        },
      };
      return(
        <div className="jazz-ecm-measure-problem">
          <div className="name">
            {I18N.Setting.ECM.ProblemDetail}
          </div>
          <div className="row" style={{paddingLeft:'11px',paddingRight:'42px'}}>
            <div className="label">
              {I18N.Setting.ECM.ProblemDetailName}
            </div>
            {canEdit?<TextField {...props.name}/>:<div className="jazz-ecm-measure-viewabletext" stlye={{fontSize:"16px",color:"#626469"}}>{this._renderMultiText(Problem.Name)}</div>}
          </div>
          <div className="row" style={{marginTop:"8px",paddingLeft:'11px',paddingRight:'42px'}}>
            <div className="label">
              {I18N.SaveEffect.Description}
            </div>
            {canEdit?<TextField {...props.description}/>:<div className="jazz-ecm-measure-viewabletext">{this._renderMultiText(Problem.Description)}</div>}
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
