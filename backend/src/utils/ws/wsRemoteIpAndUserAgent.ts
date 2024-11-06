import WebSocket from 'ws';
import http from 'http';
import RemoteIpAndUserAgent from '../../types/RemoteIpAndUserAgent';
import {Request} from 'express';

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

const remoteIpAndUserAgent = (req: Request) => {
	return {
		ipAddr: (req.headers['CF-Connecting-IP'] ??
			req.headers['x-forwarded-for'] ??
			req.connection.remoteAddress ??
			'') as string,
		userAgent: (req.headers['user-agent'] ??
			(req.headers['User-Agent'] as string) ??
			req.get('User-Agent') ??
			'') as string,
	};
};

export {remoteIpAndUserAgent};

export default wsRemoteIpAndUserAgent;
