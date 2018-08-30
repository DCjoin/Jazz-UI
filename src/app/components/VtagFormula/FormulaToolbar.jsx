'use strict';

import React, {Component} from 'react';
import { FontIcon } from 'material-ui';



class FormulaToolbar extends Component{
  

  _symbolClick(index) {
    const FormulaSymbols={
      NONE:'',
      PLUS: 0,
      MINUS: 1,
      MULTIPLY: 2,
      DIVIDE: 3,
      PARENTHESES: 4,
      MAX: 5,
      MIN: 6,
      properties: {
        0: {index: 0},
        1: {index: 1},
        2: {index: 2},
        3: {index: 3},
        4: {index: 4},
        5: {index: 5},
        6: {index: 6},
      }
    }
    let s = FormulaSymbols.NONE;
   /* switch(index){
      case 0:
        s = FormulaSymbols.PLUS;
        break;
      case 1:
        s = FormulaSymbols.MINUS;
        break;
      case 2:
        s = FormulaSymbols.MULTIPLY;
        break;
      case 3:
        s = FormulaSymbols.DIVIDE;
        break;
      case 4:
        s = FormulaSymbols.PARENTHESES;
        break;
      case 5:
        s = FormulaSymbols.MAX;
        break;
      case 6:
        s = FormulaSymbols.MIN;
        break;
      default:
        break;
    }*/

    this.props.onSymbolClick(s);

  }
  _renderSymbols() {
    let symbols = ["+", "-", "×", "÷","()","max()", "min()"];
    return symbols.map((item, index) => {
      let isLast = (index === symbols.length - 1);
      return (
        <div 
          className='Button'
          key={index} 
          last={isLast} 
          onClick={() => this._symbolClick(index)}>{item}</div>
      )
    })
  }
  render() {
    return (
      // 算符样式和事件
      <div className='bar-Wrapper'>
      {/* 数据点 
        <button>
            <FontIcon
              className="icon-add"
              color="#999"
              hoverColor="#2ecc71"
              style={{fontSize: "12px"}}
              onClick={this.props.onAddTagClick}>
                <InnerButton>数据点</InnerButton>
              </FontIcon>
          </button> */}
        <div className={'button-box'}>
          {
            this._renderSymbols()
          }
        </div>
      </div>
    )
  }  
}
export default FormulaToolbar;


