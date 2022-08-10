# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.

import requests

def getdata_metric(metric, PACSCLOUD_URLS, server_selected, start_time, end_time, steptime):
	if metric=="cpu":
		return getdataCPU(PACSCLOUD_URLS, server_selected, start_time, end_time, steptime)
	elif metric=="memory":
		return getdataMemory(PACSCLOUD_URLS, server_selected, start_time, end_time, steptime)
	elif metric=="network":
		return getdataNetwork(PACSCLOUD_URLS, server_selected, start_time, end_time, steptime)
	elif metric=="storage":
		return getdataStorage(PACSCLOUD_URLS, server_selected, start_time, end_time, steptime)
	else: 
		return 404


def get_stringquery(content, server_selected, start_time, end_time, steptime):
    switcher={
      "ram_total": "(sum( node_memory_MemTotal_bytes{job='%(y)s'}) by (instance))&start=%(ts)s&end=%(te)s&step=%(st)s" % 
                  { "y" : server_selected, 'ts' : start_time, 'te' : end_time, 'st' : steptime },
      "ram_available": "(sum( node_memory_MemAvailable_bytes{job='%(y)s'}) by (instance))&start=%(ts)s&end=%(te)s&step=%(st)s" % 
      						{ "y" : server_selected, 'ts' : start_time, 'te' : end_time, 'st' : steptime },
      "ram_usage": """(sum( node_memory_MemTotal_bytes{job='%(y)s'} - node_memory_MemFree_bytes{job='%(y)s'} 
      						- node_memory_Cached_bytes{job='%(y)s'} - node_memory_Buffers_bytes{job='%(y)s'}) 
      						by (instance))&start=%(ts)s&end=%(te)s&step=%(st)s""" %
       						{ "y" : server_selected, 'ts' : start_time, 'te' : end_time, 'st' : steptime } ,
      "cpu_usage_idle": "(avg by (instance) (rate(node_cpu_seconds_total{job='%(y)s',mode='idle'}[5m])) * 100)&start=%(ts)s&end=%(te)s&step=%(st)s" % 
      						{ "y" : server_selected, 'ts' : start_time, 'te' : end_time, 'st' : steptime } ,
      "cpu_usage_user": "((avg by (instance) (rate(node_cpu_seconds_total{job='%(y)s',mode='user'}[5m])) * 100))&start=%(ts)s&end=%(te)s&step=%(st)s" % 
      						{ "y" : server_selected, 'ts' : start_time, 'te' : end_time, 'st' : steptime } ,
      "cpu_usage_system": "((avg by (instance) (rate(node_cpu_seconds_total{job='%(y)s',mode='system'}[5m])) * 100))&start=%(ts)s&end=%(te)s&step=%(st)s" % 
      						{ "y" : server_selected, 'ts' : start_time, 'te' : end_time, 'st' : steptime } ,
      "network_traffic_in": "rate(node_network_receive_bytes_total{job='%(y)s'}[1m])&start=%(ts)s&end=%(te)s&step=%(st)s" % 
      						{ "y" : server_selected, 'ts' : start_time, 'te' : end_time, 'st' : steptime } ,
      "network_traffic_out": "rate(node_network_transmit_bytes_total{job='%(y)s'}[1m])&start=%(ts)s&end=%(te)s&step=%(st)s" % 
      						{ "y" : server_selected, 'ts' : start_time, 'te' : end_time, 'st' : steptime } ,
      "storage_total": "node_filesystem_size_bytes{mountpoint='/archive',job='%(y)s'}&start=%(ts)s&end=%(te)s&step=%(st)s" % 
      						{ "y" : server_selected, 'ts' : start_time, 'te' : end_time, 'st' : steptime } ,
      "storage_aval": "node_filesystem_avail_bytes{mountpoint='/archive',job='%(y)s'}&start=%(ts)s&end=%(te)s&step=%(st)s" % 
      						{ "y" : server_selected, 'ts' : start_time, 'te' : end_time, 'st' : steptime } ,
    }
    return switcher.get(content)

