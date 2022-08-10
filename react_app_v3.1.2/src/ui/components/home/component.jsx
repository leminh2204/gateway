import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route,  NavLink } from "react-router-dom"
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent
} from "react-pro-sidebar";
import {
  FaSearch,
  FaFileImport,
  FaCog,
  FaList,
  FaCheckCircle,
} from "react-icons/fa";
import{GetImage} from './getimage'
import{CheckClientImage} from './checkclientimage'
import{ViewData} from './viewlistdata'
import {PacscloudNode} from "./setting/pacscloudnode"
import {PacsclientNode} from "./setting/pacsclientnode"
import{MonitorPACSCloud} from './monitorpacscloud'
import{ServiceStatus} from './monitorpacscloud/servicestatus'
import{ViewDrive} from './monitorpacscloud/viewdrive'
import { Button, Nav, Container  } from 'react-bootstrap'
import AuthService from "api/authentication.service"
import "./styles.css";
import 'react-pro-sidebar/dist/css/styles.css'
import {AutoCheck} from './autocheck'
import emailjs from '@emailjs/browser';


const handleClicklogout = () => { 
    AuthService.logout();
}



const Aside = ({ image, collapsed, rtl, toggled, handleToggleSidebar }) => {
  return (
    <ProSidebar
      image={false}
      rtl={rtl}
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        <div
          style={{
            padding: "24px",
            textTransform: "uppercase",
            fontWeight: "bold",
            fontSize: 14,
            letterSpacing: "1px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          Gateway
        </div>
      </SidebarHeader>

      <SidebarContent>
                  <Nav variant="pills" defaultActiveKey="/monitor/status">

          </Nav>
            <Menu iconShape="circle">
            <MenuItem
              icon={<FaCheckCircle />}
              suffix={<span className="badge red">'pacsclient'</span>}
            >
              <Nav.Item>
                <NavLink to="/checkclientimage" className="nav-link">
                  Check
                </NavLink>
              </Nav.Item>
            </MenuItem>
          </Menu>
          <Menu iconShape="circle">
            <MenuItem
              icon={<FaSearch />}
              suffix={<span className="badge red">'pacscloud'</span>}
            >
              <Nav.Item>
                <NavLink to="/getimage" className="nav-link">
                  SearchImg
                </NavLink>
              </Nav.Item>
            </MenuItem>
            <MenuItem icon={<FaFileImport />}>
              <Nav.Item>
                <NavLink to="/viewdata" className="nav-link">
                  DicomImage
                </NavLink>
              </Nav.Item>
            </MenuItem>
          </Menu>
          <Menu iconShape="circle">
            <SubMenu
              title="Setting"
              icon={<FaCog />}
            >
              <MenuItem>              
                <Nav.Item>
                  <NavLink to="/setting/pacscloudnode" className="nav-link">
                    PACSCloud Node
                  </NavLink>
                </Nav.Item>
              </MenuItem>
              <MenuItem>              
                <Nav.Item>
                  <NavLink to="/setting/pacsclientnode" className="nav-link">
                    PACSClient Node
                  </NavLink>
                </Nav.Item>
              </MenuItem>
            </SubMenu>
            <SubMenu title="MonitorPACSCloud" icon={<FaList />}>
                <MenuItem>            
                  <Nav.Item>
                    <NavLink to="/monitor/servicestatus" className="nav-link">
                      ServiceStatus
                    </NavLink>
                  </Nav.Item>
                </MenuItem>
                <MenuItem>            
                  <Nav.Item>
                    <NavLink to="/monitor/viewdrive" className="nav-link">
                      ViewDrive
                    </NavLink>
                  </Nav.Item>
                </MenuItem>
            </SubMenu>  
          </Menu>
      </SidebarContent>

      <SidebarFooter style={{ textAlign: "center" }}>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: "20px 24px"
          }}
        >
          <a
            target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"
          >
            <span>iNext Technology</span>
          </a>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};


function HomePage () {

  // useEffect(() => {
  //   AutoCheck()
  //     .then((response) => {
  //       let templateParams = {
  //           status: response.status,
  //           data: response.data
  //         }
        
  //       console.log(templateParams);
  //       // emailjs.send('service_7uez30h', 'template_c3lz3sx', templateParams, 'NtGox-votI2TjriL8')
  //       //     .then(function(response) {
  //       //     console.log('SUCCESS!', response.status, response.text);
  //       //     }, function(error) {
  //       //     console.log('FAILED...', error);
  //       //     });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   setInterval(() => {
  //   console.log('Interval triggered');
  //   AutoCheck()
  //     .then((response) => {
  //       let templateParams = {
  //           status: response.status,
  //           data: response.data
  //         }
        
  //       console.log(templateParams);
  //       // emailjs.send('service_7uez30h', 'template_c3lz3sx', templateParams, 'NtGox-votI2TjriL8')
  //       //     .then(function(response) {
  //       //     console.log('SUCCESS!', response.status, response.text);
  //       //     }, function(error) {
  //       //     console.log('FAILED...', error);
  //       //     });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   }, 60000);
  // }, []);
  



  return (
    <div className='classic'>
        <BrowserRouter>
          <nav className="header navbar navbar-expand navbar-dark bg-dark">
            <h3  className="navbar-brand">PACSCloud Gateway</h3>
              <div className="topnav-right">
                <Button  onClick={handleClicklogout} variant="primary">Logout</Button>
              </div>
          </nav>
          <Aside />
          <div className="content">
            <Container>
            <Switch>
                <Route path="/getimage" component={GetImage} />
                <Route path="/viewdata" component={ViewData} />

                <Route path="/checkclientimage" component={CheckClientImage} />
                
                <Route path="/monitor/servicestatus" component={ServiceStatus} />
                <Route path="/monitor/viewdrive" component={ViewDrive} />
                <Route path="/setting/pacscloudnode" component={PacscloudNode} />
                <Route path="/setting/pacsclientnode" component={PacsclientNode} />
            </Switch>
            </Container>
          </div>
        </BrowserRouter>
    </div>
  );
}

export {HomePage};
