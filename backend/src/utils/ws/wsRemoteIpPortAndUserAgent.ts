import WebSocket from 'ws';
import http from 'http';
import RemoteIpPortAndUserAgent from '../../types/RemoteIpPortAndUserAgent';

const wsRemoteIpPortAndUserAgent = (ws: WebSocket, request: http.IncomingMessage): RemoteIpPortAndUserAgent => {
	return {
		ipAddr: request.headers['CF-Connecting-IP'] ??
			request.headers['x-forwarded-for'] ??
			(ws as any)._socket.remoteAddress ??
			'',
		remotePort: (ws as any)._socket.remotePort ??
			0,
		userAgent: request.headers['user-agent'] ??
			(request.headers['User-Agent'] as string) ??
			'',
	};
};

export default wsRemoteIpPortAndUserAgent;
