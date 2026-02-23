import Link from "next/link";
import { getInvoices, deleteInvoice } from "@/app/lib/actions";

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Link
          href="/dashboard/invoices/create"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
        >
          Create Invoice
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Customer</th>
              <th className="border px-4 py-2 text-left">Amount</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  {invoice.customer_name}
                </td>

                <td className="border px-4 py-2">
                  ${(invoice.amount / 100).toFixed(2)}
                </td>

                <td className="border px-4 py-2 capitalize">
                  {invoice.status}
                </td>

                <td className="border px-4 py-2">
                  {invoice.date}
                </td>

                <td className="border px-4 py-2 text-center space-x-2">
                  <Link
                    href={`/dashboard/invoices/${invoice.id}/edit`}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-400"
                  >
                    Edit
                  </Link>

                  <form
                    action={async () => {
                      "use server";
                      await deleteInvoice(invoice.id);
                    }}
                    className="inline"
                  >
                    <button
                      type="submit"
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}

            {invoices.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500"
                >
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
