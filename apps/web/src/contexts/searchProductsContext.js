import React, { createContext, useContext, useEffect, useState } from "react";


const SearchProductsContext = createContext()
export const SearchProvider = ({ children }) => {
    const [searchResults, setSearchResults] = useState([])

    return <SearchProductsContext.Provider value={{ searchResults, setSearchResults }}>
        {children}
    </SearchProductsContext.Provider>
}

export const useSearchProducts = () => useContext(SearchProductsContext)

