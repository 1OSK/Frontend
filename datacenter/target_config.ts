const target_tauri = true

export const api_proxy_addr = "http://172.20.10.2:8000"
export const img_proxy_addr = "http://172.20.10.2:9000"
export const dest_api = (target_tauri) ? api_proxy_addr : "/datacenter-services"
export const dest_img =  (target_tauri) ?  img_proxy_addr : "img-proxy"
export const dest_root = (target_tauri) ? "/" : "/"