// import Immutable from "immutable";
import React, {Component} from "react";
import '../../less/VtagFormulaStyle/VtagStyle.less'
import ReactDOM from "react-dom";

import ContentEditable from "./React-contenteditable.jsx";
// import {TagConstants} from "./Tag.jsx";
import regex from "./regex.jsx";
import FormulaToolbar from "./FormulaToolbar.jsx";

// export * from "./FormulaToolbar.jsx";



// const Wrapper = styled.div`
//   height: 165px;
//   border-radius: 2px;
//   background-color: #ffffff;
//   border: solid 1px #e6e6e6;
// `;

const tagCSS = "max-width:200px;" + "border-radius:16px;" + "height:28px;" + "line-height:28px;" + "text-align:center;" +
  "padding-left:8px;" + "padding-right:8px;" + "margin-top:6px;" + "margin-bottom:6px;" +
  "vertical-align:middle;" + "font-size:14px;" + "white-space:nowrap;" + "text-overflow:ellipsis;" +
  "overflow:hidden;" + "word-break:keep-all;";

const lineCSS = "height:28px;" + "line-height:28px;" + "padding-left:2px;" + "padding-right:2px;" + "margin-top:6px;" +
  "margin-bottom:6px;" + "vertical-align:middle;" + "font-size:14px;";

const textCSS = "height:28px;" + "line-height:28px;" + "padding-left:6px;" + "padding-right:6px;" + "margin-top:6px;" +
  "margin-bottom:6px;" + "color:#666666;" + "vertical-align:middle;" + "font-size:14px;";

const markCSS = "height:28px;" + "line-height:28px;" + "padding-left:1px;" + "padding-right:1px;" + "margin-top:6px;" +
  "margin-bottom:6px;" + "color:#666666;" + "vertical-align:middle;" + "font-size:14px;";

class FormulaBox extends Component {
//  static defaultProps;

  constructor(props) {
    super(props);
  }

 render() {
    // let formulaHtml = this._renderFormula().join("");
    let errorStyle = null;
    if (this.props.errorMessage) {
      errorStyle = {border: "solid 1px #ff4d4d"};
    }
    return (
      
      <div className='box-Wrapper'>
        <ContentEditable
          style={errorStyle}
          ref="ContentEditable"
          // onBlur={(val) => this._onFormulaBlur(val)}
          // onChange={() => {}}
          // html={formulaHtml}
          />
        <FormulaToolbar
          onAddTagClick={this.props.onAddTagClick}
          onSymbolClick={(s) => this.props.onSymbolClick(s)}/>
        {this._getError()}
      </div>
    );
  }

   _getErrorStyle() {
    let defaultStyle = {
      color: "#f44336",
      fontSize: "12px",
      marginTop: "6px",
      position: "absolute",
    };

    return defaultStyle;
  }

   _getError() {
    if (this.props.errorMessage) {
      return (
        <div style={this._getErrorStyle()}>{this.props.errorMessage}</div>
      )
    }
    return null;
  }

   _renderFormula() {
    let formula = this.props.formula;
    let tagReg = regex.tag;
    let formulaArray = formula.split(new RegExp(tagReg)).filter((item) => item);
    let isError = false;
    let parts = formulaArray.map((part, index) => {
      if (part) {
        let isTag = part.match(tagReg) && part.match(tagReg).length > 0;
        if (isTag) {
          let id = part.replace("{ptag|", "").replace("{vtag|", "").replace("}", "");
          let tag = this._parseTag(parseInt(id, 10));
          let title = tag.get("Name").replace(/\s/g, "&nbsp;") + "&#10;" + "所属层级：" + tag.get("HierarchyName");
          let tagType = tag.get("Type") === 1 ? "ptag" : "vtag";
          // add tag
          let tagCorlor = "background-color:#e6e6e6; color:#666666;";
          if (this.props.calculationStep && this.props.calculationStep < TagConstants.switchValueToIndex(tag.get("CalculationStep"))) {
            tagCorlor = "background-color:#ff4d4d; color:#ffffff;";
            isError = true;
          }

          return `<div contentEditable="false" style=${tagCSS + tagCorlor} key=${id} type=${tagType} title=${title}>${tag.get("Name")}</div><div type="separator" key=${index} style=${lineCSS}></div>`;
        } else {
          // add calculation symbol and number
          return `<div style=${textCSS} key=${index} type="text">${part}</div>`;
        }
      }
    });


    // this.props.validataStep(isError);

    // add blank element in front and end
    parts.unshift(`<div style=${markCSS} key="first" type="text"></div>`);
    parts.push(`<div style=${markCSS} key="last" type="text"></div>`);

    return parts;
  }

