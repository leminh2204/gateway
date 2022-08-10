import React, { Component } from "react";
import { PieChart, Pie, Sector } from "recharts";
import { Card, Alert, Row, Col, Button } from 'react-bootstrap';
import { AiOutlineSync } from "react-icons/ai";
import MonitorService from "api/monitor.service"
import './styles.css';
import {datapie} from "../services"

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Capacity: ${value}GB`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Ratio ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

class StorageStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex:0,
      storage_total:0,
      storage_avail:0,
    };
  }


  componentDidMount(prevProps) {
    this.getStorageMeasure("storage");
  }


  getStorageMeasure = (metric) => {
    const curent_time = Math.floor(Date.now() / 1000)
    MonitorService.getServiceMeasure(metric, 'pacscloud', (curent_time),curent_time, 5)
      .then(response => {
        const data = response.data;
        this.setState({ "storage_avail": data.storage_aval.data.result[0].values[0][1],
                        "storage_total": data.storage_total.data.result[0].values[0][1]});
      })
      .catch(error => {
        console.error(error);
      });
  }


  render() {
  const onPieEnter = (_, index) => {
      this.setState({
        activeIndex:index,
      });
    };
  const data = datapie([  { "Storage available": this.state.storage_avail },
                          { "Storage usage": (this.state.storage_total - this.state.storage_avail)},
                          { "Storage system": this.state.storage_avail*0.000064} ]);

    return (
        <div>
          <Card style={{ width: '100%' }}>
            <Card.Title>
              <a href="/#">PACSCloud Storage status</a>
              <Button variant="white" onClick={() => this.getStorageMeasure("storage")}><AiOutlineSync color="blue" /></Button>
            </Card.Title>
            <Card.Body>
              <Row>
                <Col>
                  <PieChart width={600} height={300}>
                    <Pie
                      activeIndex={this.state.activeIndex}
                      activeShape={renderActiveShape}
                      data={data}
                      cx={300}
                      cy={150}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                    />
                  </PieChart>
                </Col>
                <Col>
                  <div className="card-text"> 
                    <Alert variant="primary">
                      <p>PACSCloud Total Storage Capacity {Math.round(data[0]['value'] + data[1]['value'] + data[2]['value'])}GB</p>
                    </Alert>
                  </div>
                  <div className="card-text"> 
                    <Alert variant="primary">
                      <p>PACSCloud Available Storage Capacity {data[0]['value']}GB</p>
                    </Alert>
                  </div>
                  <div className="card-text"> 
                    <Alert variant="primary">
                      <p>PACSCloud Usage Storage Capacity {data[1]['value']}GB</p>
                    </Alert>
                  </div>
                  <div className="card-text"> 
                    <Alert variant="primary">
                      <p>PACSCloud System Storage Capacity {data[2]['value']}GB</p>
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

export {StorageStatus};
