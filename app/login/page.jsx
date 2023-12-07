// enable client functionalities
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // initialize router
  const router = useRouter();

  // get searchParams functionality
  const searchParams = useSearchParams();

  // create callbackUrl
  const callBackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Login success");
      router.push(callBackUrl);
    }
  };

  return (
    <div className="container">
      <div className="d-flex row justify-content-center align-items-center vh-100">
        <div className="col-lg-5 bg-light p-5 shadow">
          <h2 className="text-center lead">Login</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control mb-2"
              placeholder="Enter your email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control mb-2"
              placeholder="Enter your password"
            />
            <button
              disabled={loading || !email || !password}
              className="btn btn-primary ml-auto"
            >
              {loading ? "Please wait..." : "Submit"}
            </button>
          </form>

          <div className="text-center ">
            <button
              className="btn btn-success mb-4"
              onClick={() =>
                signIn("google", {
                  callbackUrl: callBackUrl,
                })
              }
            >
              Sign in with Google?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
