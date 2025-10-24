// src/pages/Index.tsx

import React from "react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fef5f1] via-[#fff8f6] to-[#fef5f1] text-gray-900 p-6">
      <div className="bg-white shadow-2xl rounded-2xl px-10 py-12 max-w-lg text-center border border-gray-100">
        <h1 className="text-4xl font-extrabold mb-4 text-[#d8272d] tracking-tight">
          Welcome Back 👋
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Build something amazing with your powerful dashboard system.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            className="bg-[#d8272d] hover:bg-[#b81e23] text-white px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            className="border-[#d8272d] text-[#d8272d] hover:bg-[#d8272d] hover:text-white px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </Button>
        </div>
      </div>

      <footer className="mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Your Company — All Rights Reserved
      </footer>
    </div>
  );
};

export default Index;
