import React, { Component, PropTypes } from 'react';
import InputDataStore from 'stores/DataAnalysis/InputDataStore.jsx';
import {CircularProgress,FontIcon,FlatButton,TextField} from 'material-ui';
import classNames from 'classnames';
import Pagination from 'controls/paging/Pagination.jsx';
import InputDataAction from 'actions/DataAnalysis/InputDataAction.jsx';
import util from 'util/Util.jsx';


var page = 0;
var total=0;


export default class TagList extends Component {

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
		this._getTag = this._getTag.bind(this);
  }

  state={
    tagList:InputDataStore.getTagList()
  }

  _onChange(){
    total=InputDataStore.getTotal();
    if(total!==0 && page===0) page=1;

    this.setState({
      tagList:InputDataStore.getTagList()
    })
  }

  _getTag(props=this.props){
    InputDataAction.getTags(props.customerId,props.hierarchyId,page);
  }

  _onPrePage() {
    if (page > 1) {
      page = page - 1;
      this._getTag();
    }
  }

  _onNextPage() {
    if (20 * page < total) {
      page = page + 1;
      this._getTag();
        }
  }

  _jumpToPage(targetPage) {
    page = targetPage;
    this._getTag();
  }

  _renderTag(){
    return(
      <div className="jazz-input-data-tag-panel-list">
        {this.state.tagList.map(tag=>(
          <div className={classNames({
              "jazz-input-data-tag-panel-list-item": true,
              "selected":this.props.selectedTag && this.props.selectedTag.get('Id')===tag.get('Id'),
            })} onClick={()=>{this.props.onSelectedTagChange(tag)}} title={tag.get('Name')}>
            {tag.get('Name')}
          </div>
        ))}
      </div>
    )
  }

  _renderPagination(){
    var totalPageNum = parseInt((total + 19) / 20),
        hasJumpBtn = (total === 0) ? false : true;
    return(
      <div style={{
            minHeight: '52px',
            paddingRight: '10px',
            marginBottom:'30px'
          }}>
          <Pagination previousPage={()=>{this._onPrePage()}}
            nextPage={()=>{this._onNextPage()}}
            jumpToPage={(page)=>{this._jumpToPage(page)}}
            curPageNum={page}
            totalPageNum={totalPageNum}
            hasJumpBtn={hasJumpBtn}/>
        </div>
    )
  }

  componentDidMount(){
    total=InputDataStore.getTotal();
    if(total!==0 && page===0) page=1;
    InputDataStore.addChangeListener(this._onChange);

  }

	componentWillReceiveProps(nextProps, nextContext) {
		if( !util.shallowEqual(nextProps.hierarchyId, this.props.hierarchyId) ) {
			page=0;
			this.setState({
			tagList:null
			});
			this._getTag(nextProps)
		}
	}

  componentWillUnmount(){
    InputDataStore.removeChangeListener(this._onChange);
  }

  render(){
    if(this.state.tagList===null){
      return(
        <div className="jazz-input-data-tag-panel flex-center" style={{flex:'none'}}>
          <CircularProgress  mode="indeterminate" size={80} />
        </div>
      )
    }else {
      return(
        <div className="jazz-input-data-tag-panel">
          {this._renderTag()}
          {this._renderPagination()}
        </div>
      )
    }

  }
}

TagList.propTypes = {
  selectedTag:React.PropTypes.object,
  hierarchyId:React.PropTypes.number,
	customerId:React.PropTypes.number,
  onSelectedTagChange:React.PropTypes.func,
};
