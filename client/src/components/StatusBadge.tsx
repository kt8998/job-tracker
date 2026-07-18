import { Status } from '../types';

const STATUS_STYLES: Record<Status, string> = {
  APPLIED: 'bg-blue-100 text-blue-700',
  INTERVIEWING: 'bg-yellow-100 text-yellow-800',
  OFFER: 'bg-green-100 text-green-700',
  REJECTED: 'bg-gray-200 text-gray-600',
};

const STATUS_LABELS: Record<Status, string> = {
  APPLIED: 'Applied',
  INTERVIEWING: 'Interviewing',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
};

const StatusBadge = ({ status }: { status: Status }) => {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
};

export default StatusBadge;
