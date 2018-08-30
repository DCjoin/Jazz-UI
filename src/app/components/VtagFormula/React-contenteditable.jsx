import React ,{Component}from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  height: 90px;
  padding: 0 4px;
  outline:none;
  overflow: auto;
  &:focus {
    border: 1px solid #19cd78;
  }
`;

// let IContentEditableProps={
//   // html:html,
//   onChange: onChange(),
//   onBlur: onBlur(),
//   style,
// }

let IContentEditableState= {}

class ContentEditable extends Component {
  constructor(props) {
    super(props);
    this.emitChange = this.emitChange.bind(this);
  }

  render() {
    return <TextWrapper
      style={this.props.style}
      ref="ContentEditable"
      onInput={this.emitChange}
      onBlur={() => this.onBlur()}
      contentEditable
      dangerouslySetInnerHTML={{__html: this.props.html}}></TextWrapper>;
  }

  shouldComponentUpdate(nextProps) {
    let ContentEditable = ReactDOM.findDOMNode(this.refs["ContentEditable"]);
    return nextProps.html !== ContentEditable.innerHTML;
  }

   emitChange() {
    let ContentEditable = ReactDOM.findDOMNode(this.refs["ContentEditable"]);
    let html = ContentEditable.innerHTML;
    if (this.props.onChange && html !== ContentEditable.lastHtml) {
      this.props.onChange(html);
    }
    ContentEditable.lastHtml = html;
  }

  onBlur() {
    this.emitChange();
    let ContentEditable = ReactDOM.findDOMNode(this.refs["ContentEditable"]);
    let html = ContentEditable.innerHTML;
    this.props.onBlur(html);
  }
}

export default ContentEditable;
