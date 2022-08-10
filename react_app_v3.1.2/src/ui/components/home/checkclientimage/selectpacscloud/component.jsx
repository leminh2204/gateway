import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { Grid, Table, TableHeaderRow, TableSelection, } from '@devexpress/dx-react-grid-material-ui';
import { Button, Modal} from 'react-bootstrap';
import { SelectionState } from '@devexpress/dx-react-grid';


class SelectPacsCloud extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pacscloudselection: [0],
      pacscloudselection_data: [],
      pacscloudinfo: this.props.pacscloudinfo,
      pacscloudselection_data: this.props.pacscloudinfo[0],
    };
  };

  // componentDidUpdate(prevProps) {
  //   if(prevProps.pacscloudinfo !== this.props.pacscloudinfo) {
  //     this.setState({pacscloudinfo: this.props.pacscloudinfo[0],
  //                   pacscloudselection_data: this.props.pacscloudinfo[0]});
  //   }   
  // }

  render() {
    const columns = [
        { name: 'id', title: 'ID' },
        { name: 'hospital_name', title: 'Hospital Name' },
        { name: 'hospital_code', title: 'Hospital Code' },
        { name: 'region', title: 'Region'}
      ];

    const rows = this.props.pacscloudinfo;
    return (
        <div>
          <Modal  show={true} onHide={this.props.handleClosePACSCloud} backdrop="static" keyboard={false} centered={true} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Select PACSCloud Source</Modal.Title>
            </Modal.Header>
            <Modal.Body>  
              <Paper>
                <Grid
                  rows={rows}
                  columns={columns}
                >
               <SelectionState
               selection={this.state.pacscloudselection}
               onSelectionChange={ (selection) => { const index = selection.slice(-1)[0];
                                                    this.setState({ pacscloudselection: [index],
                                                                    pacscloudselection_data: rows[index] });}
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
              <Button disabled={ this.state.pacscloudselection_data ? false : true} 
                      onClick={() => this.props.selectPacsCloud(this.state.pacscloudselection_data) } variant="dark">Confirm
              </Button>
            </Modal.Footer>
          </Modal>           
        </div>     
    );
  }
}

export {SelectPacsCloud};