import SellerSidebar from '@/components/seller/SellerSidebar'

export default function SellerLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SellerSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
