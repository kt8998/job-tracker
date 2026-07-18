import { StatsResponse } from '../types';

interface StatsCardsProps {
  stats: StatsResponse | undefined;
}

const CARDS: { key: keyof StatsResponse; label: string; accent: string }[] = [
  { key: 'total', label: 'Total', accent: 'text-gray-900' },
  { key: 'APPLIED', label: 'Applied', accent: 'text-blue-600' },
  { key: 'INTERVIEWING', label: 'Interviewing', accent: 'text-yellow-600' },
  { key: 'OFFER', label: 'Offers', accent: 'text-green-600' },
  { key: 'REJECTED', label: 'Rejected', accent: 'text-gray-500' },
];

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {CARDS.map(({ key, label, accent }) => (
        <div
          key={key}
          className="bg-white rounded-lg border border-gray-200 px-4 py-3"
        >
          <p className={`text-2xl font-bold ${accent}`}>
            {stats ? stats[key] : '–'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
