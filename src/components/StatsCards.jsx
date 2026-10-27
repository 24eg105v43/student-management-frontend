import React from 'react';
import { Users, Award, TrendingUp, CheckCircle, BarChart3 } from 'lucide-react';

export default function StatsCards({ stats, totalCount }) {
  const cards = [
    {
      label: 'Registered Students',
      value: totalCount ?? stats?.totalStudents ?? 0,
      subtext: 'Active records in MySQL',
      icon: Users,
      iconColor: '#6366f1',
      iconBg: 'rgba(99, 102, 241, 0.15)',
      accentColor: '#6366f1',
    },
    {
      label: 'Class Average',
      value: stats?.averageMarks ? `${stats.averageMarks}%` : '0%',
      subtext: 'Across all departments',
      icon: TrendingUp,
      iconColor: '#06b6d4',
      iconBg: 'rgba(6, 182, 212, 0.15)',
      accentColor: '#06b6d4',
    },
    {
      label: 'Highest Score',
      value: stats?.highestMarks !== undefined ? `${stats.highestMarks}/100` : '0/100',
      subtext: 'Peak performance record',
      icon: Award,
      iconColor: '#10b981',
      iconBg: 'rgba(16, 185, 129, 0.15)',
      accentColor: '#10b981',
    },
    {
      label: 'Passing Rate',
      value: stats?.passPercentage !== undefined ? `${stats.passPercentage}%` : '0%',
      subtext: 'Students scoring ≥ 40',
      icon: CheckCircle,
      iconColor: '#8b5cf6',
      iconBg: 'rgba(139, 92, 246, 0.15)',
      accentColor: '#8b5cf6',
    },
  ];

  return (
    <div className="stats-grid" id="stats-dashboard">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="stat-card"
            style={{
              '--card-accent': card.accentColor,
              '--icon-bg': card.iconBg,
              '--icon-color': card.iconColor,
            }}
          >
            <div className="stat-icon-wrapper">
              <Icon size={26} strokeWidth={2.2} />
            </div>
            <div className="stat-info">
              <div className="stat-label">{card.label}</div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-subtext">{card.subtext}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
