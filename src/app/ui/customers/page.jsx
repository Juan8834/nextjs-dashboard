import { neon } from '@neondatabase/serverless';
import Link from 'next/link';

async function getCustomers() {
  const sql = neon(process.env.DATABASE_URL);
  const data = await sql`
    SELECT id, name, email, image_url
    FROM customers
    ORDER BY name ASC
  `;
  return data;
}

export default async function Page() {
  const customers = await getCustomers();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium">
                  <Link
                    href={`/ui/customers/${customer.id}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"

                  >
                    {customer.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {customer.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
