import queryString from "query-string";
import Link from "next/link";

async function getBlogs(searchParams) {
  const urlParams = {
    page: searchParams.page || 1,
  };

  // get search query from url
  const searchQuery = new URLSearchParams(urlParams).toString();

  const response = await fetch(`${process.env.API}/blog?${searchQuery}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 1 },
  });

  if (!response.ok) {
    console.log("Failed to fetch blogs => ", response);
    throw new Error("Failed to fetch blogs");
  }

  const data = await response.json();

  return data;
}

// destructure searchParams with a default value of 1
export default async function Home({ searchParams }) {
  // get blogs when page renders
  const data = await getBlogs(searchParams);

  const { blogs, currentPage, totalPages } = data;

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="container">
      <p className="lead text-primary">Home</p>

      <pre>{JSON.stringify(data, null, 4)}</pre>

      <div className="d-flex justify-content-center">
        <nav aria-label="Page Navigation">
          <ul className="pagination">
            {hasPreviousPage && (
              <li className="page-item">
                <Link
                  href={`?page=${currentPage - 1}`}
                  className="page-link px-3"
                >
                  Prev
                </Link>
              </li>
            )}

            {/* create array from totalPages, map and return Links with page number */}
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <li
                  key={page}
                  className={`page-item ${
                    currentPage && currentPage === page ? "active" : ""
                  }`}
                >
                  <Link className="page-link" href={`?page=${page}`}>
                    {page}
                  </Link>
                </li>
              );
            })}

            {hasNextPage && (
              <li className="page-item">
                <Link
                  href={`?page=${currentPage + 1}`}
                  className="page-link px-3"
                >
                  Next
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
