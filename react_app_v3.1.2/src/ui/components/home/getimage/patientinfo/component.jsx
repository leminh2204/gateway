import React, { Component } from 'react';
import {Row, Col} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import "./styles.css"
import { SelectPACSClient } from './selectpacsclient';
import ImageService from "api/image.service";
import SettingService from "api/gateway-setting.service";

class  PatientInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelect: false,
      isLoading: false,
      pacsclientinfo: [],
      patientinfo:this.props.patientinfo,
    };
    this.downloadData=this.downloadData.bind(this);
    this.handleSelectPACSClient=this.handleSelectPACSClient.bind(this);
    this.handleClosePACSClient=this.handleClosePACSClient.bind(this);
  };

  componentDidUpdate(prevProps) {
    if(prevProps.patientinfo !== this.props.patientinfo) {
      this.setState({patientinfo: this.props.patientinfo});
    }
  }

  handleSelectPACSClient = () => {
    this.setState({ isSelect: true });
    SettingService.getSettingPACSClient()
      .then( response =>{
        this.setState({ pacsclientinfo: response.data.results });
      })
      .catch( error => {
        console.error(error);
      });
  }

  handleClosePACSClient = () => {
    this.setState({ isSelect: false });
  } 

  downloadData = (pacsclient_selection) =>{
    this.setState({ isLoading: true, 
                    isSelect: false
                  });
    ImageService.downloadImageonPACSCloud(this.state.patientinfo.patient_id, 
                                          this.state.patientinfo.study_instanceuid, 
                                          this.state.patientinfo.modalities,
                                          this.state.patientinfo.image_count,
                                          this.props.pacscloudselect,
                                          pacsclient_selection.id,
                                          this.props.pacscloudselect.id)
      .then( response => {
        this.setState({ isLoading: false });
        let url=(window.location.href).replace('getimage','viewdata');     
        window.open(url, '_blank');
      })
      .catch( error => {
        this.setState({ isLoading: false });
        console.error(error);
      });
  }


  render() {
    return (
      <div className="content-panel">
          {this.state.patientinfo ? 
            Object.keys(this.state.patientinfo).map( (key)=> 
            <div>
              <Row><Col>{key.toUpperCase()}:</Col><Col>{this.state.patientinfo[key]}</Col></Row>
            </div>): 
            <h5>IMAGE NOT FOUND ON THIS PACSCLOUD!!!</h5>
         }
         {this.state.patientinfo ? <Button onClick={this.handleSelectPACSClient} variant="dark">Continue</Button> : null}

         {this.state.isSelect ? <SelectPACSClient pacsclientinfo={this.state.pacsclientinfo}
                                                  handleClosePACSClient={this.handleClosePACSClient}
                                                  downloadData={this.downloadData} /> : null}                                               
      </div>
    );
  }
}

export {PatientInfo};
