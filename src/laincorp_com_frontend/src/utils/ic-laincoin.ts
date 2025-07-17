import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../declarations/laincorp_com_backend'; // Adjust this
import { Principal } from '@dfinity/principal';

const agent = new HttpAgent({
  host: 'https://ic0.app', // or 'http://localhost:4943' for local dev
});

// If on local dev, uncomment this:
await agent.fetchRootKey();

const LAINCOIN_CANISTER_ID = 'ufxgi-4p777-77774-qaadq-cai';

export const LainCoin = Actor.createActor(idlFactory, {
  agent,
  canisterId: LAINCOIN_CANISTER_ID,
});

export async function getStakedBalance(principal: Principal): Promise<bigint> {
  const result = await LainCoin.getStakedBalance({ owner: principal });
  return result?.amount || BigInt(0);
}
