import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/timeline', { replace: true });
  }, [navigate]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-bg text-text text-sm font-semibold">
      <span>Redirecting to your journey timeline...</span>
    </div>
  );
}
