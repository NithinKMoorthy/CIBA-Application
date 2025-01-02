"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons"; // Party icon
import Login from "@/components/home/Login";
import React, { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { usePathname, useRouter } from "next/navigation";

const Home = () => {
  const { user, isAuthenticated, isLoading } = useUser();
  const [ropg, setROPG] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/ropgLogin") {
      setROPG(true);
    } else {
      setROPG(false);
    }
  }, [pathname]);

  return (
    <div className="flex flex-col sm:flex-row flex-grow bg-cover bg-no-repeat min-h-screen">
      <div className="flex flex-col sm:flex-row flex-grow justify-start items-start sm:mr-4">
        {/* Left Side */}
        <div className="sm:w-1/2 h-full flex justify-center p-8 rounded-lg">
          <div className="flex flex-col w-full justify-center items-start">
            {/* Headings */}
            <div className="w-full p-4 md:-mt-40">
              <div className="p-2">
                <h1
                  className="text-transparent bg-clip-text font-bold 
                             text-4xl sm:text-6xl md:text-7xl"
                  style={{
                    background:
                      "linear-gradient(to bottom,#2E1A68, #9B0860, #AB0363, #DDDCE7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Bank Smarter,
                </h1>
              </div>
              <div className="p-2">
                <h1
                  className="text-transparent bg-clip-text font-bold
                             text-3xl sm:text-5xl md:text-6xl"
                  style={{
                    background:
                      "linear-gradient(to bottom,#2E1A68, #9B0860, #AB0363, #DDDCE7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Live Better
                </h1>
              </div>
            </div>

            {/* Paragraph */}
            <div className="text-black px-6 p-1 font-sans 
                            text-sm sm:text-base md:text-lg 
                            font-light leading-loose text-gray-600"
            >
              Experience banking reimagined for today’s world. With cutting-edge
              security, intuitive tools, and a personalized approach, we empower
              you to take control of your finances—anytime, anywhere.
            </div>

            {/* Button */}
            <div className="px-6 p-4 mt-4">
              <button className="border border-black w-full bg-black text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-300">
                Get Started Today
              </button>
            </div>
          </div>
        </div>

        {/* Conditional Rendering */}
        {ropg && <Login />}
      </div>
    </div>
  );
};

export default Home;
