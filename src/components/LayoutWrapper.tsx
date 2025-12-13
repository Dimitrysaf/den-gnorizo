'use client';

import { useEffect, useState } from 'react';
import Navigation from './Navigation';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="ui container" style={{ marginTop: '0', marginBottom: '20px', padding: '0' }}>
        <Navigation isMobile={true} />
        <h1 className="ui header" style={{ padding: '1rem 0.5rem' }}>Α` Συντακτική Βουλή των Πολιτών</h1>
        <div style={{ padding: '0 0.5rem' }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="ui container" style={{ marginTop: '20px', marginBottom: '20px' }}>
      <h1 className="ui header">Α` Συντακτική Βουλή των Πολιτών</h1>
      <Navigation isMobile={false} />
      <div className="ui segment">
        {children}
      </div>
    </div>
  );
}