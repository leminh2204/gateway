import React, { Component } from 'react';
import {Button, Modal} from 'react-bootstrap';
import Paper from '@material-ui/core/Paper';
import { Grid, Table, TableHeaderRow, TableSelection, } from '@devexpress/dx-react-grid-material-ui';
import { SelectionState } from '@devexpress/dx-react-grid';

class SelectPacsClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pacsclientselection: [0],
      pacsclientselection_data: [],
      pacsclientinfo: this.props.pacsclientinfo,
      pacsclientselection_data: this.props.pacsclientinfo[0],
    };
  };

  // componentDidUpdate(prevProps) {
  //   if(prevProps.pacsclientinfo !== this.props.pacsclientinfo) {
  //     this.setState({pacsclientinfo: this.props.pacsclientinfo[0],
  //                   pacsclientselection_data: this.props.pacsclientinfo[0]});
  //   }   
  // }
  
  render() {
    const columns = [
        { name: 'id', title: 'ID' },
        { name: 'decription', title: 'Decription' },
        { name: 'zone', title: 'Zone' },
        {name: 'device', title: 'Device'}
      ];
    const rows = this.props.pacsclientinfo;
    return (
      <div>
        <Modal  show={true} onHide={this.props.handleClosePACSClient} backdrop="static" keyboard={false} centered={true} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Select PACSClient</Modal.Title>
          </Modal.Header>
          <Modal.Body>  
            <Paper>
              <Grid
                rows={rows}
                columns={columns}
              >
             <SelectionState
             selection={this.state.pacsclientselection}
             onSelectionChange={ (pacsclient_selection) => { const index = pacsclient_selection.slice(-1)[0];
                                                  this.setState({ pacsclientselection: [index],
                                                                  pacsclientselection_data: rows[index] });}
                                }/>
                <Table />
                <TableHeaderRow />
                <TableSelection
                  selectByRowClick
                />
              </Grid>
            </Paper>
          </Modal.Body>
          <Modal.Footer>
              <Button disabled={this.state.pacsclientselection_data ? false : true}  
                      onClick={() => this.props.selectPacsClient(this.state.pacsclientselection_data) } variant="dark">Confirm
              </Button>
          </Modal.Footer>
      </Modal>
    </div>
    );
  }
}

export {SelectPacsClient};