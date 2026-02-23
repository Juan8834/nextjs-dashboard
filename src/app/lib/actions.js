"use server";

import { signIn } from "../../../auth";
import { AuthError } from "next-auth";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/* =========================
   Authentication
========================= */
export async function authenticate(prevState, formData) {
  try {
    await signIn("credentials", {
      redirect: true,
      redirectTo: "/dashboard",
      email: formData.get("email"),
      password: formData.get("password"),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

/* =========================
   Customers
========================= */
export async function getCustomers() {
  try {
    const { rows } = await sql`
      SELECT id, name
      FROM customers
      ORDER BY name ASC
    `;
    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch customers.");
  }
}

/* =========================
   Invoices
========================= */

export async function getInvoices() {
  try {
    const { rows } = await sql`
      SELECT invoices.id, invoices.amount, invoices.status, customers.name AS customer_name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.id DESC
    `;
    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function createInvoice(formData) {
  const customerId = formData.get("customerId");
  const amount = formData.get("amount");
  const status = formData.get("status");
  const date = new Date().toISOString().split("T")[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amount}, ${status}, ${date})
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create invoice.");
  }

  // ✅ Updated path
  revalidatePath("/ui/invoices");
  redirect("/ui/invoices");
}

export async function getInvoiceById(id) {
  try {
    const { rows } = await sql`
      SELECT *
      FROM invoices
      WHERE id = ${id}
    `;
    return rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function updateInvoice(id, formData) {
  const customerId = formData.get("customerId");
  const amount = formData.get("amount");
  const status = formData.get("status");

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId},
          amount = ${amount},
          status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update invoice.");
  }

  // ✅ Updated path
  revalidatePath("/ui/invoices");
  redirect("/ui/invoices");
}

export async function deleteInvoice(id) {
  try {
    await sql`
      DELETE FROM invoices
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete invoice.");
  }

  // ✅ Updated path
  revalidatePath("/ui/invoices");
}
