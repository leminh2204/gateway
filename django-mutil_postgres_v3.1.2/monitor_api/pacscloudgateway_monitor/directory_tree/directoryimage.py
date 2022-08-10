import requests

def get_directory_tree(pacscloud_ipaddr, directory_path):
	return requests.get('http://%s:9000/api/v1/file?path=/archive/%s' % (pacscloud_ipaddr, directory_path))