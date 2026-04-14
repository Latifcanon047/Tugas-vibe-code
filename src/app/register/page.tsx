"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const getIndonesianErrorMessage = (errorMessage: string) => {
    const errorLower = errorMessage.toLowerCase();
    if (errorLower.includes("already exists")) {
      return "Email sudah terdaftar";
    }
    if (errorLower.includes("required")) {
      return "Email dan password harus diisi";
    }
    if (errorLower.includes("server error")) {
      return "Terjadi kesalahan pada server";
    }
    return errorMessage;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setSuccess("Registrasi berhasil! Silakan login.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const data = await res.json();
        setError(getIndonesianErrorMessage(data.error || "Registrasi gagal"));
      }
    } catch (err) {
      setError("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h1 className='text-2xl font-bold text-center mb-6 text-slate-900'>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-slate-700 mb-2'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-slate-700 mb-2'>Password</label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900'
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700'
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {error && (
            <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-start'>
              <span className='text-red-500 mr-2'>×</span>
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4 flex items-start'>
              <span className='text-green-500 mr-2'>✓</span>
              <p>{success}</p>
            </div>
          )}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center'
          >
            {isLoading ? (
              <>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Memproses...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>
        <p className='text-center mt-4 text-slate-600'>
          Already have an account?{' '}
          <a href='/login' className='text-blue-500 hover:underline'>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
