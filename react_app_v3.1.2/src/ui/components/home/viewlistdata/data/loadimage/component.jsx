import React, { Component } from 'react';
import { ProgressBar  } from 'react-bootstrap';

class LoadImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagetotal_count : this.props.imagetotal_count,
      imagedown_count : this.props.imagedown_count,
      imagesend_count: this.props.imagesend_count,
      loadimage_status: this.props.loadimage_status
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.imagedown_count !== this.props.imagedown_count) {
      this.setState({imagedown_count: this.props.imagedown_count});
    }
    if(prevProps.imagesend_count !== this.props.imagesend_count){
      this.setState({imagesend_count: this.props.imagesend_count});
    }
    if(prevProps.imagetotal_count !== this.props.imagetotal_count){
      this.setState({imagetotal_count: this.props.imagetotal_count});
    }
    if(prevProps.loadimage_status !== this.props.loadimage_status){
      this.setState({loadimage_status: this.props.loadimage_status});
    }
  }


  render() {
    let progressInstance;
    if (this.state.loadimage_status === 'load_error') {
      progressInstance = <ProgressBar variant = 'danger' max='100' now='50' label='ERROR Load Image'/>;
    }
    else if (this.state.loadimage_status === 'error_notfound'){
      progressInstance = <ProgressBar variant = 'danger' max='100' now='100' label='404 ERROR'/>;
    } 
    else {
      const percent_loading = Math.trunc((parseInt(this.state.imagedown_count) + 
                                          parseInt(this.state.imagesend_count)) / 
                                          this.state.imagetotal_count * 50);
      progressInstance = <ProgressBar variant = { percent_loading === 100 ? 'success' : 'info'}  
                                            animated = { percent_loading <100 ? true : false} 
                                            max='100' now={percent_loading} 
                                            label={`${percent_loading}%`}/>;
    }
    return (
        <td>{progressInstance}</td>
    );
  }
}

export {LoadImage};
