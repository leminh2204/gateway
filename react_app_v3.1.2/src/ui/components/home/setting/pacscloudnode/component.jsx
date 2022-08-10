import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { SortingState, SelectionState, IntegratedSelection} from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableSelection, } from '@devexpress/dx-react-grid-material-ui';
import SettingService from "api/gateway-setting.service";
import {Button, Form, Modal} from 'react-bootstrap';
import axios from 'axios';
import authHeader from 'api/auth-header';
const API_URL = process.env.REACT_APP_IMAGE_URL;

function PacscloudNode(props) {

  const [pacscloudinfo, setPacscloudinfo] = useState([]);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    SettingService.getSettingPACSCloud()
      .then( response =>{
        setPacscloudinfo(response.data.results);
      })
      .catch( error => {
        console.error(error);
      });


  }, []);

  const columns = [
      { name: 'id', title: 'ID' },
      { name: 'hospital_name', title: 'Hospital Name' },
      { name: 'hospital_code', title: 'Hospital Code' },
      { name: 'region', title: 'Region'}
    ];

  const data = {pacscloudinfo};
  const rows = data.pacscloudinfo;
  console.log(pacscloudinfo);

  const [buttoncontent, setButtoncontent] = useState([]);
  const [modalContent, setModalContent] = useState({          
          "ip_addr": "",
          "ae_title": "",
          "port":"",
          "hospital_code": "",
          "hospital_name": "",
          "decription": "",
          "region": ""
        });

  const inputchange = (e) => {
    let jsondata = modalContent;
    let keys = e.target.name;
    jsondata[keys] = e.target.value;
    setModalContent(jsondata);
    modalContent.port = parseInt(modalContent.port,10);
    };

  const [id_data, setId_data] = useState([]);


  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    SettingService.getSettingPACSCloud()
      .then( response =>{
        setPacscloudinfo(response.data.results);
      })
      .catch( error => {
        console.error(error);
      });


  }, []);

  const [selection, setSelection] = useState([]);
  const [show, setShow] = useState(false);
  const [modaledit, setModaledit] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (content) => {
    setButtoncontent(content);
    setShow(true);
  }; 

  const handleSelectionChange = (selection) => {
      //const index = selection.slice(-1)[0];
      let data_client= [];
      for (var i = 0; i < selection.length; i++) {
        let data_tmp = rows[selection[i]];
        data_client = data_client.concat(data_tmp);   
        if (data_client[i]?.id !== undefined) {
        setId_data(data_client[i].id);
        }
      }
      setSelection(selection);
  };

  const handleCreatePacscloud = (e) => {
    setShow(false);
    axios.post(API_URL + 'setting/pacscloud/',
      modalContent
    , 
    { 
      headers: authHeader() 
    }
    )
    .then (response => 
          {
            console.log('Post data...', response);
            SettingService.getSettingPACSCloud()
              .then( response =>{
                setPacscloudinfo(response.data.results);
              })
          })
    .catch(error => console.log(error));
  }


  const handleDeletePacscloud = (e) => {
    axios.delete(API_URL + 'setting/pacscloud/' + id_data + '/',
    { 
      headers: authHeader() 
    }
    )
    .then (response => 
          {
            console.log('Delete data...', response);
            SettingService.getSettingPACSCloud()
              .then( response =>{
                setPacscloudinfo(response.data.results);
              })
          })
    .catch(error => console.log(error));
  }

  const handleEditPacscloud = (e) => {
    setShow(false);
    axios.patch(API_URL + 'setting/pacscloud/'+ id_data + '/',
      modalContent
    , 
    { 
      headers: authHeader() 
    }
    )
    .then (response => 
          {
            console.log('Edit data...', response);
            SettingService.getSettingPACSCloud()
              .then( response =>{
                setPacscloudinfo(response.data.results);
              })
          })
    .catch(error => console.log(error));
  }

  return (
      <div className="content-top">
      <h1>PACSCloud Node</h1>
            { rows.length ? 
            <Paper>
            <span>
              Total rows selected:
              {' '}
              {selection.length}
            </span>
              <Grid
                rows={rows}
                columns={columns}
              >
                <SortingState
                  defaultSorting={[{ columnName: "id", direction: 'asc' }]}
                />
                <SelectionState
                selection={selection}
                onSelectionChange={handleSelectionChange}
                 />
                <IntegratedSelection />
                <Table />
                <TableHeaderRow 
                showSortingControls
                />
                <TableSelection
                  selectByRowClick
                  showSelectAll
                  />
              </Grid>
            </Paper> : <div></div>
            }
         

         <div>
          <Button variant="primary" className="btn btn-primary mr-1" onClick={() => {handleShow(["Add new node",'Create']); setModaledit(false); }}>
            CREATE
          </Button>
          <span>  </span>
          <Button variant="primary" className="btn btn-primary mr-1" onClick={() => {handleShow(["Edit client node",'Submit']); setModaledit(true); }}>
            EDIT
          </Button>
          <span>  </span>
          <Button variant="danger" className="btn btn-primary mr-1" onClick={handleDeletePacscloud}>
            DELETE
          </Button>
         
         

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{buttoncontent[0]}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-1" 
                >
                  <Form.Label>ip_addr</Form.Label>
                  <Form.Control
                    name="ip_addr"
                    placeholder="PACSCloud node IP ADDR"
                    onChange={inputchange}
                    autoFocus
                  />
                </Form.Group>
                <Form.Group
                    className="mb-1"
                  >
                    <Form.Label>ae_title</Form.Label>
                    <Form.Control
                    name="ae_title" 
                    placeholder="PACSCloud node ae title"
                    onChange={inputchange}
                    />
                </Form.Group>
                <Form.Group
                    className="mb-1"
                  >
                    <Form.Label>port</Form.Label>
                    <Form.Control
                    name="port" 
                    placeholder="PACSCloud node port"
                    onChange={inputchange}
                    />
                </Form.Group>
                <Form.Group
                    className="mb-1"
                  >
                    <Form.Label>hospital_code</Form.Label>
                    <Form.Control
                    name="hospital_code" 
                    placeholder="PACSCloud node hospital_code"
                    onChange={inputchange}
                    />
                </Form.Group>
                <Form.Group
                    className="mb-1"
                  >
                    <Form.Label>hospital_name</Form.Label>
                    <Form.Control
                    name="hospital_name" 
                    placeholder="PACSCloud hospital_name"
                    onChange={inputchange}
                    />
                </Form.Group>
                <Form.Group
                    className="mb-1"
                  >
                    <Form.Label>Decription (optional)</Form.Label>
                    <Form.Control
                    name="decription" 
                    placeholder="PACSCloud node decription"
                    onChange={inputchange}
                    />
                </Form.Group>
                <Form.Group
                    className="mb-1"
                  >
                    <Form.Label>region</Form.Label>
                    <Form.Control
                    name="region" 
                    placeholder="PACSCloud node region"
                    onChange={inputchange}
                    />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={() => (modaledit) ? handleEditPacscloud() : handleCreatePacscloud()}>
                {buttoncontent[1]}
              </Button>
            </Modal.Footer>
          </Modal>
         </div>
      </div>
  );
}

export {PacscloudNode};
