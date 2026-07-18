import { JobApplication } from '../types';
import StatusBadge from './StatusBadge';

interface ApplicationCardProps {
  application: JobApplication;
  onEdit: () => void;
  onDelete: () => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const ApplicationCard = ({
  application,
  onEdit,
  onDelete,
}: ApplicationCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-gray-900">{application.company}</h3>
          <StatusBadge status={application.status} />
        </div>
        <p className="text-sm text-gray-600 mt-0.5">{application.role}</p>
        <p className="text-xs text-gray-400 mt-1">
          Applied {formatDate(application.appliedDate)}
          {application.location && ` · ${application.location}`}
          {application.salary !== null &&
            ` · ₹${application.salary.toLocaleString('en-IN')}/yr`}
        </p>
        {application.notes && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {application.notes}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {application.jobUrl && (
          <a
            href={application.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            Job link
          </a>
        )}
        <button
          onClick={onEdit}
          className="text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-sm text-red-500 hover:text-red-700 font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
