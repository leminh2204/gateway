import React, { Component } from 'react';
import { ProgressBar  } from 'react-bootstrap';

class SendImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagetotal_count : this.props.imagetotal_count,
      imagesend_count: this.props.imagesend_count,
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.imagesend_count !== this.props.imagesend_count) {
      this.setState({imagesend_count: this.props.imagesend_count});
    }
    else if(prevProps.imagetotal_count !== this.props.imagetotal_count){
      this.setState({imagetotal_count: this.props.imagetotal_count});
    }
  }

  render() {
    const percent_sending = Math.trunc(this.state.imagesend_count / this.state.imagetotal_count * 100)
    const progressInstance = <ProgressBar animated = { percent_sending <100 ? true : false} 
                                          max='100' now={percent_sending} 
                                          label={`${percent_sending}%`}/>;    
    return (
      <td>{progressInstance}</td>
    );
  }
}

export {SendImage};
