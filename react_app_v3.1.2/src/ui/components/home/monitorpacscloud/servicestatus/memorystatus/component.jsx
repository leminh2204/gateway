import React, {Component} from "react";
import MonitorService from "api/monitor.service"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { Card,Alert,Row,Col,Button } from 'react-bootstrap';
import { AiOutlineSync } from "react-icons/ai";
import { datalineRAM } from "../services"

class MemoryStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memory_usage:[],
      memory_avai:[],
      memory_total:[],
    };
  }

  componentDidMount(prevProps) {
    this.getRAMMeasure("memory");
  }


  getRAMMeasure = (metric) => {
    const curent_time = Math.floor(Date.now() / 1000)
    MonitorService.getServiceMeasure(metric, 'pacscloud', (curent_time-300),curent_time, 30)
      .then(response => {
        const data = response.data;
        this.setState({ "memory_usage": data.data_dataRam_usage.data.result[0].values,
                        "memory_avai": data.data_dataRam_avai.data.result[0].values,
                        "memory_total": data.data_dataRam_total.data.result[0].values[0][1]});
      })
      .catch(error => {
        console.error(error);
      });
  }


  render() {
    const data = datalineRAM([{ "memory_total": this.state.memory_total }, { "memory_usage": this.state.memory_usage }, 
                                { "memory_avai": this.state.memory_avai }]);
    return (
      <div>
        <Card style={{ width: '100%' }}>
          <Card.Title>
            <a href="/#">PACSCloud Memory status</a>
            <Button variant="white"  onClick={() => this.getRAMMeasure("memory")}><AiOutlineSync color="blue" /></Button>
          </Card.Title>
          <Card.Body>
            <Row>
              <Col>
                <div className="card-text">
                  <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="memory_usage"
                      stroke="green"
                    />
                    <Line type="monotone" dataKey="memory_avai" stroke="#8884d8" />
                  </LineChart>
                </div>
              </Col>
              { data.length ?
              <Col>
                <div className="card-text"> 
                  <Alert variant="primary">
                    <p>PACSCloud Memory Usage {Math.round(data[data.length - 1].memory_usage)}%</p>
                  </Alert>
                </div>
                <div className="card-text"> 
                  <Alert variant="primary">
                    <p>PACSCloud Memory Available {Math.round(data[data.length - 1].memory_avai)}%</p>
                  </Alert>
                </div>
              </Col> : null}
            </Row>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export {MemoryStatus};
