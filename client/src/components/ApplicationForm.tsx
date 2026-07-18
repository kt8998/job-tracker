import { useState, FormEvent } from 'react';
import { JobApplication, ApplicationInput, Status } from '../types';
import {
  useCreateApplication,
  useUpdateApplication,
} from '../hooks/useApplications';
import Input from './Input';
import Button from './Button';

const STATUS_OPTIONS: Status[] = ['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED'];

interface ApplicationFormProps {
  existing: JobApplication | null;
  onClose: () => void;
}

const ApplicationForm = ({ existing, onClose }: ApplicationFormProps) => {
  const [company, setCompany] = useState(existing?.company ?? '');
  const [role, setRole] = useState(existing?.role ?? '');
  const [status, setStatus] = useState<Status>(existing?.status ?? 'APPLIED');
  const [jobUrl, setJobUrl] = useState(existing?.jobUrl ?? '');
  const [location, setLocation] = useState(existing?.location ?? '');
  const [salary, setSalary] = useState(existing?.salary?.toString() ?? '');
  const [appliedDate, setAppliedDate] = useState(
    existing
      ? existing.appliedDate.slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState(existing?.notes ?? '');

  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication();
  const activeMutation = existing ? updateMutation : createMutation;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const input: ApplicationInput = {
      company: company.trim(),
      role: role.trim(),
      status,
      jobUrl: jobUrl.trim(),
      ...(location.trim() && { location: location.trim() }),
      ...(salary && { salary: Number(salary) }),
      ...(appliedDate && { appliedDate }),
      ...(notes.trim() && { notes: notes.trim() }),
    };

    if (existing) {
      updateMutation.mutate({ id: existing.id, input }, { onSuccess: onClose });
    } else {
      createMutation.mutate(input, { onSuccess: onClose });
    }
  };

  const errorData = (activeMutation.error as any)?.response?.data;
  const errorMessage =
    errorData?.errors?.[0]?.message || errorData?.message || null;

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="company"
        label="Company *"
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        required
      />
      <Input
        id="role"
        label="Role *"
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      />

      <div className="mb-4">
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <Input
        id="appliedDate"
        label="Applied date"
        type="date"
        value={appliedDate}
        onChange={(e) => setAppliedDate(e.target.value)}
      />
      <Input
        id="jobUrl"
        label="Job URL"
        type="url"
        placeholder="https://..."
        value={jobUrl}
        onChange={(e) => setJobUrl(e.target.value)}
      />
      <Input
        id="location"
        label="Location"
        type="text"
        placeholder="e.g. Bangalore / Remote"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <Input
        id="salary"
        label="Salary (per year)"
        type="number"
        min={1}
        placeholder="e.g. 1200000"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
      />

      <div className="mb-4">
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          maxLength={2000}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {errorMessage && (
        <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
      )}

      <Button type="submit" isLoading={activeMutation.isPending}>
        {existing ? 'Save changes' : 'Add application'}
      </Button>
    </form>
  );
};

export default ApplicationForm;
