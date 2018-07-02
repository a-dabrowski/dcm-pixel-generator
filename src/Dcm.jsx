import React, { Component } from "react";
import OptionList from "./OptionList.jsx";
import Loading from "./Loading.jsx";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    //    flex
    width: "100%",
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
  initClient = () => {
    this.gapi.client
      .init({
        apiKey: this.apiKey,
        clientId: this.clientId,
        scope: this.scopes
      })
      .then(() => {
        this.gapi.auth2
          .getAuthInstance()
          .isSignedIn.listen(this.updateSigninStatus); //TODO: Create function updateSigninStatus or maybe  AUTHINSTANCE reutrns null
        this.setState({
          logged: this.gapi.auth2.getAuthInstance().isSignedIn.get()
        });
        //TODO: listeners for authorize and signout click
      })
      .then(() => {
        this.getAdvertisers();
      });
  };

  getAdvertisers() {
    this.gapi.client
      .request({
        path: `https://www.googleapis.com/dfareporting/v3.1/userprofiles/${
          this.profieId
        }/advertisers?key=${this.apiKey}`
      })
      .then(
        res => {
          const advertisers = res.result.advertisers.map(el => [
            el.name,
            el.id,
            el.accountId
          ]);
          this.setState({ loaded: true, advertisers: advertisers });
        },
        function(reason) {
          console.log(reason);
          //return Error component
        }
      );
  }
  getSites() {
    this.gapi.client
      .request({
        path: `https://www.googleapis.com/dfareporting/v3.1/userprofiles/${
          this.profieId
        }/sites?key=${this.apiKey}`
      })
      .then(
        res => {
          const sites = res.result.sites.map(el => [
            el.name,
            el.id,
            el.accountId
          ]);
          this.setState({ sites: sites });
        },
        function(reason) {
          console.log(reason);
        }
      );
  }

  getCampaigns(advertiserId) {
    console.log(advertiserId);
    this.gapi.client
      .request({
        path: `https://www.googleapis.com/dfareporting/v3.1/userprofiles/${
          this.profieId
        }/campaigns?advertiserIds=${advertiserId}&key=${this.apiKey}`
      })
      .then(res =>
        this.setState({
          campaigns: res.result.campaigns.map(el => [el.name, el.id])
        })
      )
      .then(_ => console.log(this.state.campaigns));
  }

  getAds(advertiserId, campaignId) {
    console.log(advertiserId, campaignId);
    this.gapi.client
      .request({
        path: `https://www.googleapis.com/dfareporting/v3.1/userprofiles/${
          this.profieId
        }/ads?advertiserIds=${advertiserId}&campaignIds=${campaignId}&key=${
          this.apiKey
        }`
      })
      .then(res => {
        this.setState({
          ads: res.result.ads.map(el => [
            el.name,
            el.id,
            el.placementAssigments,
            el.creativeRotation.creativeAssignments
          ])
        });
      });
  }

  handleSelect(event) {
    this.setState({
      selectedAdvertiser: event.target.value
    });
    console.log("dcm", this.state.selectedAdvertiser);
    this.getSites();
    this.getCampaigns(event.target.value); // doesnt change rendered campaigns
  }

  handleSiteSelect = event => {
    this.setState({ selectedSites: event.target.value });
  };
  handleStart = () => {
    this.gapi.load("client:auth2", this.initClient);
  };

  handleCampaignSelect = event => {
    this.setState({ selectedCampaign: event.target.value });
  };

  handleSend = () => {
        this.getAds(this.state.selectedAdvertiser, this.state.selectedCampaign);
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.handleStart}
        >
          Start Authorize
        </Button>
        <form className={classes.root} autoComplete="off">
          {/* <button onClick={this.getAdvertisers.bind(this)}>Advertisers</button> */}
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
            "First select Advertiser"
          )}
          {this.state.campaigns ? (
            <OptionList
              className={classes.formControl}
              name="Campaign"
              data={this.state.campaigns}
              handleSelect={this.handleCampaignSelect}
            />
          ) : (
            "Select Advertiser"
          )}
        </form>
        <Button color="primary" variant="contained" onClick={this.handleSend}>send to dcm</Button>
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
                    <ListItemText primary={el[0]} />
                  </ListItem>
                );
              })}
            </List>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Dcm);