  _onFormulaChange(value) {
    // let cursorIndex = this._getCursorIndex();

    // let el = document.createElement("div");
    // el.innerHTML = value;
    // let formula = this._parseFormulaHtml(el);
    // this.props.onFormulaChange(formula, cursorIndex);
  }

  _onFormulaBlur(value) {
    let cursorIndex = this._getCursorIndex();

    let el = document.createElement("div");
    el.innerHTML = value;
    let formula = this._parseFormulaHtml(el);
    this.props.onBlur(formula, cursorIndex);
  }

  _getCursorIndex() {// 获取计算公式中，光标所在位置
    let cursorIndex = 0;
    let textRange = window.getSelection().getRangeAt(0);
    let anchor = textRange.commonAncestorContainer;
    let elementNodeType = anchor.nodeType;
    // 判断锚点类型：1.元素element 2.attr属性 3.text文本 8.comments注释 9.document文档
    if (elementNodeType === 1 && anchor.getAttribute("key") === "first") {
      cursorIndex = 0;
      return cursorIndex;
    } else if (elementNodeType === 1 && anchor.getAttribute("key") === "last") {
      cursorIndex = this.props.formula.length;
      return cursorIndex;
    } else {
      let el = ReactDOM.findDOMNode(this.refs["ContentEditable"]);

      // 区分数据点和其他字符
      let formulaArray = [];
      for (let i = 0; i < el.children.length; i++) {
        let key = el.children[i].getAttribute("key");
        let type = el.children[i].getAttribute("type");
        if ((type === "text" || type === "separator") && key !== "first" && key !== "last") {
          formulaArray.push(el.children[i].innerText);
        } else if (type === "vtag") {
          formulaArray.push(`{vtag|${key}}`);
        } else if (type === "ptag") {
          formulaArray.push(`{ptag|${key}}`);
        }
      }

      // 获取当前光标所在元素，处于formulaArray的Index
      let index = 0;
      for (let i = 0; i < el.children.length; i++) {
        let key = el.children[i].getAttribute("key");
        let type = el.children[i].getAttribute("type");
        let targetKey;
        if (anchor.nodeType === 1) {
          targetKey = anchor.getAttribute("key");
        } else {
          targetKey = anchor.parentElement.getAttribute("key");
        }
        if (key === targetKey) {
          index = i - 1;
        }
      }

      // 计算当前光标所在元素，在计算公式中的位置
      formulaArray.map((item, i) => {
        if (i < index) {
          cursorIndex = cursorIndex + item.length;
        }
      });

      // 返回当前光标在计算公式中的位置
      return cursorIndex + textRange.startOffset;
    }
  }

  _parseTag(id) {
    return this.props.tags.find((item) => {
      return item.get("Id") === id;
    });
  }

  _parseFormulaHtml(el) {
    let newArr = [];
    for (let i = 0; i < el.children.length; i++) {
      newArr.push(el.children[i]);
    }
    let formula = newArr.map((item) => {
      if (item.getAttribute("type") === "ptag" || item.getAttribute("type") === "vtag") {
        return "{" + item.getAttribute("type") + "|" + item.getAttribute("key") + "}";
      } else if (item.getAttribute("type") === "text") {
        return item.innerText;
      } else if (item.getAttribute("type") === "separator") {
        return item.innerText;
      }
    }).join("");

    return formula;
  }

}

// FormulaBox.defaultProps = {
//   formula: "",
//   onAddTagClick: () => {},
//   onBlur: () => {},
//   onSymbolClick: () => {},
//   tags: Immutable.fromJS([]),
// };

export default FormulaBox