import React from 'react';
import { Edit3, Trash2, SearchX, Award, BookOpen, AlertCircle } from 'lucide-react';

// Generates consistent distinct avatar colors based on student name
const AVATAR_PALETTES = [
  { bg: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)' },
  { bg: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' },
  { bg: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)' },
  { bg: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' },
  { bg: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)' },
  { bg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' },
];

function getAvatarStyle(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
}

function getInitials(name) {
  if (!name) return 'S';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

function getGradeClass(grade) {
  switch (grade) {
    case 'A+':
      return 'grade-aplus';
    case 'A':
      return 'grade-a';
    case 'B':
      return 'grade-b';
    case 'C':
      return 'grade-c';
    case 'D':
      return 'grade-d';
    default:
      return 'grade-f';
  }
}

function getMarksBarColor(marks) {
  if (marks >= 80) return 'linear-gradient(90deg, #10b981, #34d399)';
  if (marks >= 60) return 'linear-gradient(90deg, #3b82f6, #60a5fa)';
  if (marks >= 40) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
  return 'linear-gradient(90deg, #ef4444, #f87171)';
}

export default function StudentTable({
  students,
  isLoading,
  onEdit,
  onDelete,
  searchTerm,
  onClearSearch,
  onOpenAddModal,
}) {
  return (
    <div className="table-card" id="student-table-container">
      {/* Table Header Bar */}
      <div className="table-header-bar">
        <div className="table-header-title">
          <BookOpen size={20} color="#818cf8" />
          <h2>Student Records</h2>
          <span className="badge-counter" id="table-record-count">
            {students.length} {students.length === 1 ? 'Record' : 'Records'}
          </span>
        </div>
      </div>

      {/* Table / Empty State */}
      {students.length === 0 ? (
        <div className="empty-state" id="no-students-state">
          <div className="empty-icon-wrap">
            <SearchX size={34} />
          </div>
          {searchTerm ? (
            <>
              <h3>No matching student found</h3>
              <p>
                No student matched your search for{' '}
                <strong style={{ color: '#fff' }}>"{searchTerm}"</strong>. Check the roll number or search term.
              </p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={onClearSearch}
                id="empty-clear-btn"
              >
                Clear Search Filter
              </button>
            </>
          ) : (
            <>
              <h3>No student records yet</h3>
              <p>
                Get started by registering your first student with their roll number, branch, and marks.
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={onOpenAddModal}
                id="empty-add-btn"
              >
                Add First Student
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="students-table" id="students-data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Student Details</th>
                <th>Roll Number</th>
                <th>Branch</th>
                <th>Marks (0 - 100)</th>
                <th style={{ textAlign: 'center' }}>Grade</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const avatarStyle = getAvatarStyle(student.name);
                const initials = getInitials(student.name);
                const gradeClass = getGradeClass(student.grade);
                const barColor = getMarksBarColor(student.marks);

                return (
                  <tr key={student.id} id={`student-row-${student.id}`}>
                    {/* Index */}
                    <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                      {index + 1}
                    </td>

                    {/* Student Name & Avatar */}
                    <td>
                      <div className="student-profile">
                        <div
                          className="avatar"
                          style={{ background: avatarStyle.bg }}
                          title={student.name}
                        >
                          {initials}
                        </div>
                        <div>
                          <div className="student-name-text">{student.name}</div>
                          <div className="student-meta">ID #{student.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Roll Number */}
                    <td>
                      <span className="roll-pill" title="Unique Roll Number">
                        {student.rollNumber}
                      </span>
                    </td>

                    {/* Branch */}
                    <td>
                      <span className="branch-tag">{student.branch}</span>
                    </td>

                    {/* Marks Bar */}
                    <td>
                      <div className="marks-visual">
                        <div className="marks-value-display">
                          <span>{student.marks} / 100</span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              color: student.marks >= 40 ? '#34d399' : '#f87171',
                            }}
                          >
                            {student.marks >= 40 ? 'PASS' : 'FAIL'}
                          </span>
                        </div>
                        <div className="progress-bar-bg">
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${Math.min(Math.max(student.marks, 0), 100)}%`,
                              background: barColor,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Grade */}
                    <td style={{ textAlign: 'center' }}>
                      <span className={`grade-badge ${gradeClass}`} title={`Grade: ${student.grade}`}>
                        {student.grade || 'N/A'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="row-actions">
                        <button
                          className="action-btn edit"
                          onClick={() => onEdit(student)}
                          title="Edit student details"
                          id={`edit-btn-${student.id}`}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => onDelete(student)}
                          title="Delete student record"
                          id={`delete-btn-${student.id}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
