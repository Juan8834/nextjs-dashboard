import { CheckIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function InvoiceStatus({ status }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium capitalize',
        {
          'bg-yellow-100 text-yellow-700': status === 'pending',
          'bg-green-100 text-green-700': status === 'paid',
          'bg-red-100 text-red-700': status === 'late',
        },
      )}
    >
      {status === 'pending' && (
        <>
          <ClockIcon className="w-4" />
          Pending
        </>
      )}

      {status === 'paid' && (
        <>
          <CheckIcon className="w-4" />
          Paid
        </>
      )}

      {status === 'late' && (
        <>
          <ExclamationCircleIcon className="w-4" />
          Late
        </>
      )}
    </span>
  );
}
