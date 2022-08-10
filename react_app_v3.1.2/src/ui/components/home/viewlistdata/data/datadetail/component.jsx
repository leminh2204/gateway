import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import ImageService from "api/image.service";

class DataDetail extends Component {
  	constructor(props) {
	    super(props);
	    this.state = {
	    	image_detail:{},
	    };
	};


	componentDidMount(prevProps) {
	  	this.findImageonPACSCloud();
	}

	findImageonPACSCloud = () => {
		ImageService.findImageonPACSCloud(this.props.patid, this.props.pacscloudinfor)
			.then( response => {
				this.setState({
			 		imagetotal_count: response.data.patient[0].image_count,
			 		image_detail: response.data.patient[0],
				});
		  	})
		  	.catch(error => {
		      	console.error("ERROR: Could not get patient infor");
  				this.setState({
					loadimage_status: 'error_notfound',
				});
		    });
	}

	render() {
	    return (
	      <ListGroup>
	             { Object.keys(this.state.image_detail).map( (key)=> {
	                return <ListGroup.Item variant="primary"> <p className="object-detail">{key.toUpperCase()}</p>
	                                      <p className="object-detail">{this.state.image_detail[key]}</p>
	                    </ListGroup.Item>
	              })}
	      </ListGroup>
	    );
	}
}

export {DataDetail};
