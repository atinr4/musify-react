
import React, { Component } from "react";
import { authEndpoint, clientId, redirectUri, scopes, apiBaseUrl } from "../config";
import hash from "../hash";
import logo from "../logo.png";

import {
  BrowserRouter as Router,
  Redirect
} from "react-router-dom";

class Home extends Component {
  constructor() {

    super();
    this.state = {
      token: null,
      user_data: []
    }
  }


  render() {
    return (
      <div className="App">
        {!this.state.token && (
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <a
              className="spotify-btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login with Spotify
              </a>
          </header>
        )}

      </div>
    );
  }
}

export default Home;