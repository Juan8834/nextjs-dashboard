"use client";

import { updateInvoice } from "@/app/lib/actions";

export default function EditInvoiceForm({ invoice, customers }) {
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);

  return (
    <form action={updateInvoiceWithId} className="space-y-4">
      <div>
        <label className="block mb-1">Customer</label>
        <select
          name="customerId"
          defaultValue={invoice.customer_id}
          className="border rounded px-3 py-2 w-full"
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1">Amount</label>
       <input
        type="number"
        name="amount"
        step="0.01"
        min="0"
        defaultValue={(invoice.amount / 100).toFixed(2)}
        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
/>
      </div>

      <div>
        <label className="block mb-1">Status</label>
        <select
          name="status"
          defaultValue={invoice.status}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
      >
        Update Invoice
      </button>
    </form>
  );
}
