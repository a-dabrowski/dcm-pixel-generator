import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

class Sites extends Component {
  state = {
    selected: false,
    selection: ""
    };
    handleChange(event) {
        this.setState({ selection: event.target.value });
        console.log(this.props);
        this.props.handleSelect(event);
  }  
  options = this.props.data;
  render() {
    return (
      <FormControl className={this.props.formControl}>
            <InputLabel htmlFor={this.props.labelName}>{this.props.name}</InputLabel>
        <Select name={this.props.name} value={this.state.selection} onChange={this.handleChange.bind(this)}>
         
            {/*onchange goes here -  */}
            {this.options.map(el => {
              return (
                <MenuItem key={el[1]} value={el[1]}>
                  {el[0]}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
    );
  }
}

export default Sites;
