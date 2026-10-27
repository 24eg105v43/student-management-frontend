import React, { useState, useEffect } from 'react';
import { X, User, Hash, GraduationCap, Award, AlertCircle, Check } from 'lucide-react';

const COMMON_BRANCHES = [
  'Computer Science',
  'Electronics & Comm',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology',
  'AI & Data Science',
  'Electrical Engineering',
  'Chemical Engineering',
  'Biotechnology',
];

function calculateGrade(marks) {
  const m = Number(marks);
  if (isNaN(m)) return 'N/A';
  if (m >= 90) return 'A+';
  if (m >= 80) return 'A';
  if (m >= 70) return 'B';
  if (m >= 60) return 'C';
  if (m >= 50) return 'D';
  return 'F';
}

export default function StudentModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  existingRollNumbers,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    branch: 'Computer Science',
    marks: 75,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const isEditing = Boolean(initialData && initialData.id);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        rollNumber: initialData.rollNumber || '',
        branch: initialData.branch || 'Computer Science',
        marks: initialData.marks !== undefined ? initialData.marks : 75,
      });
    } else {
      setFormData({
        name: '',
        rollNumber: '',
        branch: 'Computer Science',
        marks: 75,
      });
    }
    setErrors({});
    setTouched({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Validation function
  const validateField = (field, value) => {
    let err = '';

    if (field === 'name') {
      if (!value || !value.trim()) {
        err = 'Student name is required.';
      } else if (value.trim().length < 2) {
        err = 'Name must be at least 2 characters.';
      } else if (value.trim().length > 100) {
        err = 'Name cannot exceed 100 characters.';
      }
    }

    if (field === 'rollNumber') {
      const clean = (value || '').trim().toUpperCase();
      if (!clean) {
        err = 'Roll number is required.';
      } else if (!/^[A-Za-z0-9_-]+$/.test(clean)) {
        err = 'Roll number can only contain letters, numbers, hyphens, and underscores.';
      } else if (
        existingRollNumbers &&
        existingRollNumbers.some(
          (rn) =>
            rn.toUpperCase() === clean &&
            (!isEditing || rn.toUpperCase() !== (initialData?.rollNumber || '').toUpperCase())
        )
      ) {
        err = `Roll number '${clean}' is already registered to another student.`;
      }
    }

    if (field === 'branch') {
      if (!value || !value.trim()) {
        err = 'Branch is required.';
      }
    }

    if (field === 'marks') {
      if (value === '' || value === null || value === undefined) {
        err = 'Marks are required.';
      } else {
        const num = Number(value);
        if (isNaN(num)) {
          err = 'Marks must be a valid number.';
        } else if (num < 0 || num > 100) {
          err = 'Marks must be strictly between 0 and 100.';
        }
      }
    }

    return err;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const err = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all touched
    const allTouched = { name: true, rollNumber: true, branch: true, marks: true };
    setTouched(allTouched);

    const nameErr = validateField('name', formData.name);
    const rollErr = validateField('rollNumber', formData.rollNumber);
    const branchErr = validateField('branch', formData.branch);
    const marksErr = validateField('marks', formData.marks);

    const formErrors = {
      name: nameErr,
      rollNumber: rollErr,
      branch: branchErr,
      marks: marksErr,
    };

    setErrors(formErrors);

    if (nameErr || rollErr || branchErr || marksErr) {
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      rollNumber: formData.rollNumber.trim().toUpperCase(),
      branch: formData.branch.trim(),
      marks: Number(formData.marks),
    });
  };

  const liveGrade = calculateGrade(formData.marks);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h3>
            <GraduationCap size={22} color="#818cf8" />
            <span>{isEditing ? 'Edit Student Record' : 'Register New Student'}</span>
          </h3>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            id="close-modal-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} id="student-record-form" noValidate>
          <div className="modal-body">
            {/* Student Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="student-name-input">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="student-name-input"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="e.g. Aarav Sharma"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                required
              />
              {errors.name && (
                <div className="input-error-msg" id="name-error">
                  <AlertCircle size={14} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Roll Number */}
            <div className="form-group">
              <label className="form-label" htmlFor="student-roll-input">
                Roll Number <span className="required">* (Unique)</span>
              </label>
              <input
                type="text"
                id="student-roll-input"
                className={`form-input ${errors.rollNumber ? 'error' : ''}`}
                placeholder="e.g. 2024CSE101"
                value={formData.rollNumber}
                onChange={(e) => handleChange('rollNumber', e.target.value.toUpperCase())}
                onBlur={() => handleBlur('rollNumber')}
                required
              />
              {errors.rollNumber && (
                <div className="input-error-msg" id="roll-error">
                  <AlertCircle size={14} />
                  <span>{errors.rollNumber}</span>
                </div>
              )}
            </div>

            {/* Branch */}
            <div className="form-group">
              <label className="form-label" htmlFor="student-branch-select">
                Branch / Department <span className="required">*</span>
              </label>
              <select
                id="student-branch-select"
                className={`form-input select-filter ${errors.branch ? 'error' : ''}`}
                value={formData.branch}
                onChange={(e) => handleChange('branch', e.target.value)}
                onBlur={() => handleBlur('branch')}
                style={{ width: '100%' }}
                required
              >
                {COMMON_BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {errors.branch && (
                <div className="input-error-msg" id="branch-error">
                  <AlertCircle size={14} />
                  <span>{errors.branch}</span>
                </div>
              )}
            </div>

            {/* Marks & Live Grade */}
            <div className="form-group">
              <label className="form-label" htmlFor="student-marks-input">
                Marks Obtained (0 to 100) <span className="required">*</span>
              </label>

              <div className="marks-interactive-wrapper">
                <div className="marks-slider-row">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    className="marks-slider"
                    value={formData.marks === '' ? 0 : formData.marks}
                    onChange={(e) => handleChange('marks', Number(e.target.value))}
                    id="student-marks-slider"
                    aria-label="Marks slider"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    id="student-marks-input"
                    className={`form-input ${errors.marks ? 'error' : ''}`}
                    style={{ width: '85px', textAlign: 'center', fontWeight: '700' }}
                    value={formData.marks}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleChange('marks', val === '' ? '' : Number(val));
                    }}
                    onBlur={() => handleBlur('marks')}
                    required
                  />
                </div>

                {/* Live Grade Preview */}
                <div className="marks-badge-preview">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Calculated Grade:
                  </span>
                  <span
                    style={{
                      fontWeight: '700',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      background:
                        formData.marks >= 80
                          ? 'rgba(16, 185, 129, 0.2)'
                          : formData.marks >= 50
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(239, 68, 68, 0.2)',
                      color:
                        formData.marks >= 80
                          ? '#34d399'
                          : formData.marks >= 50
                          ? '#60a5fa'
                          : '#f87171',
                      border: '1px solid currentColor',
                    }}
                  >
                    {liveGrade}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {formData.marks >= 40 ? '✓ Passing marks' : '✗ Failing marks (< 40)'}
                  </span>
                </div>
              </div>

              {errors.marks && (
                <div className="input-error-msg" id="marks-error">
                  <AlertCircle size={14} />
                  <span>{errors.marks}</span>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
              id="cancel-modal-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              id="submit-student-btn"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : isEditing ? (
                <span>Save Changes</span>
              ) : (
                <span>Register Student</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
