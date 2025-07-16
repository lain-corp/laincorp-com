import React, { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';

export default function LoginButton() {
  const [principal, setPrincipal] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const client = await AuthClient.create();
      const isAuthenticated = await client.isAuthenticated();
      if (isAuthenticated) {
        const identity = client.getIdentity();
        setPrincipal(identity.getPrincipal().toText());
      }
    })();
  }, []);

  const handleLogin = async () => {
    const client = await AuthClient.create();
    await client.login({
      identityProvider: 'https://identity.ic0.app/#authorize',
      onSuccess: async () => {
        const identity = client.getIdentity();
        setPrincipal(identity.getPrincipal().toText());
      },
    });
  };

  return (
    <div>
      {principal ? (
        <p>👤 {principal}</p>
      ) : (
        <button onClick={handleLogin}>Login with Internet Identity</button>
      )}
    </div>
  );
}
