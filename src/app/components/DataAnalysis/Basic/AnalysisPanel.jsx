'use strict';
import React, { Component }  from "react";
import FlatButton from 'controls/FlatButton.jsx';
import TagDrawer from './TagDrawer.jsx';

export default class AnalysisPanel extends Component {

  state={
      tagShow:false
  }

  render(){
    return(
      <div>
        <FlatButton label="XX" onClick={()=>{
            this.setState({
              tagShow:true
            })
          }}/>
        {this.state.tagShow?<TagDrawer {...this.props}/>:null}
      </div>
    )
  }
}

AnalysisPanel.propTypes = {
	hierarchyId:React.PropTypes.number,
  isBuilding:React.PropTypes.bool,
};

AnalysisPanel.defaultProps={
  hierarchyId:100002,
  isBuilding:false
}
