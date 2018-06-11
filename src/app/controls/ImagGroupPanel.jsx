'use strict';

import PropTypes from 'prop-types';

import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import BackgroundImage from 'controls/BackgroundImage.jsx';
import ImagesView from './images_view.jsx';
import Immutable from 'immutable';

class ImageItemContainer extends Component{
	static propTypes= {
		width: PropTypes.number,
		height: PropTypes.number,
    //diagram: Immutable.Map({ImageUrl:xxx})
		diagram: PropTypes.object,
		index: PropTypes.number,
		onDelete: PropTypes.func,
    onClick: PropTypes.func,
    editable: PropTypes.bool,
	};

  static defaultProps = {};

	constructor(props) {
		super(props);
    this._openDelete = this._openDelete.bind(this);
    this._onDelete = this._onDelete.bind(this);
	}

  state = {
		showDelete: false
  };

  _onDelete() {
    this.props.onDelete(this.props.index);
    this.setState({
      showDelete: false
    });
  }

	_openDelete() {
		this.setState({
      showDelete: true
    });
	}

	onClickAway() {
    this.setState({
      showDelete: false
    });
  }

	render() {
    var buttonContainer = null;
    if(this.props.editable) {
      buttonContainer = (
        <div className="button-delete-container">
          <IconButton iconClassName="icon-delete" className="pop-admin-button-icon"
            iconStyle={{fontSize: "14px", width: '26px', height: '26px',lineHeight: "26px"}}
            style={{width: '26px', height: '26px', padding: '0px'}}
            onTouchTap={this._openDelete}/>
        </div>
      );
    }
		if(this.state.showDelete) {
      buttonContainer = (
        <div className="button-confirm-delete">
          <div className="button-delete" onClick={this._onDelete}>{"确认删除？"}</div>
        </div>
      );
    }

		return (
			<div className="single-line-diagram" style={{}}>
        <BackgroundImage width={this.props.width} height={this.props.height}
          title={this.props.diagram.get("Description")}
					onClick={this.props.onClick}
					imageId={this.props.diagram.get('ImageId')} mode="cover"
					imageContent={this.props.diagram.get('Content')} 
          url={'url('+this.props.diagram.get('ImageUrl')+')'}/>
				{buttonContainer}
			</div>
		);
	}
}

// example:
//<ImagGroupPanel diagrams={this.state.solution.getIn(["Solutions",0,"SolutionImages"])} width={145} height={100} editable={false}/>

export default class ImageFroupPanel extends Component{

        static propTypes= {
          width: PropTypes.number,
          height: PropTypes.number,
          //diagrams: Immutable.List({ImageUrl:xxx})
          diagrams: PropTypes.object,
          onDelete: PropTypes.func,
          editable: PropTypes.bool,
        };

        static defaultProps = {};

        constructor(props, ctx) {
          super(props);
          this._handleShowImage = this._handleShowImage.bind(this);         

          this.state={
            showMax: null,
          }
          
        } 

        _handleShowImage(item) {
            this.setState({
                  showMax: item
              });
	        }

        _renderOverlay(){
          return(
            <ImagesView
              idx={this.state.showMax.index}
              editable={false}
              data={Immutable.fromJS({
                Pictures: this.state.showMax.images
              })}
              onRequestClose={()=>{
                this.setState({showMax:null})
              }}/>
          )
        }

        render(){
          var {diagrams,height,width,editable}=this.props;
          return(
            <div className="image-group">
              {diagrams.map((diagram,index)=><div style={{width:width,height:height,minWidth:width,marginRight:'10px',marginTop:'10px'}}><ImageItemContainer width={width}
                                                                 height={height}
                                                                 diagram={diagram}
                                                                 index={index}
                                                                 editable={editable}
                                                                 onClick={(e)=>{
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    this._handleShowImage({index:index,images:diagrams})}
                                                                }/>
                                                                </div>)}
            {this.state.showMax!==null && this._renderOverlay()}
            </div>
          )
        }
}