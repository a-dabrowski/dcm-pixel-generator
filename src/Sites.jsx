import React, { Component } from 'react';


class Sites extends Component {
    state = {
        selected: false, 
        selection: ''    
    }
   options = this.props.sites;
    render() {
      console.log(this.options)
        return (<select name="Sites">
            {this.options.map((el) => {
                return <option value={el[1]}>{el[0]}</option>
            })}
        </select>);
    }
}

export default Sites;