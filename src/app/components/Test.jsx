import { createStore } from 'redux'
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux'

const counter=(state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

const store = createStore(counter);

store.subscribe(()=>{
  console.log(store.getState())
})

class Counter extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    onIncrement: PropTypes.func.isRequired,
    onDecrement: PropTypes.func.isRequired
  }

  incrementIfOdd = () => {
    if (this.props.value % 2 !== 0) {
      this.props.onIncrement()
    }
  }

  incrementAsync = () => {
    setTimeout(this.props.onIncrement, 1000)
  }

  render() {
    let { value,  dispatch } = this.props
    return (
      <p>
        Clicked: {value} times
        {' '}
        <button onClick={() => dispatch({ type: 'INCREMENT' })}>
          +
        </button>
        {' '}
        <button onClick={() => dispatch({ type: 'DECREMENT' })}>
          -
        </button>
        {' '}
        <button onClick={this.incrementIfOdd}>
          Increment if odd
        </button>
        {' '}
        <button onClick={this.incrementAsync}>
          Increment async
        </button>
      </p>
    )
  }
}

let Counter1 = connect((state)=>{
  return {
    value: state
  }
})(Counter);

export default class Test extends Component {
  render(){
    return(
      <Provider store={store}>
        <Counter1  />
      </Provider>
    )
  }
}
