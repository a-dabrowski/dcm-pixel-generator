import React, { Component } from "react";
import Sites from './Sites.jsx';
class Dcm extends Component {
  state = {
    logged: false,
    sites: []
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
        console.log("promisese resolved", this.gapi);
        this.gapi.auth2
          .getAuthInstance()
          .isSignedIn.listen(this.updateSigninStatus); //TODO: Create function updateSigninStatus or maybe  AUTHINSTANCE reutrns null
        this.setState({
          logged: this.gapi.auth2.getAuthInstance().isSignedIn.get()
        });
        //TODO: listeners for authorize and signout click
      });
  };

  getSites() {
    this.gapi.client
      .request({
        path: `https://www.googleapis.com/dfareporting/v3.1/userprofiles/${
          this.profieId
        }/sites?key=${this.apiKey}`
        //
        //   'params': {'key':apiKey,
        //  'maxResult': '1'}
      })
      .then(
        (res) => {
          const sites = res.result.sites.map(el => [
            el.name,
            el.id,
            el.accountId
            ]);
            console.log(this);  
          this.setState({ loaded: true, sites: sites });
        },
        function(reason) {
          console.log(reason);
          //return Error component
        }
      );
    }

  componentWillMount() {
    this.gapi.load("client:auth2", this.initClient);
  }

    componentDidMount() {
      
  }
  render() {
      return <div>
          <button onClick={this.getSites.bind(this)}>load sites</button> 
          {this.state.loaded ? <Sites sites={this.state.sites} /> : "false"}</div>;
  }
}

export default Dcm;
