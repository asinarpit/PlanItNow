import React from "react";
import { Link } from "react-router";

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen ">
      <h1 className="text-3xl font-bold mb-4">Unauthorized</h1>
      <p className="mb-4">You don't have permission to access this page.</p>
      <Link to="/" className="bg-teal-500 text-white px-4 py-2 rounded">
        Go to Home
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
