export async function onRequest(context) {
  const { request, env } = context;
  
  // 获取原始URL并解析路径
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 确保环境变量存在
  if (!env.API_BASEURL) {
    return new Response('API_BASEURL environment variable is not set', { status: 500 });
  }
  
  // 处理 WebSocket 升级请求
  if (request.headers.get('Upgrade') === 'websocket') {
    const apiBaseUrl = new URL(env.API_BASEURL);
    // 将 http/https 转换为 ws/wss
    const wsBaseUrl = `${apiBaseUrl.protocol === 'https:' ? 'wss:' : 'ws:'}//${apiBaseUrl.host}`;
    const targetURL = `${wsBaseUrl}${path}${url.search}`;
    
    return fetch(new Request(targetURL, {
      method: request.method,
      headers: request.headers,
      body: request.body
    }));
  }
  
  // 处理普通 HTTP 请求
  const apiBaseUrl = new URL(env.API_BASEURL);
  const targetURL = new URL(path, apiBaseUrl.origin);
  targetURL.search = url.search;
  
  // 创建新的请求头，移除可能导致问题的头部
  const newHeaders = new Headers(request.headers);
  newHeaders.delete('host');
  newHeaders.delete('cf-connecting-ip');
  newHeaders.delete('cf-ipcountry');
  
  // 创建新的请求
  const newRequest = new Request(targetURL.toString(), {
    method: request.method,
    headers: newHeaders,
    body: request.body,
  });
  
  try {
    // 转发请求到目标服务器
    const response = await fetch(newRequest);
    
    // 创建新的响应头，设置 CORS 和其他必要的头部
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
    });
    
    // 复制所有响应头
    for (const [key, value] of response.headers.entries()) {
      newResponse.headers.set(key, value);
    }
    
    // 设置 CORS 头
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', '*');
    
    return newResponse;
  } catch (error) {
    return new Response(`Proxy error: ${error.message}`, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
