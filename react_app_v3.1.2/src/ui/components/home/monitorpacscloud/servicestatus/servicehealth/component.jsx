import React, { Component } from 'react';
import ImageService from "api/image.service";
import {Alert} from 'react-bootstrap';
import { FaCheckCircle, FaCircleNotch, FaDizzy } from 'react-icons/fa';


class PACSCloudServiceHealth extends Component {

  constructor(props) {
    super(props);
    this.state = {
      health: 0,
    };
  };

  componentDidMount() {
    this.findImageonPACSCloud();
  }

  findImageonPACSCloud = () => {
    // ImageService.findImageonPACSCloud("396-5779129-1 N")
    //   .then( response => {
    //     this.setState({ health: 1});
    //   })
    //   .catch(error => {
    //       this.setState({ health: -1});
    //       console.error("ERROR: Service down");
    //   });
    this.setState({ health: 1})
  }


  render() {
    let notice='';
    let status = this.state.health;
    if(status === 0){
      notice = <Alert variant="primary">
                  <Alert.Heading>PACSCLoud service status checking <FaCircleNotch color="DodgerBlue" fontSize="1.2em" /> </Alert.Heading>
                </Alert>;
    } else if (status === -1){
      notice = <Alert variant="danger">
                  <Alert.Heading>PACSCLoud service status Fail <FaDizzy color="red" fontSize="1.2em" /> </Alert.Heading>
                </Alert>;
    } else{
      notice =  <Alert variant="success">
                  <Alert.Heading>PACSCLoud service status active <FaCheckCircle color="green" fontSize="1.2em" /> </Alert.Heading>
                </Alert>;
    }
    return (
          <div className="content-top">
              {notice}
          </div>           
    );
  }
}

export {PACSCloudServiceHealth};