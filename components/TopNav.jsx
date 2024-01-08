import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useSearch } from "@/context/search";
import { FaSearch } from "react-icons/fa";

const TopNav = () => {
  // get logged in user data and status
  const { data, status } = useSession();

  const { searchQuery, setSearchQuery, fetchSearchResults } = useSearch();

  return (
    <nav className="nav shadow p-2 justify-content-between mb-3">
      <Link className="nav-link" href="/">
        Home
      </Link>

      {/* search form */}

      <form className="d-flex mb-0" role="search" onSubmit={fetchSearchResults}>
        <input
          type="search"
          className="form-control"
          placeholder="Search"
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button className="btn">
          <FaSearch />
        </button>
      </form>

      {status === "authenticated" ? (
        <>
          <div className="d-flex">
            <Link
              className="nav-link"
              href={`/dashboard/${
                data?.user?.role === "admin" ? "admin" : "user"
              }`}
            >
              {data?.user?.name} ({data?.user?.role})
            </Link>
            <a
              className="nav-link pointer text-danger"
              // handle signOut
              onClick={() => {
                signOut({ callbackUrl: "/login" });
              }}
            >
              Logout
            </a>
          </div>
        </>
      ) : (
        <div className="d-flex">
          <Link className="nav-link" href="/login">
            Login
          </Link>
          <Link className="nav-link" href="/register">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default TopNav;
