import React, { Component, PropTypes } from 'react';
import BubbleIcon from 'components/BubbleIcon.jsx';
import FontIcon from 'material-ui/FontIcon';

export default class StepComponent extends Component {

  render(){
    var styles={
      bubble:{
          borderRadius:'100px',
          backgroundColor:'#32ad3d',
          border:'1px solid #32ad3d',
          width:'20px',
          height:'20px',
        },
        number:{
          fontSize: '14px',
          color: '#ffffff'
        },
        icon:{
          fontSize:'15px',
          lineHeight:'15px',
          marginRight:'5px'
        }

    }
    return(
      <div className="jazz-save-effect-edit-step-component">
        <header className="jazz-save-effect-edit-step-component-title">
          <div>
            <BubbleIcon number={this.props.step} style={styles.bubble} numberStyle={styles.number}/>
            <div className="jazz-save-effect-edit-step-component-title-label">{this.props.title}</div>
            {this.props.hasAlert && <div className="jazz-save-effect-edit-step-component-title-alert">
              <FontIcon className="icon-VIP" style={styles.icon} color="#ff4548"/>
              {I18N.SaveEffect.Alert}
            </div>}
          </div>
          {this.props.isView && <div className="opertion" onClick={this.props.onEdit}>
            <FontIcon className="icon-edit" color="#505559" style={styles.icon}/>
            {I18N.Baseline.Button.Edit}
          </div>}

        </header>
        {!this.props.isfolded && <div className="jazz-save-effect-edit-step-component-content">
          {this.props.children}
        </div>}
      </div>
    )
  }
}

StepComponent.propTypes = {
  step:React.PropTypes.number,
  title:React.PropTypes.string,
  hasAlert:React.PropTypes.boolean,
  isView:React.PropTypes.boolean,
  onEdit:React.PropTypes.func,
  isfolded:React.PropTypes.boolean,
};
