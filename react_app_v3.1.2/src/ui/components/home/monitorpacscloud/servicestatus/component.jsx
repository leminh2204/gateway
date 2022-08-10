import React from 'react';
import {StorageStatus} from "./storagestatus"
import {CPUStatus} from "./cpustatus"
import {MemoryStatus} from "./memorystatus"
import {PACSCloudServiceHealth} from "./servicehealth"


function ServiceStatus() {
    return (
        <div className="App">
          <PACSCloudServiceHealth />
          <StorageStatus  />
          <CPUStatus />
          <MemoryStatus />
        </div>
    );
}

export {ServiceStatus};