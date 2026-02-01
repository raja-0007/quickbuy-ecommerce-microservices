import React, { useEffect, useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ArrowUpRight, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { axiosHandle } from '@/lib/api'
import { useDebouncedCallback } from 'use-debounce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSearchProducts } from '@/contexts/searchProductsContext'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { searchResults, setSearchResults } = useSearchProducts()
  // const [searchResults, setSearchResults] = useState([])
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()


  const debounced = useDebouncedCallback(
    // function
    (value) => {
      if (pathname.includes('/search-results')) {

        const params = new URLSearchParams(searchParams.toString());
        const val = value.trim();
        if (val) {
          params.set("searchQuery", val);
        } else {
          params.delete("searchQuery");
        }

        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      }
      getProducts(value);

    },
    // delay in ms
    1000
  );


  const getProducts = async (query) => {
    try {
      const res = await axiosHandle.get(`/products/search-products`, {
        params: { searchQuery: query }
      });
      setSearchResults(res.data.products);
    } catch (err) {
      console.log('Error fetching products:', err);
    }
  }


  return (
    <>
      <div className='bg-background px-5 py-2 sticky top-0 z-50 w-full grid items-center border-b border-border sm:grid-cols-6'>
        <div className='text-lg font-extrabold text-primary font-stretch-100%'>QuickBuy</div>
        <div className='col-span-4 flex items-center justify-center'>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            searchResults={searchResults} setSearchResults={setSearchResults} debounced={debounced}
          />
        </div>
        <div className='flex justify-end'><Profile /></div>
        {/* {searchResults.length > 0 && <div className='absolute transition-all duration-200 fade-in w-full h-[300vh] z-[999] bg-black/80'></div>} */}
      </div>
    </>
  )
}

function SearchBar({ searchQuery, setSearchQuery, searchResults, setSearchResults, debounced }) {

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  return (
    <div className='relative w-full'>
      <InputGroup className="max-w-md mx-auto border border-border">
        <InputGroupInput placeholder="Search..." value={searchQuery} onKeyDown={(e) => {
          console.log("Key pressed:", e.key);
          if (e.key === 'Enter') {
            //  debounced(searchQuery)
            router.push(`/search-results?searchQuery=${searchQuery}`)
          }
        }}
          onChange={(e) => {
            setSearchQuery(e.target.value); debounced(e.target.value)

          }}

        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">{searchResults.length > 0 && `${searchResults.length} results`}</InputGroupAddon>
      </InputGroup>
      {searchResults.length > 0 && !pathname.includes('/search-results') && (
        <div className='absolute top-full left- w-md left-1/2 -translate-x-1/2 bg-card rounded-lg mt-1 max-h-60 overflow-y-auto z-50'>
          {searchResults.map((item, index) => (
            <div key={index} className='p-3 border-b flex items-center justify-between gap-2 border-border hover:bg-slate-100 cursor-pointer'>
              <div className="flex items-center gap-2">

                <Search className='text-xs size-3 text-primary' /> <p className='text-sm max-w-[350px] truncate'>{item.title}</p>
              </div>
              <ArrowUpRight className='text-xs size-3 text-primary' />
            </div>
          ))}
        </div>
      )}
    </div>

  )
}


function Profile() {
  return (
    <Avatar>
      {/* <AvatarImage
        src="https://github.com/shadcn.png"
        alt="@shadcn"
        className="grayscale"
      /> */}
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}



export default Navbar