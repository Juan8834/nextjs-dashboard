import { getInvoiceById, getCustomers } from "@/app/lib/actions";
import EditInvoiceForm from "@/app/ui/invoices/edit-form";

export default async function EditInvoicePage({ params }) {
  const invoice = await getInvoiceById(params.id);
  const customers = await getCustomers();

  if (!invoice) {
    return <p className="p-6">Invoice not found.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Invoice</h1>
      <EditInvoiceForm invoice={invoice} customers={customers} />
    </div>
  );
}
