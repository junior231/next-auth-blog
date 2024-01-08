"use client";

import { createContext, useState, useContext } from "react";
import { useRouter } from "next/navigation";

// initialize SearchContext
export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  // create local states search query and results
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const router = useRouter();

  // handle fetch request
  const fetchSearchResults = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.API}/search?searchQuery=${searchQuery}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();

      router.push(`/search?searchQuery=${searchQuery}`);

      setSearchResults(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        fetchSearchResults,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
