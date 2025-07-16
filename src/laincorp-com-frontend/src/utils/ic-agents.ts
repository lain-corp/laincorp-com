import { HttpAgent } from '@dfinity/agent';

const agent = new HttpAgent({
  host: 'https://ic0.app',
});

export default agent;
