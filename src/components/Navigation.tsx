'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NavigationProps {
  isMobile: boolean;
}

const Navigation = ({ isMobile }: NavigationProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: '/', label: 'Αρχική', key: 'home', icon: 'home' },
    { href: '/discuss', label: 'Συζήτηση', key: 'discuss', icon: 'comments' },
    { href: '/prs', label: 'Προτάσεις', key: 'prs', icon: 'file alternate' },
    { href: '/issues', label: 'Αναφορές', key: 'issues', icon: 'bug' },
    { href: '/settings', label: 'Ρυθμίσεις', key: 'settings', icon: 'cog' },
    { href: '/about', label: 'Σχετικά', key: 'about', icon: 'info circle' },
  ];

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMobile]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <>
        <div className="ui top fixed menu">
          <a className="item" onClick={() => setIsOpen(!isOpen)}>
            <span>
              <i className="bars icon"></i>
              Μενού
            </span>

          </a>
        </div>

        <div style={{ height: '42px' }}></div>
        {isOpen && (
          <div
            className="ui dimmer active"
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              zIndex: 100,
              backgroundColor: 'rgba(0,0,0,0.85)'
            }}
          />
        )}

        <div
          style={{
            position: 'fixed',
            top: 0,
            left: isOpen ? 0 : '-100vw',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'white',
            zIndex: 101,
            transition: 'left 0.3s ease',
            overflowY: 'auto',
            margin: 0,
            padding: 0
          }}
        >
          <div style={{ padding: '1rem', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'left', marginBottom: '1rem' }}>
              <div className="ui header">
                <span>
                  <i className="list icon"></i>
                  Πλοήγηση
                </span>
              </div>
              <i
                className="close icon"
                onClick={() => setIsOpen(false)}
                style={{ cursor: 'pointer', fontSize: '1.5rem' }}
              />
            </div>
            <div className="ui vertical menu icon" style={{ width: '100%', border: 'none', boxShadow: 'none' }}>
              {menuItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`item ${pathname === item.href ? 'active' : ''}`}
                  onClick={handleLinkClick}
                  style={{textAlign: 'left'}}
                >
                  <span>
                    <i className={`icon ${item.icon}`}></i>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="ui pointing menu labeled icon fluid centered">
      {menuItems.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`item ${pathname === item.href ? 'active' : ''}`}
        >
          <span>
            <i className={`icon ${item.icon}`}></i>
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default Navigation;