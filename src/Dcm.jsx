import React, { Component } from "react";
import OptionList from "./OptionList.jsx";
import Loading from "./Loading.jsx";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import * as api from "./api.js";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    width: "75%",
    margin: "auto",
    justifyContent: "space-around"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200
  }
});

class Dcm extends Component {
  state = {
    logged: false,
    advertisers: null,
    sites: null,
    campaigns: null,
    selectedAdvertiser: null,
    selectedCampaign: null,
    selectedSites: null
  };
  gapi = window.gapi;
  profieId = process.env.REACT_APP_PROFILE;
  apiKey = process.env.REACT_APP_API_KEY;
  clientId = process.env.REACT_APP_CLIENT_ID;
  scopes =
    "https://www.googleapis.com/auth/dfareporting https://www.googleapis.com/auth/dfatrafficking";

  handleSelect(event) {
    this.setState({
      selectedAdvertiser: event.target.value
    });
    api.getSites.call(this);
    api.getCampaigns.call(this, event.target.value); // doesnt change rendered campaigns
  }

  handleSiteSelect = event => {
    this.setState({ selectedSites: event.target.value });
  };
  handleStart = () => {
    this.gapi.load("client:auth2", api.initClient.bind(this));
  };

  handleCampaignSelect = event => {
    this.setState({ selectedCampaign: event.target.value });
  };

  handleSend = () => {
    api.getAds.call(
      this,
      this.state.selectedAdvertiser,
      this.state.selectedCampaign
    );
  };

  handleSendCreatives = () => {
    api.getCreatives.call(
      this,
      this.state.selectedAdvertiser,
      this.state.selectedCampaign,
      this.state.selectedSites
    );
  };
  handleSendPlacements = () => {
    api.getPlacements.call(
      this,
      this.state.selectedAdvertiser,
      this.state.selectedCampaign,
      this.state.selectedSites
    );
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          disabled={this.state.logged}
          className={classes.button}
          onClick={this.handleStart}
        >
          Start Authorize
        </Button>

        <form className={classes.root} autoComplete="off">
          {this.state.advertisers ? (
            <OptionList
              className={classes.formControl}
              name="Advertiser"
              data={this.state.advertisers}
              handleSelect={this.handleSelect.bind(this)}
            />
          ) : (
            <Loading />
          )}
          {this.state.sites ? (
            <OptionList
              className={classes.formControl}
              name="Site"
              data={this.state.sites}
              handleSelect={this.handleSiteSelect}
            />
          ) : (
            ""
          )}
          {this.state.campaigns ? (
            <OptionList
              className={classes.formControl}
              name="Campaign"
              data={this.state.campaigns}
              handleSelect={this.handleCampaignSelect}
            />
          ) : (
            ""
          )}
        </form>
        <Button
          color="primary"
          variant="contained"
          disabled={
            !(this.state.selectedAdvertiser && this.state.selectedCampaign)
          }
          onClick={this.handleSend}
        >
          send to dcm get ads
        </Button>
        <Button
          color="primary"
          variant="contained"
          disabled={
            !(this.state.selectedAdvertiser && this.state.selectedCampaign)
          }
          onClick={this.handleSendCreatives}
        >
          send to dcm get creatives
        </Button>
        <Button
          color="primary"
          variant="contained"
          disabled={
            !(this.state.selectedAdvertiser && this.state.selectedCampaign)
          }
          onClick={this.handleSendPlacements}
        >
          send to dcm placements
        </Button>
        <div>
          <h1>
            {this.state.selectedAdvertiser || "Placeholder for Advertiser"}
          </h1>
          <h2>{this.state.selectedSites || "Placeholder for Sites"}</h2>
          <h3>{this.state.selectedCampaign || "Placeholder for Campaign"}</h3>

          {this.state.ads ? (
            <List>
              {this.state.ads.map(el => {
                return (
                  <ListItem>
                    <ListItemText primary={el.name} />
                  </ListItem>
                );
              })}
            </List>
          ) : (
            ""
          )}
          {this.state.placements ? (
            <List>
              {this.state.placements.map(el => {
                return (
                  <ListItem>
                    <ListItemText primary={el.name} />
                  </ListItem>
                );
              })}
            </List>
          ) : (
            ""
          )}
          {this.state.creatives ? (
            <List>
              {this.state.creatives.map(el => {
                return (
                  <ListItem>
                    <ListItemText primary={el.name} />
                  </ListItem>
                );
              })}
            </List>
          ) : (
            ""
          )}
        </div>
        {this.state.ads ? (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Site</TableCell>
                  <TableCell>Placement</TableCell>
                  <TableCell>Ad</TableCell>
                  <TableCell>Creative</TableCell>
                  <TableCell>TITAN Display</TableCell>
                  <TableCell>TITAN Video</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.ads.map(el => {
                  console.log(this.state.creatives.find(n=> n.id == el.creatives))
                  return (
                    <TableRow key="1">
                      <TableCell>Site</TableCell>
                      <TableCell>{this.state.placements.find(n=> n.id===el.placements).name}</TableCell>
                      <TableCell>{el.name}</TableCell>
                      <TableCell>ads</TableCell>
                      <TableCell>TITAN {el.placements} {el.creatives}</TableCell>
                      <TableCell>VIDEO</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Dcm);
