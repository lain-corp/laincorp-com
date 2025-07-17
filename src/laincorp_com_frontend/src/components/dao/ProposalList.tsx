import React, { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { getStakedBalance } from '../../utils/ic-laincoin';
import { Proposal } from '../../types/dao';

const mockProposals: Proposal[] = [
  {
    id: 1,
    title: 'Fund Project LAIN',
    description: 'Allocate 10,000 tokens to fund Project LAIN.',
    votesYes: 5,
    votesNo: 2,
    status: 'open',
  },
  {
    id: 2,
    title: 'Add dark mode',
    description: 'Enable dark mode in LainCorp UI.',
    votesYes: 10,
    votesNo: 0,
    status: 'approved',
  },
];

export default function ProposalList() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [canVote, setCanVote] = useState(false);

  useEffect(() => {
    setProposals(mockProposals);

    (async () => {
      const client = await AuthClient.create();
      if (await client.isAuthenticated()) {
        const identity = client.getIdentity();
        const p = identity.getPrincipal();
        setPrincipal(p);
        const staked = await getStakedBalance(p);
        setCanVote(staked > BigInt(0));
      }
    })();
  }, []);

  const handleVote = (id: number, vote: 'yes' | 'no') => {
    if (!canVote) {
      alert('🚫 You must stake LainCoin to vote.');
      return;
    }

    alert(`Voting "${vote}" on proposal #${id}`);
    // TODO: Call canister to cast vote
  };

  return (
    <div>
      <h2 style={{ color: 'var(--vp-yellow)', marginBottom: '1rem' }}>
        Proposals
      </h2>

      {proposals.map((p) => (
        <div
          key={p.id}
          style={{
            border: '2px solid var(--vp-blue)',
            padding: '1rem',
            marginBottom: '1.5rem',
            borderRadius: '0.5rem',
          }}
        >
          <h3 style={{ color: 'var(--vp-neon)' }}>{p.title}</h3>
          <p>{p.description}</p>
          <p>Status: <strong>{p.status}</strong></p>
          <p>✅ {p.votesYes} | ❌ {p.votesNo}</p>

          {p.status === 'open' && canVote && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => handleVote(p.id, 'yes')}>Vote Yes</button>
              <button onClick={() => handleVote(p.id, 'no')}>Vote No</button>
            </div>
          )}

          {p.status === 'open' && !canVote && (
            <p style={{ color: 'var(--vp-pink)' }}>
              🔒 You must stake LainCoin to vote.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
