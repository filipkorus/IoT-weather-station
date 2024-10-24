import RemoteIpAndUserAgent from './RemoteIpAndUserAgent';

type WebBrowserClient = {
	name: 'client'
} & RemoteIpAndUserAgent;

export default WebBrowserClient;
