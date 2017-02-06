'use strict';
import React, { Component }  from "react";
import ReactDom from 'react-dom';
import Drawer from 'material-ui/Drawer';
import Header from 'controls/HierAndDimHeader.jsx';
import { FontIcon, TextField} from 'material-ui';
import TagStore from 'stores/TagStore.jsx';

export default class TagDrawer extends Component {

  state={
    open:true
  }

  _onHierachyTreeClick(){

  }

  _onSearch(e) {
    var value = e.target.value;
    if (TagStore.getData().length === 0) {
      //FolderAction.setDisplayDialog('errornotice', null, I18N.Tag.SelectError);
    } else {
      if (value) {
        ReactDom.findDOMNode(this.refs.cleanIcon).style.display = 'block';
        filters = [
          {
            "type": "string",
            "value": [value],
            "field": "Name"
          }
        ];
      } else {
        ReactDom.findDOMNode(this.refs.cleanIcon).style.display = 'none';
        filters = null;
      }
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
      timeoutID = setTimeout(() => {
        page = 1;
        TagAction.loadData(customerId,this.state.tagId, this.state.optionType, page, alarmType, filters);
      }, 200);
      this.setState({
        searchValue:value
      })
    }


  }

  _onSearchClick() {
    ReactDom.findDOMNode(this.refs.searchIcon).style.display = 'none';
  }

  _onSearchBlur(e) {
    if (!e.target.value) {
      ReactDom.findDOMNode(this.refs.searchIcon).style.display = 'block';
    }
  }

  _onCleanButtonClick() {
    ReactDom.findDOMNode(this.refs.cleanIcon).style.display = 'none';
    //this.refs.searchText.setValue("");
    filters = null;
    TagAction.loadData(customerId,this.state.tagId, this.state.optionType, page, alarmType, filters);
    this.setState({
      searchValue:''
    })
  }

  componentWillReceiveProps(){
      this.setState({
        open:true
      })
  }

  render(){
    var searchIconStyle = {
      fontSize: '16px',
      marginLeft: '5px',
      marginTop: '3px'
    },
    cleanIconStyle = {
      marginTop: '3px',
      fontSize: '16px',
      display: 'none',
      marginRight: '5px'
    },
    textFieldStyle = {
      flex: '1',
      height: '26px'
    };

    return(
      <Drawer
        docked={false}
        width={380}
        open={this.state.open}
        onRequestChange={(open) => this.setState({open})}>
        <div className="jazz-analysis-tag">
          <div className="header">
            <Header hierarchyId={this.props.hierarchyId} onHierachyTreeClick={this._onHierachyTreeClick} isBuilding={this.props.isBuilding}/>
          </div>
          <div  className="filter">
            <label className="search" onBlur={this._onSearchBlur}>
              <FontIcon className="icon-search" style={searchIconStyle} ref="searchIcon"/>
              <TextField style={textFieldStyle} underlineShow={false} value={this.state.searchValue} className="input" ref="searchText" onClick={this._onSearchClick} onChange={this._onSearch}/>
              <FontIcon className="icon-clean" style={cleanIconStyle} hoverColor='#6b6b6b' color="#939796" ref="cleanIcon" onClick={this._onCleanButtonClick}/>
            </label>

          </div>
        </div>
      </Drawer>
    )
  }
}

TagDrawer.propTypes = {
	hierarchyId:React.PropTypes.number,
  isBuilding:React.PropTypes.bool,
};
