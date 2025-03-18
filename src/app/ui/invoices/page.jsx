import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { fetchFilteredInvoices, fetchInvoicesPages } from '@/app/lib/data';  // Import relevant functions

export default async function Page({
  searchParams,
}) {
  const query = searchParams?.query || '';  // Extract the search query
  const currentPage = Number(searchParams?.page) || 1;  // Extract the current page from the searchParams
  
  // Fetch the total number of pages based on the search query
  const totalPages = await fetchInvoicesPages(query); 

  // Fetch the invoices for the current page and search query
  const invoices = await fetchFilteredInvoices(query, currentPage); 

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table invoices={invoices} query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} /> {/* Pass totalPages to the Pagination component */}
      </div>
    </div>
  );
}
