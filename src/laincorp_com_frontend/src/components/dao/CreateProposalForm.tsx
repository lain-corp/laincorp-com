import React, { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { getStakedBalance } from '../../utils/ic-laincoin';

export default function CreateProposalForm() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    (async () => {
      const client = await AuthClient.create();
      if (await client.isAuthenticated()) {
        const identity = client.getIdentity();
        const p = identity.getPrincipal();
        setPrincipal(p);
        const staked = await getStakedBalance(p);
        setCanSubmit(staked > BigInt(0));
      }
    })();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Submitting proposal: "${title}"\n\n${desc}`);
    // TODO: Call canister to create proposal
    setTitle('');
    setDesc('');
  };

  if (!principal) return <p>🔐 Please login to create proposals.</p>;

  if (!canSubmit)
    return <p>🚫 You must stake LainCoin to create proposals.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ color: 'var(--vp-pink)', marginBottom: '1rem' }}>
        Create Proposal
      </h2>

      <input
        type="text"
        placeholder="Proposal Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
      />

      <textarea
        placeholder="Proposal Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        required
        rows={4}
        style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
      />

      <button type="submit">Submit Proposal</button>
    </form>
  );
}
