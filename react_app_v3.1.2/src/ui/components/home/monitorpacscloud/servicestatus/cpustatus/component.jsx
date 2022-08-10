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
import {datalineCPU} from "../services"

class CPUStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cpu_idle:[''],
      cpu_user:[''],
      cpu_system:['']
    };
  }

  componentDidMount(prevProps) {
    this.getCPUMeasure("cpu");
  }


  getCPUMeasure = (metric) => {
    const curent_time = Math.floor(Date.now() / 1000)
    MonitorService.getServiceMeasure(metric, 'pacscloud', (curent_time-300),curent_time, 30)
      .then(response => {
        const data = response.data;
        this.setState({ "cpu_idle": data.dataCpu_idle.data.result[0].values,
                        "cpu_user": data.dataCpu_user.data.result[0].values,
                        "cpu_system":  data.dataCpu_system.data.result[0].values});
      })
      .catch(error => {
        console.error(error);
      });
  }


  render() {
    const data = datalineCPU([{'cpu_usage': this.state.cpu_idle}, {"cpu_user": this.state.cpu_user}, {"cpu_system": this.state.cpu_system}]);
    return (
      <div>
        <Card style={{ width: '100%' }}>
          <Card.Title>
            <a href="/#">PACSCloud CPU status</a>
            <Button variant="white" onClick={() => this.getCPUMeasure("cpu")} ><AiOutlineSync color="blue" /></Button>
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
                      dataKey="cpu_usage"
                      stroke="#8884d8"
                    />
                    <Line type="monotone" dataKey="cpu_user" stroke="blue" />
                    <Line type="monotone" dataKey="cpu_system" stroke="#82ca9d" />
                  </LineChart>
                </div>
              </Col>
              <Col>
                <div className="card-text"> 
                  <Alert variant="primary">
                    <p>PACSCloud CPU Usage {Math.round(data[data.length - 1].cpu_usage)}%</p>
                  </Alert>
                </div>
                <div className="card-text"> 
                  <Alert variant="primary">
                    <p>PACSCloud CPU User {Math.round(data[data.length - 1].cpu_user)}%</p>
                  </Alert>
                </div>
                <div className="card-text"> 
                  <Alert variant="primary">
                    <p>PACSCloud CPU Sytem {Math.round(data[data.length - 1].cpu_system)}%</p>
                  </Alert>
                </div>
                <div className="card-text"> 
                  <Alert variant="primary">
                    <p>PACSCloud CPU Available {Math.round(100 - data[data.length - 1].cpu_usage)}%</p>
                  </Alert>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export {CPUStatus};
