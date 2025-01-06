// 处理所有 HTTP 方法
export const onRequest = async (context) => {
  const { request, env } = context;
  
  // 确保环境变量存在
  if (!env.API_BASEURL) {
    return new Response('API_BASEURL environment variable is not set', { status: 500 });
  }

  try {
    // 构建目标URL
    const url = new URL(request.url);
    const apiBaseUrl = env.API_BASEURL.endsWith('/') ? env.API_BASEURL.slice(0, -1) : env.API_BASEURL;
    const targetURL = apiBaseUrl + url.pathname + url.search;

    // 处理 WebSocket 升级请求
    if (request.headers.get('Upgrade') === 'websocket') {
      const wsURL = targetURL.replace(/^http/, 'ws');
      return fetch(wsURL, request);
    }

    // 创建新的请求
    const newRequest = new Request(targetURL, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow',
    });

    // 发送请求到目标服务器
    const response = await fetch(newRequest);

    // 创建新的响应
    const newResponse = new Response(response.body, response);
    
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

// 处理 OPTIONS 请求
export const onRequestOptions = async (context) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400',
    },
  });
} 