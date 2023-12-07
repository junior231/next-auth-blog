import Link from "next/link";
import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <>
      <nav className="nav justify-content-center">
        <Link href="/dashboard/admin" className="nav-link">
          Admin
        </Link>
        <Link href="/dashboard/admin/blog/create" className="nav-link">
          Create Blog
        </Link>
      </nav>
      {children}
    </>
  );
};

export default AdminLayout;