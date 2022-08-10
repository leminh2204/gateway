import React, { Component, useState, useRef, useEffect } from 'react';
import {FormControl, Form, Button, Modal, Spinner} from 'react-bootstrap';
import SettingService from "api/gateway-setting.service";
import ImageService from "api/image.service";
import {SelectPacsClient} from "./selectpacsclient";
import {SelectPacsCloud} from "./selectpacscloud";
import {SyncImage} from "./syncimage";
import Alert from 'react-bootstrap/Alert'
import './styles.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { SelectDate } from './selectdate';
import 'bootstrap-icons/font/bootstrap-icons.css';
import DatePicker from 'react-datepicker';
import Paper from '@material-ui/core/Paper';
import { Grid, Table, TableHeaderRow, TableSelection, } from '@devexpress/dx-react-grid-material-ui';
import { SelectionState } from '@devexpress/dx-react-grid';
import { render } from '@testing-library/react';

function CheckClientImage ()    {

  const [value, setValue] = useState('*');
  const [date_searchstart,setDateSearchStart] = useState(moment(new Date()).format('YYYYMMDD'));
  const [date_searchend,setDateSearchEnd] = useState(moment(new Date()).format('YYYYMMDD'));
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const pacsclientinfo = useRef([]);
  const pacscloudinfo = useRef([]);
  const patientinfoclient = useRef([]);
  const patientinfocloud = useRef([]);
  const pacsclientselect = useRef([]);
  const pacscloudselect = useRef([]);
  const [isSelectPacsClient,setIsSelectPacsClient] = useState(false);
  const [isSelectPacsCloud,setIsSelectPacsCloud] = useState(false);
  const [show,setShow] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const [pacsclient_selected,setPacsClientSelected] = useState([]);
  const [pacscloud_selected,setPacsCloudSelected] = useState([]);
  const [renderer,setRenderer] = useState(null);
  var casenumberclient = useRef();
  var casenumbercloud = useRef();
  const [isShowmissing,setIsShowmissing] = useState(false);
  const [patientmissing,setPatientmissing] = useState([]);
  const syncnode = useRef('cloud');
  const [pacscloudstatus,setPacscloudstatus] = useState(false);
  const [pacsclientstatus,setPacsclientstatus] = useState(false);
  var compare;
  



  const selectPacsClient = (pacsclient_selection) => {
    setPacsClientSelected(pacsclient_selection);
    setIsSelectPacsClient(false);
  }

  useEffect(() => {
    if (pacscloud_selected.length != 0 ) {
      ImageService.checkPacsNodeStatus(pacsclient_selected.ip_addr, pacsclient_selected.port, pacsclient_selected.ae_title)
        .then( response =>{
          setPacsclientstatus(response.data.status);
        }
        )
        .catch( error => {
          console.error(error);
        } 
        );
      }
  },[pacsclient_selected]);

  const selectPacsCloud = (pacscloud_selection) => {
    setPacsCloudSelected(pacscloud_selection);
    setIsSelectPacsCloud(false);
    console.log(pacscloud_selection);
  }


  useEffect(() => {
    if (pacscloud_selected.length != 0 ) {
      ImageService.checkPacsNodeStatus(pacscloud_selected.ip_addr, pacscloud_selected.port, pacscloud_selected.ae_title)
        .then( response =>{
          setPacscloudstatus(response.data.status);
        }
        )
        .catch( error => {
          console.error(error);
        } 
        );
    }
  },[pacscloud_selected]);

  const handleChangePatientID = (e) => {
    setValue(e.target.value);
  }

    // console.log(moment(startDate).format('YYYYMMDD'))
    // console.log(moment(endDate).format('YYYYMMDD'))
  
  const handleSelectDate = (e) => {  
    if ((startDate) === null) {
      switch(e.target.value){
        case 'Today':       setDateSearchStart(moment(new Date()).format('YYYYMMDD'));
                            break;
        case 'Yesterday':   setDateSearchStart(moment(new Date()).subtract(1, 'days').format('YYYYMMDD'));   
                            break;
        case 'Last week':   setDateSearchStart(moment(new Date()).subtract(7, 'days').format('YYYYMMDD')+'-'+moment(new Date()).format('YYYYMMDD'));
                            break;
        case 'Last month':  setDateSearchStart(moment(new Date()).subtract(30, 'days').format('YYYYMMDD')+'-'+moment(new Date()).format('YYYYMMDD'));
                            break;                  
        case 'All':         setDateSearchStart('*');   
                            break;
        }
      }
    else {
      setDateSearchStart(moment(startDate).format('YYYYMMDD'));
    }
  }
   
  const handleSelectPacsCloud = () => {
      SettingService.getSettingPACSCloud()
        .then( response =>{
          pacscloudinfo.current= response.data.results;
          setIsSelectPacsCloud(true);
        })
        .catch( error => {
          console.error(error);
        });
    }
  const handleSelectPacsClient = () => {
    SettingService.getSettingPACSClient()
      .then( response =>{
        pacsclientinfo.current= response.data.results 
        setIsSelectPacsClient(true)
      })
      .catch( error => {
        console.error(error);
      });
  }

  const handleClosePACSClient = () => {
    setIsSelectPacsClient(false);
  }
  const handleClosePACSCloud = () => {
    setIsSelectPacsCloud(false);
  }

  const handleCheckPacsNodeStatus = () => {
    SettingService.checkPacsNodeStatus()
      .then( response =>{
        console.log(response.data.results)
      }
      )
      .catch( error => {
        console.error(error);
      } 
      );
  }

  const handleShowmissing = (node) => {
    let missing;
    switch(node){
      case 'clientmissing':
        missing = patientinfocloud.current.filter(({ study_instanceuid: id1 }) => !patientinfoclient.current.some(({ study_instanceuid: id2 }) => id2 === id1));
        setPatientmissing(missing);
        setIsShowmissing(!isShowmissing);
        syncnode.current = 'client';
        break;
      case 'cloudmissing':
        missing = patientinfoclient.current.filter(({ study_instanceuid: id1 }) => !patientinfocloud.current.some(({ study_instanceuid: id2 }) => id2 === id1));
        setPatientmissing(missing);
        setIsShowmissing(!isShowmissing);
        syncnode.current = 'cloud';        
        break;
    }  

  }
  async function handleCheckImage() {
    patientinfoclient.current = [];
    patientinfocloud.current = [];
    casenumberclient.current = [];
    casenumbercloud.current = [];
    compare = 0;
    setShow(false);
    setIsShowmissing(false);
    setIsLoading(true);
    const patient_id = value;
    let study_date;
    if ((startDate) === null) {
      study_date=date_searchstart;
    }
    else if((startDate) !== null && (endDate) !== null){
      study_date=moment(startDate).format('YYYYMMDD')+'-'+moment(endDate).format('YYYYMMDD');
    }
    else { study_date=(moment(startDate).format('YYYYMMDD')); }

    await Promise.all([
      ImageService.findImageonPACSClient(patient_id, pacsclient_selected, study_date)
            .then( response => {
              patientinfoclient.current = response.data.patient;
              pacsclientselect.current= pacsclient_selected;
              casenumberclient.current = response.data.patient.length
            })
            .catch(error => {
              patientinfoclient.current = [''];
              casenumberclient.current = 0;
              pacsclientselect.current= pacsclient_selected;
              console.error("ERROR: Could not get patient infor");
            }),
      ImageService.findImageonPACSCloud(patient_id, pacscloud_selected, study_date)
            .then( response => {
              patientinfocloud.current =response.data.patient;
              pacscloudselect.current= pacscloud_selected;
              casenumbercloud.current = response.data.patient.length;
            })
            .catch(error => {
              patientinfocloud.current = [''];
              casenumbercloud.current= 0;
              pacscloudselect.current= pacscloud_selected;
              console.error("ERROR: Could not get patient infor");
            })
          ])
    setIsLoading(false);
    compare = casenumberclient.current - casenumbercloud.current;
    if(compare > 0) {
      setRenderer (
                    <Alert variant="danger"> 
                    <Alert.Heading>{compare} cases missing on Cloud </Alert.Heading>
                    <p> On Cloud: {casenumbercloud.current} </p>
                    <p> On Client: {casenumberclient.current} </p>
                    <div className="d-flex justify-content-end">
                      <Button variant="outline-danger" onClick = {() => handleShowmissing('cloudmissing')}>
                        Show
                      </Button>
                    </div> 
                  </Alert>)
                  
    }
    else if(compare === 0) {
      setRenderer (<Alert variant="success"> 
                    <Alert.Heading> OK </Alert.Heading>
                    <p> Dicom image is up to date! </p>
                    <p> On Cloud: {casenumbercloud.current} </p>
                    <p> On Client: {casenumberclient.current} </p> 
                  </Alert>)
        
    }
    else {
      let compare2 = 0 - compare;
      setRenderer(<Alert variant="danger"> 
                    <Alert.Heading>{compare2} cases on Client </Alert.Heading>
                    <p> On Cloud: {casenumbercloud.current} </p>
                    <p> On Client: {casenumberclient.current} </p>
                    <div className="d-flex justify-content-end">
                      <Button variant="outline-danger" onClick = {() => handleShowmissing('clientmissing')}>
                        Show
                      </Button>
                    </div> 
                  </Alert>)
      
    }
    setShow(true);
      
  }
  return (
    <div>
      <div >
        <table>
          <tbody>
            <tr>
              <td>
                <span>Patient ID </span>
                <input type="text" placeholder="Patient ID" onChange={handleChangePatientID}/>
              </td>
              <td>
                <span>Study Date (From) </span>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={new Date()}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/dd/yyyy"
                />
              </td>
              <td>
                <span>Study Date (To) </span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  maxDate={new Date()}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/dd/yyyy"
                />
              </td>
            </tr>
            <tr>
              <td>
                <span>Time: </span>  
                <select name="time" id="time" onChange={handleSelectDate}>
                  <option defaultValue value="Today">Today</option>
                  <option value="Yesterday">Yesterday</option>
                  <option value="Last week">Last week</option>
                  <option value="Last month">Last month</option>
                  <option value="All">All</option>
                </select>
              </td>
              <td>
                <span>Modality </span>
                <select name="modality" id="modality">
                  <option defaultValue value="All">All</option>
                  <option value="DX">DX</option>
                  <option value="MR">MR</option>
                  <option value="CT">CT</option> 
                </select>
              </td>
              <td>
                <Button  variant="primary" ><i className="bi bi-arrow-counterclockwise"></i> Reset</Button>
              </td>
            </tr>
          </tbody>
        </table>
        <br/>
        <table style={{width:"50%",textAlign: "center"}}>
          <tbody>
            <tr>
              <td>
                <h5>PACSCLIENT</h5>
              </td>
              <td>
                <h5>PACSCLOUD</h5>
              </td>
              <td>
                <Button disabled={ pacsclient_selected.id !== undefined && pacscloud_selected.id !== undefined ? false : true} variant="primary" onClick={handleCheckImage} >Check</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Button  variant="primary" onClick={handleSelectPacsClient}>Select PacsClient</Button>
                {pacsclient_selected.id !== [] && pacsclient_selected.id !== undefined && pacsclientstatus ? <i className="bi bi-check" style={{marginLeft: "20px", backgroundColor:"Lime"}}>{pacsclient_selected.ip_addr}</i> : null}
                {pacsclient_selected.id !== [] && pacsclient_selected.id !== undefined && !pacsclientstatus ? <i className="bi bi-x" style={{marginLeft: "20px", backgroundColor:"Red"}}>{pacsclient_selected.ip_addr}</i>: null}
              </td>
              <td>
                <Button  variant="primary" onClick={handleSelectPacsCloud}>Select PacsCloud</Button>
                {pacscloud_selected.id !== [] && pacscloud_selected.id !== undefined && pacscloudstatus ? <i className="bi bi-check" style={{marginLeft: "20px", backgroundColor:"Lime"}}>{pacscloud_selected.ip_addr}</i> : null}
                {pacscloud_selected.id !== [] && pacscloud_selected.id !== undefined && !pacscloudstatus ? <i className="bi bi-x" style={{marginLeft: "20px", backgroundColor:"Red"}}>{pacscloud_selected.ip_addr}</i> : null}

              </td>
            </tr>
          </tbody>        
        </table>
        <br/>
        {show ? renderer : null}
      </div>
      <Modal className="modal-loading" show={isLoading ? true : false}>
            <Spinner className="spinner" size='md' animation="border" variant="light" />
      </Modal>
      {isSelectPacsClient ? <SelectPacsClient handleClosePACSClient={handleClosePACSClient} 
                                              pacsclientinfo={pacsclientinfo.current} 
                                              selectPacsClient={selectPacsClient}/> : null }
      {isSelectPacsCloud ? <SelectPacsCloud handleClosePACSCloud={handleClosePACSCloud} 
                                            pacscloudinfo={pacscloudinfo.current} 
                                            selectPacsCloud={selectPacsCloud}
                                             /> : null }

      {isShowmissing ? patientmissing.map(object => <SyncImage  key={object.patient_instanceuid}
                                                                patientinfo={object} 
                                                                pacscloudselect={pacscloudselect.current}
                                                                prevpacsclient={pacsclientselect.current}
                                                                patientinfolength={patientmissing.length}
                                                                patientmissing={patientmissing}
                                                                missingremains={compare}
                                                                node={syncnode.current}/>) : null}
      
    </div>
  );

}

export {CheckClientImage};