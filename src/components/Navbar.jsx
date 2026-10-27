import React from 'react';
import { GraduationCap, Plus, RefreshCw, Database, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar({ onOpenAddModal, totalCount, isDbConnected, onRefresh, isRefreshing }) {
  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="navbar-container">
        {/* Brand */}
        <div className="brand-wrapper">
          <div className="brand-icon">
            <GraduationCap size={26} strokeWidth={2.2} />
          </div>
          <div className="brand-text">
            <h1>
              EduRecord <span className="brand-tag">SRMS v1.0</span>
            </h1>
            <div className="brand-subtitle">
              Student Record Management System &bull; College Administration
            </div>
          </div>
        </div>

        {/* Actions & Status */}
        <div className="navbar-actions">
          {/* Database Connection Status */}
          <div
            className={`status-badge ${isDbConnected ? '' : 'error'}`}
            title={isDbConnected ? 'Connected to MySQL Database: student_management' : 'Connecting to Spring Boot Backend...'}
          >
            <span className="status-dot"></span>
            <Database size={13} />
            <span>{isDbConnected ? 'MySQL Connected' : 'Backend Connecting'}</span>
          </div>

          {/* Quick Refresh */}
          <button
            className="btn btn-secondary btn-icon"
            onClick={onRefresh}
            title="Refresh student records"
            disabled={isRefreshing}
            id="refresh-btn"
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin-anim' : ''} />
          </button>

          {/* Add Student Primary Button */}
          <button
            className="btn btn-primary"
            onClick={onOpenAddModal}
            id="open-add-student-btn"
          >
            <Plus size={18} strokeWidth={2.4} />
            <span>Add Student</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
