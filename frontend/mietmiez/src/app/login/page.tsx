'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '../style/favicon_512x512.png';


const login: React.FC = () =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
        const res = await fetch("BACKEND PORT EINFÜGEN", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Login fehlgeschlagen");
            return;
        }

        const data = await res.json();
        sessionStorage.setItem("token", data.token); 
        router.push('/main');
        } catch (err) {
        setError("Serverfehler");
        }
    };

    return(
        <div className="bg-[#B2E9CD] flex justify-center items-center h-screen">
            <div className="w-1/2 h-screen hidden lg:block relative">
                <Image 
                    src={logo} 
                    alt="Logo" 
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                />
                </div>
            <div className= "lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-6">
    <form onSubmit={handleSubmit} className="flex item-center justify-center flex-col">
      <h2 className="text-green-700 flex flex-col flex items-center mb-4 font-extrabold text-2xl">Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="text-gray-700 text-center w-full p-3 border border-gray-300 rounded-lg text-base mb-3"

      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="text-gray-700 text-center w-full p-3 border border-gray-300 rounded-lg text-base mb-5"

      />
      <div className="flex flex-row justify-between">
      <button type="submit"
      className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-lime-400 text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"      
      >Einloggen</button>
      <button
      onClick={() => router.push('register')}
      className="px-6 py-3 rounded-xl bg-gradient-to-r from-lime-400 to-green-500 text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"      
      >Registrieren</button>
      </div>

    </form>
    </div>
    </div>
        </div>
    );

}

export default login;