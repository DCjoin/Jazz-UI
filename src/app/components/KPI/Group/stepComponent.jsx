import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import BubbleIcon from 'components/BubbleIcon.jsx';
import FontIcon from 'material-ui/FontIcon';

export default class StepComponent extends Component {

  render(){
    var styles={
      bubble:{
          borderRadius:'100px',
          backgroundColor:this.props.isfolded?'#a3e7b0':'#32ad3d',
          border:this.props.isfolded?'1px solid #a3e7b0':'1px solid #32ad3d',
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
      <div className="jazz-kpi-config-edit-step-component">
        <header className="jazz-kpi-config-edit-step-component-title">
          <div>
            <BubbleIcon number={this.props.step} style={styles.bubble} numberStyle={styles.number}/>
            <div className="jazz-kpi-config-edit-step-component-title-label" style={this.props.isfolded?{color: '#9fa0a4'}:{}}>{this.props.title}</div>
          </div>
          {this.props.isView && !this.props.isfolded && <div className={classNames({
				                                        "operation":true,
				                                        'disabled':this.props.editDisabled
			                                          })} onClick={!this.props.editDisabled && this.props.onEdit}>
            <FontIcon className="icon-edit" color={this.props.editDisabled?"#cbcbcb":"#32ad3c"} style={styles.icon}/>
            {I18N.Baseline.Button.Edit}
          </div>}

        </header>
        {!this.props.isfolded && <div className="jazz-kpi-config-edit-step-component-content" style={{paddingRight:'0',paddingBottom:'0px'}}>
          {this.props.children}
        </div>}
      </div>
    )
  }
}

StepComponent.propTypes = {
  step:React.PropTypes.number,
  title:React.PropTypes.string,
  editDisabled:React.PropTypes.boolean,
  isView:React.PropTypes.boolean,
  onEdit:React.PropTypes.func,
  isfolded:React.PropTypes.boolean,
};
