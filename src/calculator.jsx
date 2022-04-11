import React, { Component } from 'react'
import './calculator.css'
import Display from './display'
import Button from './button'
import keyboard_listener from './keyboard_listener.js';

const initialState = {

  displayValue: '0',
  clearDisplay: false,
  operation: null,
  prevOperation: null,
  values: [0,0],
  current: 0,

}

const kb_list = keyboard_listener(document);


export default class Calculator extends Component {

  state = { ...initialState}
  constructor(props){
    super(props);

    this.clearMemory = this.clearMemory.bind(this);
    this.setOperation = this.setOperation.bind(this);
    this.addDigit = this.addDigit.bind(this);
    this.calculatorChange = this.calculatorChange.bind(this);

    kb_list.subscribe(this.calculatorChange);

  }


  clearMemory(){
    this.setState({...initialState});
  }

  calculatorChange(key){

    let call;

    if(['1','2','3','4','5','6','7','8','9','0','.'].includes(key)){
      call = 'addDigit';

    } else if(['+','-','*','/','=','Enter'].includes(key)){
      call = 'setOperation';

    } else if(key === 'Escape'){
      call = 'clearMemory';
    }
    
    const method_map = { 
        'addDigit': this.addDigit,
        'setOperation': this.setOperation,
        'clearMemory': this.clearMemory
      
    };

    if(method_map[call]){
      method_map[call](key);
    }
  }

  setOperation(operation){
      const equals = operation === '=' || operation === 'Enter';

      this.setState({
        operation,
        prevOperation : equals ?  this.state.prevOperation : operation,
        current: 1, 
        clearDisplay: true
      });

      let currentOperation;

      if(equals || this.state.prevOperation === operation)
        currentOperation = this.state.prevOperation;
      
      else{
        currentOperation = operation;
        this.setState({clearDisplay: true});
        return;
      }
        
      if(equals){
        const values = [...this.state.values];

        try {
          const operations = {
            '+': function(a,b){
              return a+b;
            },
            '-': function(a,b){
              return a-b;
            },
            '/': function(a,b){
              return a/b;
            },
            '*': function(a,b){
              return a*b;
            }
  
          }
  
          values[0] = operations[currentOperation](values[0], values[1]);
          
          
        } catch (e) {
          values[0] = this.state.values[0];
        }
  
        //values[1] = 0
        
        this.setState({
          displayValue: values[0] % 1 === 0 ?  values[0] : values[0].toFixed(Math.abs(values[0].toString().length+1 - 11)),
          //operation: equals ? null : operation,
          operation: currentOperation,
          current: equals ? 0 : 1,
          clearDisplay: !equals,
          values
        })
      }
    
  }

  addDigit(n){

    if (n === '.' && this.state.displayValue.includes('.')) {
      return;
    }
    const clearDisplay = this.state.displayValue === '0' || this.state.clearDisplay;
    const currentValue = clearDisplay ? '' : this.state.displayValue;
    const displayValue = currentValue + n;
    
    if(displayValue.length > 10)
      return;

    this.setState({displayValue, clearDisplay:false})
 
    //if (n !== ".") {
      const i = this.state.current
      const newValue = parseFloat(displayValue)
      const values = [...this.state.values]
      values[i] = newValue;
      this.setState({values});
    //}

  }

  render() {

    return(
      <div className="calculator">

      <Display value={this.state.displayValue}/>

      <Button label='AC' click={this.clearMemory} triple/>
      <Button label='/' click={this.setOperation} operation/>
      <Button label='7' click={this.addDigit}/>
      <Button label='8' click={this.addDigit}/>
      <Button label='9' click={this.addDigit}/>
      <Button label='*' click={this.setOperation} operation/>
      <Button label='4' click={this.addDigit}/>
      <Button label='5' click={this.addDigit}/>
      <Button label='6' click={this.addDigit}/>
      <Button label='-' click={this.setOperation} operation/>
      <Button label='1' click={this.addDigit}/>
      <Button label='2' click={this.addDigit}/>
      <Button label='3' click={this.addDigit}/>
      <Button label='+' click={this.setOperation} operation/>
      <Button label='0' click={this.addDigit} double/>
      <Button label='.' click={this.addDigit} operation/>
      <Button label='=' click={this.setOperation} operation/>


      </div>
    )
  }
}
