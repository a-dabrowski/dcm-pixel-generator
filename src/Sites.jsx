import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class Sites extends Component {

    state = {
        selected: false, 
        selection: ''    
    }
   options = this.props.data;
    render() {
        return (<select name="Sites" onChange={this.props.handleSelect}>{/*onchange goes here -  */}
            {this.options.map((el) => {
                return <option key={el[1]} value={el[1]}>{el[0]}</option>
            })}
        </select>);
    }
}

export default Sites;