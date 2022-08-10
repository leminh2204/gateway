import React, {  useState, useEffect, useRef } from 'react';
import { Button} from 'react-bootstrap';
import Table from 'react-bootstrap/Table'
import "./styles.css"
import ImageService from "api/image.service";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProgressBar from 'react-bootstrap/ProgressBar'
import {checkLoadDataFail, checkDownloadSuccessNotsend, checkLoadComplete, timeDatabaseFormat} from "./services"


function SyncImage(props) {
  const [isSentComplete, setIsSentComplete] = useState(false);
  const [issyncing, setIssyncing] = useState(false);
  const [patientinfo, setPatientinfo] = useState(props.patientinfo);
  const [progress, setProgress] = useState(0);
  const [loadimage_status, setLoadimage_status] = useState('');
  const [complete_time, setComplete_time] = useState('');
  const imagedown_count = useRef(0);
  const imagesend_count = useRef(0);
  const imageid = useRef(0);
  const intervalId = useRef(0);
  const isClickButton = useRef(false);
  const [percent_loading, setPercent_loading] = useState(0); 
  var progressInstance;
  const node = props.node;
  var pacscloudselect = props.pacscloudselect;
  var pacsclientselect = props.prevpacsclient;


  if (node === 'cloud'){
    
    [pacscloudselect, pacsclientselect] = [pacsclientselect, pacscloudselect];
  }
  else if (node === 'client'){
    console.log('Client Synced');
  }
  else{
    console.error('Error: node is not cloud or client');
  }
  

  const Syncdata = (patientinfo) => {
      setIssyncing(true);
      isClickButton.current = true;
      ImageService.downloadImageonPACSCloud(patientinfo.patient_id, 
                                            patientinfo.study_instanceuid, 
                                            patientinfo.modalities,
                                            patientinfo.image_count,
                                            pacscloudselect,
                                            pacsclientselect.id,
                                            pacscloudselect.id,
                                          )
        .then( response => {
          console.log(response);
          ImageSendStatus();
        })
        .catch( error => {
          setIssyncing(false);
          console.error(error);
        });
  }

  useEffect(() => {
    progressInstance = <ProgressBar variant = {  percent_loading === 100 ? 'success' : 'info'}  
                                              animated = {  percent_loading <100 ? true : false} 
                                              max='100' now={ percent_loading} 
                                              label={`${ percent_loading}%`}/>;
  }, [percent_loading])

  const sendImagetoPACSClient = (pacsclient_selection) => {
    console.log(pacsclient_selection);
		ImageService.sendImagetoPACSClient(imageid.current, pacsclient_selection)
			.then( response => {
        setLoadimage_status('sending')
				console.log('continue_send');
			})
			.catch(error => {
				console.error("ERROR: Could not loadimage to PACSClient");
				setLoadimage_status('send_error');
				clearInterval(intervalId.current);
			});		
	}
  const ImageSendStatus = () => {
    ImageService.getImagelist()
      .then( response => {     
        imageid.current=response.data.results[0].id;
        intervalId.current = setInterval(ImageDetail, 5000);

      })
      .catch(error => {
        console.error("ERROR: Could not get image infor");
      });      
    
  }
  
  const loadImageComplete = (response) => {
		clearInterval(intervalId.current);
		setComplete_time(response.data.dicomsendstatus[0].update_at);
		console.log(response);
		console.log('clearInterval')
	}

  const ImageDetail = () => {
    ImageService.getImageDetail(imageid.current)
    .then( response => {
        // check load data failed
        console.log(response);
        if ( checkLoadDataFail(response) ){setLoadimage_status('load_error'); clearInterval(intervalId.current); console.log('error');}
        // check down data complete but not send data
        if ( checkDownloadSuccessNotsend(response) ) { sendImagetoPACSClient(response.data.pacsclientinfor[0]); }
        // check load data complete
        if ( checkLoadComplete(response) ) { loadImageComplete(response); }
        // return image loaded while data is loading
        
        const imagesend_counter = response.data.dicomsendstatus.length ? response.data.dicomsendstatus[0].imagesend_completed : 0; 
        imagedown_count.current = response.data.dicomdownloadstatus[0].imagedownload_completed
        imagesend_count.current = imagesend_counter;
        Actions(imagesend_count.current, imagedown_count.current, loadimage_status); 
    })
    .catch(error => {
      console.error("ERROR: Could not get image from PACSCloud");
    });
  }

  const Actions = () => {
    
    // console.log(imagedown_count.current, imagesend_count.current, loadimage_status);
  
    if (!issyncing && !isClickButton.current) {
      progressInstance = <Button variant="primary" onClick={() => Syncdata(patientinfo)}> Sync </Button>
    }
    else {
      if (loadimage_status === 'load_error'  || loadimage_status === 'send_error') {
        progressInstance = <ProgressBar variant = 'danger' max='100' now='50' label='ERROR Load Image'/>;
      }
      else if (loadimage_status === 'error_notfound'){
        progressInstance = <ProgressBar variant = 'danger' max='100' now='100' label='404 ERROR'/>;
      } 
      else {     
        setPercent_loading(Math.trunc((parseInt(imagedown_count.current) + parseInt(imagesend_count.current))/ parseInt(patientinfo.image_count) * 50));
        progressInstance = <ProgressBar variant = {  percent_loading === 100 ? 'success' : 'info'}  
                                              animated = {  percent_loading <100 ? true : false} 
                                              max='100' now={ percent_loading} 
                                              label={`${ percent_loading}%`}/>;

        
      }
    }

    return (
        <td>{progressInstance}</td>
      );  

      };



return (
  <div>
    {patientinfo ? 
    <div >
      <Table striped bordered hover>
						<thead>
							<tr>
								<th style={{width: '8%'}}>Study Date</th>
								<th style={{width: '8%'}}>Modalities</th>
								<th style={{width: '18%'}}>Patient Name</th>
								<th style={{width: '8%'}}>Patient ID</th>
								<th style={{width: '10%'}}>Image Count</th>
								<th style={{width: '40%'}}>Study InstanceUID</th>
                <th style={{width: '8%'}}>Actions</th>
							</tr>
						</thead>
					  <tbody>
					    <tr>
							<td                              >{patientinfo.study_date}</td>
							<td style={{textAlign: 'center'}}>{patientinfo.modalities}</td>
							<td                              >{patientinfo.patient_name}</td>
							<td                              >{patientinfo.patient_id}</td>
							<td style={{textAlign: 'center'}}>{patientinfo.image_count}</td>
              <td                              >{patientinfo.study_instanceuid}</td>
              <Actions/>
              {/* <td>{issyncing ? <ProgressBar animated now={progress} /> : <Button onClick={() => Syncdata(patientinfo)}>{'Sync'}</Button>}</td> */}
					    </tr>
					  </tbody>
					</Table>
    </div> : null}
    <br/>
  </div>
)
}
export {SyncImage};
