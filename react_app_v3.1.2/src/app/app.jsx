import React, { Component } from 'react';
import {Login} from 'ui/components/login';
import {HomePage} from 'ui/components/home';
import AuthService from "api/authentication.service";
import './App.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        accesstoken_valid: undefined,
    };
  }


  componentDidMount() {
    AuthService.check_valid_token().then(
      response => {
        this.setState({
          accesstoken_valid:1,
        });
      },
      error => {
        AuthService.refresh_valid_token().then(
          response => {
            this.setState({ accesstoken_valid:1,});
          },
          error => {
            this.setState({ accesstoken_valid:0,});
          });
      });
  } 


  render() {
    const { accesstoken_valid } = this.state;
    let route;
    if (accesstoken_valid === undefined) {
      route = <div className='center'><img src="/logo.png" alt="image" height={70} width={300} /></div>
    } else if (!accesstoken_valid) {
      route = <Login />
    } else{
      route = <HomePage />
    }

    return (
      <div>
        {route}
      </div>
    );
  }
}

export {App};