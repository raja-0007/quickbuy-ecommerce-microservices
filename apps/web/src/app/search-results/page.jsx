import SearchResultsClient from './SearchResultsClient'

export default async function SearchResults({ searchParams }) {
  const sp = await searchParams
  const q = (sp?.searchQuery) || ''
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/search-products?searchQuery=${encodeURIComponent(q)}`, { cache: 'no-store' })
    const json = await res.json()
    const products = json.products || []
    return <SearchResultsClient initialProducts={products} initialQuery={q} />
  } catch (err) {
    console.error('Error fetching products server-side', err)
    return <SearchResultsClient initialProducts={[]} initialQuery={q} />
  }
}
