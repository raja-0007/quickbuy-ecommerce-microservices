import React, { useEffect, useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ArrowUpRight, Heart, LogOut, Search, ShoppingBag, ShoppingCart, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { axiosHandle } from '@/lib/api'
import { useDebouncedCallback } from 'use-debounce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSearchProducts } from '@/contexts/searchProductsContext'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { searchResults, setSearchResults } = useSearchProducts()
  // const [searchResults, setSearchResults] = useState([])
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (searchParams.values().length === 0) return;
    const query = searchParams.get("searchQuery") || ""
    setSearchQuery(query)
    debounced(query)
  }, [])

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

  if (pathname.includes('/login') || pathname.includes('/register')) {
    return null
  }

  return (
    <>
      <div className='bg-background px-5 py-2 sticky top-0 z-50 w-full grid items-center border-b border-border sm:grid-cols-3'>
        <Link href={"/"} className='text-xl  font-extrabold text-primary'>QuickBuy</Link>
        <div className='col-span- flex items-center justify-center'>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            searchResults={searchResults} setSearchResults={setSearchResults} debounced={debounced}
          />
        </div>
        <div className='flex col-span- justify-end gap-16 items-center'>
          <Link href={"/cart"} title='Shopping Cart'><ShoppingCart title="Shopping Cart" /></Link>
          <Link href={"/wishlist"} title='Wishlist'><Heart title="Wishlist" /></Link>
          <Link href={"/orders"} title='Orders'><ShoppingBag title="Orders" /></Link>
          <span title='Profile' className='relative group cursor-pointer'>
            <Profile session={session}/>
            {session && <div className="absolute z-10 hidden group-hover:flex flex-col items-start justify-center bg-card border border-border p-2 rounded-md top-full right-0 mt-0 w-40 shadow-lg">

              <Link
                href="/profile"
                className="flex w-full items-center gap-2 text-sm hover:bg-secondary hover:text-foreground text-foreground p-2 rounded-md transition-colors"
              >
                <User size={16} />
                <span>My Profile</span>
              </Link>

              <Link
                href="#"
                onClick={() => signOut()}
                className="flex w-full items-center gap-2 text-sm hover:bg-secondary p-2 rounded-md transition-colors text-red-600"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Link>

            </div>}
          </span>
        </div>
        {/* {searchResults.length > 0 && <div className='absolute transition-all duration-200 fade-in w-full h-[300vh] z-[999] bg-black/80'></div>} */}
      </div>
    </>
  )
}

function SearchBar({ searchQuery, setSearchQuery, searchResults, setSearchResults, debounced }) {

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [show, setShow] = useState(true)
  useEffect(() => {
    setShow(false)

  }, [pathname])
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
            setSearchQuery(e.target.value); debounced(e.target.value); setShow(true);

          }}

        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">{searchResults.length > 0 && `${searchResults.length} results`}</InputGroupAddon>
      </InputGroup>
      {show && searchResults.length > 0 && !pathname.includes('/search-results') && (
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


function Profile({ session }) {
  if(session && session.user && session.user.name){
    return (
      <Avatar className={"group"}>
      {/* <AvatarImage
        src="https://github.com/shadcn.png"
        alt="@shadcn"
        className="grayscale"
      /> */}
      <AvatarFallback>{session.user.name[0].toUpperCase()}{session.user?.name[1]?.toUpperCase()}</AvatarFallback>


    </Avatar>
    )
  }
  return (
    <Link href={"/login"} className="flex w-full items-center gap-2 text-sm hover:bg-secondary p-2 rounded-md transition-colors text-foreground">
      <User size={16} />
      <span>Login</span>
    </Link>
  )
}



export default Navbar