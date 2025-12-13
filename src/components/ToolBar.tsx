"use client";
import React, { useEffect } from 'react';

declare global {
  interface Window {
    $: ((selector: string) => {
      dropdown: (action?: string | object) => void;
    }) & {
      (callback: () => void): void;
    };
  }
}

export default function ToolBar() {
  useEffect(() => {
    // Initialize Fomantic UI dropdown
    if (typeof window !== 'undefined' && window.$) {
      window.$('.ui.dropdown').dropdown();
    }
  }, []);

  return (
    <div className='ui segment'>
      <div className="ui floating dropdown labeled icon button">
        <i className="code branch icon"></i>
        <span className="text">Κλάδοι</span>
        <div className="menu">
          <div className="scrolling menu">
            <div className="item">

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}