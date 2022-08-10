import React, { Component } from 'react';
import MonitorService from "api/monitor.service"
import { FaFolderOpen, FaFileAlt } from "react-icons/fa";
import { BsArrow90DegLeft } from "react-icons/bs";
import {Button, Breadcrumb, Row, Col} from 'react-bootstrap';
import "./styles.css"

class ViewDrive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prev_path:[],
      current_path :'',
      list_file_or_folder:[],
    };
    this.handleClickgetItem=this.handleClickgetItem.bind(this);
    this.handleClickpreviousItem=this.handleClickpreviousItem.bind(this);
  }


  componentDidMount(prevProps) {
    this.getDirectoryFilelist();
  }


  getDirectoryFilelist = () => {
    MonitorService.getDirectoryFilelist(this.state.current_path)
      .then(response => {
        this.setState({
          list_file_or_folder: response.data.item,
        })
      })
      .catch(error => {
        console.error(error);
      });
  }

  handleClickgetItem = (object) => {
    const prev=this.state.prev_path;
    prev.push(this.state.current_path);
    this.setState((prevState) => ({
      prev_path:prev,
      current_path:this.state.current_path+ '/' +object}), 
      () => {
        this.getDirectoryFilelist();
      });
  }

  handleClickpreviousItem = () => {
    const prev = this.state.prev_path;
    const last_item = prev[prev.length - 1];
    prev.pop();
    if (this.state.current_path){
      this.setState({
        prev_path:prev,
        current_path:last_item,
      }, () => {
        this.getDirectoryFilelist()
        });
    }
  }


  render() {
    const breakcumb = (this.state.current_path).split("/");
    breakcumb[0]="PACSCLoud Drive"
    return (
        <div className="content-top">
        <div className="drive-tool" >
        <Breadcrumb>
            {breakcumb.map(object => <Breadcrumb.Item active>{object}</Breadcrumb.Item>)}
        </Breadcrumb>
        <Button onClick={() => this.handleClickpreviousItem()} variant="light">
          <BsArrow90DegLeft  color="CornflowerBlue" fontSize="2em"/>
        </Button></div>
          <Row>
            <Col>
              <p>Name</p>
            </Col>
            <Col>
              <p>File size</p>
            </Col>
          </Row>
          <div className="drive-body">
            {this.state.list_file_or_folder!== undefined ? 
              this.state.list_file_or_folder.map(object =>
                <Row>
                  <Col>
                    <div>
                    {Object.keys(object)[0] === "dir" ? 
                      <div className="drive-item" onClick={() => this.handleClickgetItem(object.dir)}>
                        <FaFolderOpen color="CornflowerBlue" fontSize="2em" /><a>{object[Object.keys(object)]}</a>
                      </div> :
                      <div className="drive-item"><FaFileAlt color="DarkGrey" fontSize="2em" /><a>{object[Object.keys(object)]}.dcm</a></div>
                    }
                    </div>
                  </Col><Col><p>...</p></Col>
                </Row>) 
                : null}
          </div>
        </div>
    );
  }
}

export {ViewDrive};
