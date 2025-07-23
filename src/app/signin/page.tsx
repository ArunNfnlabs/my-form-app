"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SignIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        const dummyEmail = "admin@email.com";
        const dummyPassword = "admin123";

        if (email === dummyEmail && password === dummyPassword) {
            localStorage.setItem("isLoggedIn", "true");
            router.push("/"); // redirect to dashboard
        } else {
            setError("Invalid email or password");
        }
    };

    useEffect(() => {
        if (localStorage.getItem("isLoggedIn") === "true") {
            router.push("/");
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 border mb-4 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 border mb-4 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
                    onClick={handleLogin}
                >
                    Sign In
                </button>
            </div>
        </div>
    );
};

export default SignIn;
