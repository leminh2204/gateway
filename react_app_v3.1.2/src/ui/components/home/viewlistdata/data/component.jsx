import React, { Component } from 'react';
import { Table, Button } from 'react-bootstrap';
import { BsFillTrashFill } from 'react-icons/bs'
import ImageService from "api/image.service";
import { confirmAlert } from 'react-confirm-alert'; // Import
import "./styles.css"
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {LoadData} from "./loaddata"
import {DataDetail} from "./datadetail"
import {checkLoadDataFail, checkDownloadSuccessNotsend, checkLoadComplete, timeDatabaseFormat} from "./services"

class Data extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	complete_time:'',
    	loadimage_status: '',
    	imagedown_count: 0,
    	imagesend_count: 0,
    	imagetotal_count:1000,
    };
  }


	componentDidMount(prevProps) {
		this.intervalId = setInterval(() => this.getImageDetail(), 5000);
	  	this.getImageDetail();
	  	// this.findImageonPACSCloud();
	}

	loadImageFail = () => {
		this.setState({
			loadimage_status: 'load_error',
		});
		clearInterval(this.intervalId);		
	}

	sendImagetoPACSClient = (pacsclient_selection) => {
		ImageService.sendImagetoPACSClient(this.props.imageid, pacsclient_selection)
			.then( response => {
				this.setState({ loadimage_status: 'sending' });
				console.log('continue_send');
			})
			.catch(error => {
				console.error("ERROR: Could not loadimage to PACSClient");
				this.setState({ loadimage_status: 'send_error' });
				clearInterval(this.intervalId);
			});		
	}

	loadImageComplete = (response) => {
		clearInterval(this.intervalId);
		this.setState({ complete_time:  response.data.dicomsendstatus[0].update_at});
		console.log(response);
		console.log('clearInterval')
	}

	getImageDetail = () => {
		ImageService.getImageDetail(this.props.imageid)
			.then(response => {
			  	// check load data failed
			  	if ( checkLoadDataFail(response) ){ this.loadImageFail(); }
			  	// check down data complete but not send data
			  	if ( checkDownloadSuccessNotsend(response) ) { this.sendImagetoPACSClient(response.data.pacsclientinfor[0]); }
			  	// check load data complete
			    if ( checkLoadComplete(response) ) { this.loadImageComplete(response); }
			    // return image loaded while data is loading
			  	const imagesend_count = response.data.dicomsendstatus.length ? response.data.dicomsendstatus[0].imagesend_completed : 0;
				this.setState({
			 		imagedown_count: response.data.dicomdownloadstatus[0].imagedownload_completed,
			 		imagesend_count: imagesend_count,
				});
		  	})
		    .catch(error => {
				console.error("ERROR: Could not get image from PACSCloud");
		    });

	}

	handleClickDetailview = () => {
		const currentState = this.state.detailView;
		this.setState({ detailView: !currentState });
	}

	handlesubmitDelete = () => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
				  <div className="react-confirm-alert-body">
				  	<h1>Confirm to Delete</h1>
					  	Are you sure to delete this file.
					<div className="react-confirm-alert-button-group">
						  	<button	
						  		onClick={() => {
				        			this.props.onDelete(this.props.imageid);
				        			onClose();
				        		}}
				        	>
				        	Yes
				        	</button>
						  <button onClick={onClose}>No</button>
			  		</div>
				  </div>
				);
				}
			});
		}

  	render() {
	    return (
				<div className="viewlist-content">
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Patient ID</th>
								<th>Source PACSCloud</th>
								<th>Destination PACSClient</th>
								<th>Time Create</th>
								<th>Time complete</th>
								<th>Image Load Status</th>
								<th></th>
							</tr>
						</thead>
					  <tbody>
					    <tr>
							<td onClick={this.handleClickDetailview}>{this.props.patid}</td>
							<td>{(this.props.pacscloudinfor).hospital_name}</td>
							<td>{(this.props.pacsclientinfor).decription}</td>
							<td>{timeDatabaseFormat(this.props.create_time)}</td>
							<td>{timeDatabaseFormat(this.state.complete_time)}</td>
							<LoadData 	key={this.props.patid}
										imagedown_count={this.state.imagedown_count}
										imagesend_count={this.state.imagesend_count}
										imagetotal_count={this.props.imagetotal_count}
										loadimage_status={this.state.loadimage_status} />
							<td>
			
									<Button onClick={this.handlesubmitDelete} variant="white"><BsFillTrashFill color="red"/></Button>

							</td>
					    </tr>
					  </tbody>
					</Table>
					{this.state.detailView ? <DataDetail patid={this.props.patid} pacscloudinfor={this.props.pacscloudinfor} /> : null}
				</div>
	    );
  }
}

export {Data};