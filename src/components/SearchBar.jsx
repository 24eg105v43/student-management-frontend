import React from 'react';
import { Search, X, Filter, ArrowUpDown } from 'lucide-react';

export default function SearchBar({
  searchTerm,
  onSearchChange,
  onClearSearch,
  selectedBranch,
  onBranchChange,
  sortBy,
  onSortChange,
  branches,
  isSearchingRollOnly,
  onToggleRollOnly,
}) {
  return (
    <div className="control-bar" id="student-search-controls">
      {/* Search Input Section */}
      <div className="search-section">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={
              isSearchingRollOnly
                ? 'Search exact Roll Number (e.g. 2024CSE101)...'
                : 'Search by Roll No, Name, or Branch...'
            }
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            id="student-search-input"
            autoComplete="off"
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={onClearSearch}
              title="Clear search"
              id="clear-search-btn"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Toggle Exact Roll Number Search */}
        <button
          className={`btn btn-sm ${isSearchingRollOnly ? 'btn-primary' : 'btn-secondary'}`}
          onClick={onToggleRollOnly}
          title="Toggle search exclusively by Roll Number"
          id="toggle-roll-search-btn"
        >
          {isSearchingRollOnly ? 'Roll No Only' : 'All Fields'}
        </button>
      </div>

      {/* Filter and Sorting Section */}
      <div className="filter-section">
        {/* Branch Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Filter size={15} color="#94a3b8" />
          <select
            className="select-filter"
            value={selectedBranch}
            onChange={(e) => onBranchChange(e.target.value)}
            id="branch-filter-select"
            aria-label="Filter by branch"
          >
            <option value="ALL">All Branches</option>
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowUpDown size={15} color="#94a3b8" />
          <select
            className="select-filter"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            id="sort-by-select"
            aria-label="Sort students by"
          >
            <option value="ID_DESC">Newest First</option>
            <option value="ROLL_ASC">Roll Number (A - Z)</option>
            <option value="ROLL_DESC">Roll Number (Z - A)</option>
            <option value="NAME_ASC">Name (A - Z)</option>
            <option value="MARKS_DESC">Highest Marks First</option>
            <option value="MARKS_ASC">Lowest Marks First</option>
          </select>
        </div>
      </div>
    </div>
  );
}
