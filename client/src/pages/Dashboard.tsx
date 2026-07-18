import { useState, useEffect } from 'react';
import { JobApplication, Status } from '../types';
import {
  useApplications,
  useStats,
  useDeleteApplication,
} from '../hooks/useApplications';
import Navbar from '../components/Navbar';
import StatsCards from '../components/StatsCards';
import ApplicationCard from '../components/ApplicationCard';
import ApplicationForm from '../components/ApplicationForm';
import Modal from '../components/Modal';

const PAGE_SIZE = 10;

const Dashboard = () => {
  const [statusFilter, setStatusFilter] = useState<Status | ''>('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [formTarget, setFormTarget] = useState<JobApplication | 'new' | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<JobApplication | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filters = {
    ...(statusFilter && { status: statusFilter }),
    ...(search && { search }),
    page,
    limit: PAGE_SIZE,
  };

  const { data, isLoading, isError, refetch } = useApplications(filters);
  const { data: stats } = useStats();
  const deleteMutation = useDeleteApplication();

  useEffect(() => {
    if (data && data.applications.length === 0 && page > 1) {
      setPage((p) => p - 1);
    }
  }, [data, page]);

  const hasFilters = Boolean(statusFilter || search);
  const applications = data?.applications ?? [];
  const pagination = data?.pagination;

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-6">
        <StatsCards stats={stats} />

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="text"
            placeholder="Search company or role..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as Status | '');
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All statuses</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEWING">Interviewing</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button
            onClick={() => setFormTarget('new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            + Add application
          </button>
        </div>

        {isLoading && (
          <p className="text-center text-gray-500 py-12">
            Loading applications...
          </p>
        )}

        {isError && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-3">
              Couldn't load your applications.
            </p>
            <button
              onClick={() => refetch()}
              className="text-sm text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && applications.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
            {hasFilters ? (
              <p className="text-gray-500">
                No applications match your filters.
              </p>
            ) : (
              <>
                <p className="text-gray-700 font-medium mb-1">
                  No applications yet
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Track your first job application to get started.
                </p>
                <button
                  onClick={() => setFormTarget('new')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                >
                  + Add application
                </button>
              </>
            )}
          </div>
        )}

        {applications.length > 0 && (
          <div className="space-y-3">
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onEdit={() => setFormTarget(app)}
                onDelete={() => setDeleteTarget(app)}
              />
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= pagination.totalPages}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {formTarget !== null && (
        <Modal
          title={formTarget === 'new' ? 'Add application' : 'Edit application'}
          onClose={() => setFormTarget(null)}
        >
          <ApplicationForm
            existing={formTarget === 'new' ? null : formTarget}
            onClose={() => setFormTarget(null)}
          />
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete application" onClose={() => setDeleteTarget(null)}>
          <p className="text-gray-700 mb-5">
            Delete your application to{' '}
            <span className="font-semibold">{deleteTarget.company}</span> for{' '}
            <span className="font-semibold">{deleteTarget.role}</span>? This
            can't be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              className="flex-1 py-2 border border-gray-300 rounded-md font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:bg-red-300"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
