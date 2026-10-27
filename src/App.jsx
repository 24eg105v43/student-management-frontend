import React, { useState, useEffect, useMemo, useCallback } from 'react';
import studentService from './services/studentService';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import SearchBar from './components/SearchBar';
import StudentTable from './components/StudentTable';
import StudentModal from './components/StudentModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';

export default function App() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search & Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchingRollOnly, setIsSearchingRollOnly] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [sortBy, setSortBy] = useState('ID_DESC');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch all students, stats, and live count from Spring Boot backend
  const fetchData = useCallback(async (showToast = false) => {
    try {
      const [studentsRes, statsRes, countRes] = await Promise.all([
        studentService.getAll(),
        studentService.getStats(),
        studentService.getCount(),
      ]);

      if (studentsRes.success) {
        setStudents(studentsRes.data || []);
      }
      if (statsRes.success) {
        setStats(statsRes.data || null);
      }
      if (countRes.success) {
        setTotalCount(countRes.data || 0);
      }

      setIsDbConnected(true);
      if (showToast) {
        addToast('success', 'Records Synchronized', 'Latest student records fetched from MySQL.');
      }
    } catch (err) {
      console.error('Failed to connect to backend REST API:', err);
      setIsDbConnected(false);
      addToast(
        'error',
        'Connection Error',
        'Could not connect to Spring Boot backend. Ensure backend is running on port 8080.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData(true);
  };

  // Distinct branch list for filtering
  const availableBranches = useMemo(() => {
    const set = new Set();
    students.forEach((s) => {
      if (s.branch) set.add(s.branch);
    });
    return Array.from(set).sort();
  }, [students]);

  // Existing roll numbers for client-side duplicate prevention
  const existingRollNumbers = useMemo(() => {
    return students.map((s) => s.rollNumber);
  }, [students]);

  // Client-side filtering & sorting
  const filteredAndSortedStudents = useMemo(() => {
    let result = [...students];

    // Branch Filter
    if (selectedBranch !== 'ALL') {
      result = result.filter(
        (s) => s.branch && s.branch.toLowerCase() === selectedBranch.toLowerCase()
      );
    }

    // Search Term Filter
    if (searchTerm.trim()) {
      const query = searchTerm.trim().toLowerCase();
      if (isSearchingRollOnly) {
        // Roll number search
        result = result.filter(
          (s) => s.rollNumber && s.rollNumber.toLowerCase().includes(query)
        );
      } else {
        // Multi-field search (Roll Number, Name, Branch)
        result = result.filter(
          (s) =>
            (s.rollNumber && s.rollNumber.toLowerCase().includes(query)) ||
            (s.name && s.name.toLowerCase().includes(query)) ||
            (s.branch && s.branch.toLowerCase().includes(query))
        );
      }
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'ROLL_ASC':
          return (a.rollNumber || '').localeCompare(b.rollNumber || '');
        case 'ROLL_DESC':
          return (b.rollNumber || '').localeCompare(a.rollNumber || '');
        case 'NAME_ASC':
          return (a.name || '').localeCompare(b.name || '');
        case 'MARKS_DESC':
          return (b.marks || 0) - (a.marks || 0);
        case 'MARKS_ASC':
          return (a.marks || 0) - (b.marks || 0);
        case 'ID_DESC':
        default:
          return (b.id || 0) - (a.id || 0);
      }
    });

    return result;
  }, [students, selectedBranch, searchTerm, isSearchingRollOnly, sortBy]);

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  // Open Delete Confirmation Modal
  const handleOpenDeleteModal = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  // Submit Handler for Add or Edit
  const handleModalSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingStudent && editingStudent.id) {
        // Update existing student
        const res = await studentService.update(editingStudent.id, formData);
        if (res.success) {
          addToast('success', 'Student Updated', `Record for ${formData.name} updated successfully.`);
          setIsModalOpen(false);
          fetchData();
        } else {
          addToast('error', 'Update Failed', res.message || 'Could not update student.');
        }
      } else {
        // Create new student
        const res = await studentService.create(formData);
        if (res.success) {
          addToast('success', 'Student Registered', `${formData.name} has been saved to MySQL!`);
          setIsModalOpen(false);
          fetchData();
        } else {
          addToast('error', 'Registration Failed', res.message || 'Could not save student.');
        }
      }
    } catch (err) {
      console.error('Error submitting student form:', err);
      const errMsg =
        err.response?.data?.message ||
        (err.response?.data?.data && Object.values(err.response.data.data)[0]) ||
        'An error occurred while saving the student.';
      addToast('error', 'Validation / Save Error', errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Delete Handler
  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      const res = await studentService.delete(studentToDelete.id);
      if (res.success) {
        addToast(
          'success',
          'Student Record Deleted',
          `Record for ${studentToDelete.name} (${studentToDelete.rollNumber}) deleted.`
        );
        setIsDeleteModalOpen(false);
        setStudentToDelete(null);
        fetchData();
      } else {
        addToast('error', 'Delete Failed', res.message || 'Could not delete record.');
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      const errMsg = err.response?.data?.message || 'Failed to delete student record.';
      addToast('error', 'Delete Error', errMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <Navbar
        onOpenAddModal={handleOpenAddModal}
        totalCount={totalCount}
        isDbConnected={isDbConnected}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* KPI & Stats Dashboard */}
        <StatsCards stats={stats} totalCount={totalCount} />

        {/* Search, Filter, and Controls Bar */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={() => setSearchTerm('')}
          selectedBranch={selectedBranch}
          onBranchChange={setSelectedBranch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          branches={availableBranches}
          isSearchingRollOnly={isSearchingRollOnly}
          onToggleRollOnly={() => setIsSearchingRollOnly((prev) => !prev)}
        />

        {/* Student Records Table */}
        <StudentTable
          students={filteredAndSortedStudents}
          isLoading={isLoading}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm('')}
          onOpenAddModal={handleOpenAddModal}
        />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            &copy; {new Date().getFullYear()} Student Record Management System &bull; Java Spring Boot &bull; React.js &bull; MySQL
          </div>
          <div>
            Database: <strong style={{ color: '#34d399' }}>MySQL (student_management)</strong> &bull; API Port: 8080 &bull; Frontend Port: 5173
          </div>
        </div>
      </footer>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingStudent}
        existingRollNumbers={existingRollNumbers}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        student={studentToDelete}
        isDeleting={isDeleting}
      />

      {/* Floating Toast Notification Alerts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
