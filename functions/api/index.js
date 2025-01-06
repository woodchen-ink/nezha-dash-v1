export async function onRequest(context) {
  const { request, env } = context;
  
  // 获取原始URL并解析路径
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 确保环境变量存在
  if (!env.API_BASEURL) {
    return new Response('API_BASEURL environment variable is not set', { status: 500 });
  }
  
  // 构建目标URL
  const targetURL = new URL(path, env.API_BASEURL);
  
  // 保留原始查询参数
  targetURL.search = url.search;
  
  // 创建新的请求
  const newRequest = new Request(targetURL, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
  
  try {
    // 转发请求到目标服务器
    const response = await fetch(newRequest);
    
    // 创建新的响应对象，保留原始响应的状态和头部
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    return new Response(`Proxy error: ${error.message}`, { status: 500 });
  }
}
