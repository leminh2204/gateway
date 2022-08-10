import React, { Component } from 'react';
import ImageService from "api/image.service";
import {Data} from "./data";
import {Form, FormControl, Button  } from 'react-bootstrap';


class ViewData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objects: [],
    }
  }
  componentDidMount() {
    this.getImagelist();
  }

  getImagelist = () => {
    ImageService.getImagelist()
      .then( response => {     
        this.setState({
          objects: response.data.results,
        });
      })
      .catch(error => {
        console.error("ERROR: Could not get image infor");
      });      
  }

  handleDeleteImage = imageid => {
    ImageService.deleteImage(imageid)
      .then(response => {
        let listImage = this.state.objects
        for(var i=0; i<listImage.length; i++ ){
          if(listImage[i].id===imageid ){
            listImage.splice(i, 1);
          }
        }
        this.setState({
          objects: listImage,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }


  render() {   
    return (
      <div className="content-top">
          <h1>Load Image Status</h1>
          <Form inline>
            <FormControl type="text" placeholder="Search PatID " className="mr-sm-2 " />
            <Button  variant="outline-primary"  >Search </Button>
          </Form>
        {this.state.objects.map(object => <Data key={object.id}
                                                imageid={object.id}
                                                create_time={object.created_at} 
                                                patid={object.patid}
                                                imagetotal_count={object.image_count}
                                                pacscloudinfor={object.pacscloudinfor[0]}
                                                pacsclientinfor={object.pacsclientinfor[0]}
                                                onDelete={this.handleDeleteImage} />)}

      </div>
    );
  }
}

export {ViewData};
