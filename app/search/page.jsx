"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSearch } from "@/context/search";
import BlogList from "@/components/blogs/BlogList";

const SearchPage = () => {
  const { setSearchQuery, searchResults, setSearchResults } = useSearch();

  const searchParams = useSearchParams();

  const query = searchParams.get("searchQuery");

  useEffect(() => {
    // fetch results everytime page reloads
    fetchSearchResultsonLoad();
  }, [query]);

  const fetchSearchResultsonLoad = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/search?searchQuery=${query}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();

      setSearchResults(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h5 className="lead mt-2 text-center">
            Found blog(s): {searchResults.length}
          </h5>
          {searchResults ? <BlogList blogs={searchResults} /> : null}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
