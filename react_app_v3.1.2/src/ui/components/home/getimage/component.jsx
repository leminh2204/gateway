import React, { Component } from 'react';
import {FormControl, Form, Button, Modal, Spinner} from 'react-bootstrap';
import SettingService from "api/gateway-setting.service";
import ImageService from "api/image.service";
import {PatientInfo} from "./patientinfo";
import {SelectPacscloud} from "./selectpacscloud";
import './styles.css';



class GetImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelect: false,
      isLoading: false,
      value:'',
      patientinfo: [],
      pacscloudinfo:[],
      pacscloudselect: false,
      casenumbercloud: '',
    };
    this.findImageonPACSCloud = this.findImageonPACSCloud.bind(this);
    this.updateInput = this.updateInput.bind(this);
  };

  findImageonPACSCloud = pacscloud_selection => {
    this.setState({ isLoading: true,
                    isSelect: false });
    const patient_id= this.state.value;
    ImageService.findImageonPACSCloud(patient_id, pacscloud_selection)
      .then( response => {
        this.setState({ patientinfo: response.data.patient, 
                        isLoading: false,
                        pacscloudselect:  pacscloud_selection,
                        casenumbercloud: response.data.patient.length
                      });
      })
      .catch(error => {
          this.setState({ patientinfo: [''], isLoading: false  });
          console.error("ERROR: Could not get patient infor");
      });
  }
  updateInput(evt){
    const value = evt.target.value;
    this.setState({ value });
  }


  handleSelectPACSCloud = () => {
    this.setState({ isSelect: true });
    SettingService.getSettingPACSCloud()
      .then( response =>{
        this.setState({ pacscloudinfo: response.data.results });
      })
      .catch( error => {
        console.error(error);
      });
  }

  handleClosePACSCloud = () => {
    this.setState({ isSelect: false });
  }

  render() {
    return (
        <div>
          <div className="content-top">
          <h1>Search DICOM Image in PACSCLOUD</h1>
            <Form inline>
              <FormControl type="text" placeholder="Search Image on PACSCloud (PatinentId)" className="mr-sm-2 " onChange={ this.updateInput } />
              <Button onClick={this.handleSelectPACSCloud} variant="outline-primary"  > Search </Button>
            </Form>
          </div>
          <Modal className="modal-loading" show={this.state.isLoading ? true : false}>
            <Spinner className="spinner" size='md' animation="border" variant="light" />
          </Modal>
          <br/>
          {this.state.casenumbercloud ? <h5>Number of cases: {this.state.casenumbercloud} </h5> : null  }
          
          {this.state.patientinfo ? this.state.patientinfo.map(object => <PatientInfo   key={object.patient_id} 
                                                                                        patientinfo={object} 
                                                                                        pacscloudselect={this.state.pacscloudselect} />) : null}
          {this.state.isSelect ? <SelectPacscloud handleClosePACSCloud={this.handleClosePACSCloud} 
                                                  pacscloudinfo={this.state.pacscloudinfo} 
                                                  findImageonPACSCloud={this.findImageonPACSCloud}/> : null }
        </div>     
    );
  }
}
export {GetImage};
