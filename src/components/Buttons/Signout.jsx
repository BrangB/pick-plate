"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import cookie from 'cookie';

const Signout = () => {
  const router = useRouter();

  const handleSignout = () => {
    // Delete cookies
    document.cookie = cookie.serialize('token', '', { maxAge: -1 });
    document.cookie = cookie.serialize('role', '', { maxAge: -1 });

    // Redirect to login or home page
    router.push('/auth/login'); // Adjust the path as needed
  };

  return (
    <button onClick={handleSignout} className="signout-button">
      Sign Out
    </button>
  );
};

export default Signout;
