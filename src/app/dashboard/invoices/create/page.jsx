

import Form from "@/app/ui/invoices/create-form";
import { getCustomers } from "@/app/lib/actions";

export default async function CreateInvoicePage() {
  // Fetch all customers from the database
  let customers = [];
  try {
    customers = await getCustomers();
  } catch (err) {
    console.error("Failed to fetch customers:", err);
  }

  return <Form customers={customers} />;
}
