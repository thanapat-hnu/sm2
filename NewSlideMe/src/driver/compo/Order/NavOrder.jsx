import { useState } from 'react';
import './NavOrder.css';

function NavOrder({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'process', label: 'กำลังดำเนินการ' },
    { id: 'success', label: 'เสร็จสิ้น' },
    { id: 'fail', label: 'ยกเลิก' }
  ];

  return (
    <nav className="nav-order">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
          {tab.id === 'process' && <span className="tab-badge">2</span>}
        </button>
      ))}
    </nav>
  );
}

export default NavOrder;