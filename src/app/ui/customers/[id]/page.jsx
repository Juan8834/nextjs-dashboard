import { neon } from '@neondatabase/serverless';
import { notFound } from 'next/navigation';

async function getCustomerData(id) {
  const sql = neon(process.env.DATABASE_URL);

  const customerResult = await sql`
    SELECT id, name, email
    FROM customers
    WHERE id = ${id}
  `;

  if (!customerResult.length) return null;

  const invoices = await sql`
    SELECT id, amount, status, date
    FROM invoices
    WHERE customer_id = ${id}
    ORDER BY date DESC
  `;

  const totals = await sql`
    SELECT
      COUNT(*) AS total_invoices,
      COALESCE(SUM(amount), 0) AS total_amount
    FROM invoices
    WHERE customer_id = ${id}
  `;

  return {
    customer: customerResult[0],
    invoices,
    totals: totals[0],
  };
}

export default async function Page({ params }) {
  const data = await getCustomerData(params.id);

  if (!data) return notFound();

  const { customer, invoices, totals } = data;

  // 🔹 Calculate total paid (in cents)
  const totalPaid = invoices
    .filter((invoice) => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const balanceRemaining = totals.total_amount - totalPaid;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{customer.name}</h1>
        <p className="text-gray-500">{customer.email}</p>
      </div>

      {/* Summary Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="bg-blue-600 text-white p-4 rounded shadow">
    <p className="text-sm text-blue-100">Total Invoices</p>
    <p className="text-xl sm:text-2xl font-semibold">
      {totals.total_invoices}
    </p>
  </div>

  <div className="bg-blue-600 text-white p-4 rounded shadow">
    <p className="text-sm text-blue-100">Total Billed</p>
    <p className="text-xl sm:text-2xl font-semibold">
      ${(totals.total_amount / 100).toFixed(2)}
    </p>
  </div>

  <div className="bg-blue-600 text-white p-4 rounded shadow">
    <p className="text-sm text-blue-100">Balance Remaining</p>
    <p className="text-xl sm:text-2xl font-semibold">
      ${(balanceRemaining / 100).toFixed(2)}
    </p>
  </div>
</div>


      {/* Invoice Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  {new Date(invoice.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  ${(invoice.amount / 100).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      invoice.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {invoices.length === 0 && (
          <div className="p-6 text-gray-500">
            No invoices found for this customer.
          </div>
        )}
      </div>
    </div>
  );
}
