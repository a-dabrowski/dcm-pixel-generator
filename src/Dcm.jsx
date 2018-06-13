import React, {
    Component
} from 'react';
//import './gapi.js';

class Dcm extends Component {
    state = {
        loaded: false
    }
    gapi = window.gapi
    apiKey = process.env.REACT_APP_API_KEY;
    clientId = process.env.REACT_APP_CLIENT_ID;
    scopes = 'https://www.googleapis.com/auth/dfareporting https://www.googleapis.com/auth/dfatrafficking';
    initClient = () => {
        //GAPI jest i jest aktywne
        console.log('inside init Client ', this.apiKey); //BAD REQUEST
        this.gapi.client.init({
            apiKey: this.apiKey,
            clientId: this.clientId,
            scope: this.scopes
        }).then(() => {
            console.log('promisese resolved', this.gapi);
            this.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);//TODO: Create function updateSigninStatus or maybe  AUTHINSTANCE reutrns null
            this.setState({ loaded: this.gapi.auth2.getAuthInstance().isSignedIn.get() });
            //TODO: listeners for authorize and signout click
            //FIX
this.gapi.client.request({
          'path': 'https://www.googleapis.com/dfareporting/v3.1/userprofiles/2464743/sites?key=AIzaSyD9gwpTFJLSxSCITnUdb6afrNeSEDsKLcU'//,
       //   'params': {'key':apiKey,
        //  'maxResult': '1'}
        }).then(function(res){
          console.log(res);
          console.log('test');
          const sites = res.result.sites.map(el => `${el.name}|${el.id}|${el.accountId}`);
          console.log(sites);
          const p = document.createElement('code');
          const t = document.createTextNode(sites.join(';'));
          p.appendChild(t);
          return document.body.appendChild(p);
        }, function(reson){
          console.log(reson);
        });
        });
    }



    componentDidMount() {
        this.gapi.load('client:auth2', this.initClient);
    }
    render() {
        return (
            <div>
                {this.state.loaded ? true:false}
            </div>
        );
    }
}

export default Dcm;