def getdataCPU(PACSCLOUD_URLS, server_selected, start_time, end_time, steptime):
	#get data monitor CPU idle
      respone_dataCpu_idle = requests.get(("http://%(x)s:9090/api/v1/query_range?query=%(y)s" % 
      										{"x" : PACSCLOUD_URLS, "y" : 
      										get_stringquery('cpu_usage_idle', server_selected, start_time, end_time, steptime) }), verify=False )
      respone_dataCpu_user = requests.get(("http://%(x)s:9090/api/v1/query_range?query=%(y)s" % 
											{"x" : PACSCLOUD_URLS, "y" : 
											get_stringquery('cpu_usage_user', server_selected, start_time, end_time, steptime) }), verify=False )
      respone_dataCpu_system = requests.get(("http://%(x)s:9090/api/v1/query_range?query=%(y)s" % 
											{"x" : PACSCLOUD_URLS, "y" : 
											get_stringquery('cpu_usage_system', server_selected, start_time, end_time, steptime) }), verify=False )
      context_dict =  { 
                        "dataCpu_idle":respone_dataCpu_idle.json(),
                        "dataCpu_user":respone_dataCpu_user.json(),
                        "dataCpu_system":respone_dataCpu_system.json(),
                    }
      return context_dict

def getdataMemory(PACSCLOUD_URLS, server_selected, start_time, end_time, steptime):
      respone_dataRam_total = requests.get(("http://%(x)s:9090/api/v1/query_range?query=%(y)s" % 
                    {"x" : PACSCLOUD_URLS, "y" : get_stringquery('ram_total', server_selected, start_time, end_time, steptime) }), verify=False )
      respone_dataRam_avai = requests.get(("http://%(x)s:9090/api/v1/query_range?query=%(y)s" % 
      							{"x" : PACSCLOUD_URLS, "y" : get_stringquery('ram_available', server_selected, start_time, end_time, steptime) }), verify=False )
      respone_dataRam_usage = requests.get(("http://%(x)s:9090/api/v1/query_range?query=%(y)s" % 
      							{"x" : PACSCLOUD_URLS, "y" : get_stringquery('ram_usage', server_selected, start_time, end_time, steptime) }), verify=False )  
      context_dict =  { 
                        "data_dataRam_total":respone_dataRam_total.json(), 
                        "data_dataRam_avai":respone_dataRam_avai.json(), 
                        "data_dataRam_usage":respone_dataRam_usage.json(),
                    }
      return context_dict

def getdataNetwork(PACSCLOUD_URLS, server_selected, start_time, end_time, steptime): 
      respone_dataNetwork_in = requests.get(("http://%(x)s:9090/api/v1/query_range?query=%(y)s" % 
      					{"x" : PACSCLOUD_URLS, "y" : get_stringquery('network_traffic_in', server_selected, start_time, end_time, steptime) }), verify=False )
      respone_dataNetwork_out = requests.get(("http://%(x)s:9090/api/v1/query_range?query=%(y)s" % 
      					{"x" : PACSCLOUD_URLS, "y" : get_stringquery('network_traffic_out', server_selected, start_time, end_time, steptime) }), verify=False )
      context_dict =  { 
                        "dataNetwork_in":respone_dataNetwork_in.json(),
                        "dataNetwork_out":respone_dataNetwork_out.json()
                    }
      return context_dict

def getdataStorage(PACSCLOUD_URLS, server_selected, start_time, end_time, steptime): 
      respone_dataStorage_total= requests.get(("http://%(x)s:9090/api/v1/query_range?query=%(y)s" % 
      					{"x" : PACSCLOUD_URLS, "y" : get_stringquery('storage_total', server_selected, start_time, end_time, steptime) }), verify=False )
      respone_dataStorage_aval = requests.get(("http://%(x)s:9090/api/v1/query_range?query=%(y)s" % 
      					{"x" : PACSCLOUD_URLS, "y" : get_stringquery('storage_aval', server_selected, start_time, end_time, steptime) }), verify=False )
      context_dict =  { 
                        "storage_total":respone_dataStorage_total.json(),
                        "storage_aval":respone_dataStorage_aval.json()
                    }
      return context_dict
