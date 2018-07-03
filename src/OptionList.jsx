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

class OptionList extends Component {
  state = {
    selected: false,
    selection: ""
  };
  handleChange(event) {
    this.setState({ selection: event.target.value });
    console.log(this.props);
    this.props.handleSelect(event);
  }
  render() {
    const options = this.props.data;
    return (
      <FormControl className={this.props.className}>
        <InputLabel htmlFor={this.props.labelName}>
          {this.props.name}
        </InputLabel>
        <Select
          name={this.props.name}
          value={this.state.selection}
          onChange={this.handleChange.bind(this)}
        >
          {options.map(el => {
            return (
              <MenuItem key={el.id} value={el.id}>
                {el.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  }
}

export default OptionList;
