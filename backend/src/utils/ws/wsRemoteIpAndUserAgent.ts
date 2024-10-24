import WebSocket from 'ws';
import http from 'http';
import RemoteIpAndUserAgent from '../../types/RemoteIpAndUserAgent';

const wsRemoteIpAndUserAgent = (ws: WebSocket, request: http.IncomingMessage): RemoteIpAndUserAgent => {
	return {
		ipAddr: request.headers['CF-Connecting-IP'] ??
			request.headers['x-forwarded-for'] ??
			(ws as any)._socket.remoteAddress ??
			'',
		userAgent: request.headers['user-agent'] ??
			(request.headers['User-Agent'] as string) ??
			'',
	};
};

export default wsRemoteIpAndUserAgent;
