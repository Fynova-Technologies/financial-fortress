
// import React, { useState } from 'react';
// import { useAuth0 } from '@auth0/auth0-react';

// export default function VerifyEmailPage() {
//   const { user, getAccessTokenSilently, logout } = useAuth0();
//   const [status, setStatus] = useState('idle');

//   async function handleResend() {
//     setStatus('sending');
//     try {
//       const token = await getAccessTokenSilently({
//         // audience: import.meta.env.VITE_AUTH0_AUDIENCE || 'https://dev-l0cnkmnrn4reomjc.us.auth0.com/api/v2/',
//         audience: 'https://dev-l0cnkmnrn4reomjc.us.auth0.com/api/v2/',
//       });

//       const res = await fetch('/api/auth/resend-verification', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!res.ok) throw new Error('Failed to request resend');
//       const data = await res.json();
//       console.log('resend response', data);
//       setStatus('sent');
//     } catch (err) {
//       console.error(err);
//       setStatus('error');
//     }
//   }

//   return (
//     <div style={{ maxWidth: 720, margin: '2rem auto', padding: '1rem' }}>
//       <h1>Verify your email</h1>
//       <p>
//         We sent a verification link to <strong>{user?.email}</strong>. Please check your inbox and click the link.
//       </p>

//       <div style={{ marginTop: 20 }}>
//         <button onClick={handleResend} disabled={status === 'sending'}>
//           {status === 'sending' ? 'Sending...' : 'Resend verification email'}
//         </button>
//         <div style={{ marginTop: 12 }}>
//           {status === 'sent' && <span>Verification email resent — check your inbox.</span>}
//           {status === 'error' && <span>Could not resend. Try again later.</span>}
//         </div>
//       </div>

//       <div style={{ marginTop: 24 }}>
//         <button onClick={() => logout({ returnTo: window.location.origin })}>Log out</button>
//       </div>

//       <hr style={{ marginTop: 30 }} />
//       <p style={{ color: '#666' }}>
//         Note: After clicking the verification link in your email, sign out and sign in again, or refresh your access token so the app receives updated claims.
//       </p>
//     </div>
//   );
// }