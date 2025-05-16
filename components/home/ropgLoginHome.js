'use client';
import React, { useState } from "react";
import NavBar from "./navbar";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from 'axios';
import { Shield, Smartphone, TrendingUp, ChevronRight, Lock, AlertCircle } from "lucide-react";

const Home = () => {
  const { user, isLoading: isUserLoading } = useUser();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [associate, setAssociate] = useState(false);
  const [error, setError] = useState('');
  const [oobCode, setOobCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/ROPG', { username, password });
      if (res.data.access_token) {
        console.log("Access Token: ", res.data.access_token);
      }
    } catch (err) {
      const error = err.response?.data;
      if (error?.error === 'mfa_required') {
        setMfaToken(error.mfa_token);
        await promptMFA(error.mfa_token);
      } else {
        setError(error?.error || 'Login failed.');
      }
    }
    setIsLoading(false);
  };

  const promptMFA = async (mfa_token) => {
    let enrolledAuthenticators = await getAuthenticators(mfa_token);
    console.log("Enrolled Authenticators: ", enrolledAuthenticators);
    let challengeAuthenticators = await challengeSecondaryFactor(mfa_token, enrolledAuthenticators); 
    // const res = await axios.post(
    //   'https://dev-ow0gmshf.us.auth0.com/mfa/associate',
    //   {
    //     authenticator_types: ["oob"],
    //     oob_channels: ["sms"],
    //     phone_number: "+14254355486"
    //   },
    //   {
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // );
    // setAssociate(true);
    // console.log("MFA Association Response: ", res.data);
  };

  const getAuthenticators = async (mfa_token) => {
    let enrolledAuthenticators = await axios.get('https://dev-ow0gmshf.us.auth0.com/mfa/authenticators', {
      headers: {
        'Authorization': `Bearer ${mfa_token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log(response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error fetching authenticators:', error.response ? error.response.data : error.message);
    });
    return enrolledAuthenticators; 
  }

  const challengeSecondaryFactor = async (mfa_token, authenticators) => {
    const payload = {
      authenticators,
      mfa_token
    };
    setAssociate(true);
    let response = await axios.post('api/auth/challenge', payload)
              .then(res => {
                console.log("Res.Data: ", res.data);
                console.log("Oob Code: ", res.data.oob_code);
                setOobCode(res.data.oob_code);
                return res.data;
              });
  }
  const handleOtpSubmit = async (mfa_token, mfaResponse) => {
    console.log("In Handle OTP Submit");
    console.log("OTP:", otp );
    console.log("OOBCODE: ", oobCode);
    console.log("MFA RESPONSE: ", mfaResponse);
    // let oobCode = mfaResponse.oobCode;
    const res = await axios.post('/api/auth/verify-otp', {
      mfa_token,
      otp,
      oobCode
    });
    console.log("Verified OTP: ", res.data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-100 text-slate-800">
      <NavBar />

      {/* Hero Section with Overlapping Elements */}
      <main className="flex flex-col items-center px-6 pt-24 pb-20 relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-64 bg-blue-500 opacity-10 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-48 bg-indigo-500 opacity-10 rounded-tr-full"></div>
        
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Side: Text Content */}
          <div className="w-full lg:w-1/2 text-left space-y-6 z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Banking Reimagined for the Digital Age
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-xl">
              Experience secure, personalized, and intelligent banking services designed for your financial well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all font-medium flex items-center justify-center">
                Get Started <ChevronRight size={20} className="ml-2" />
              </button>
              <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium">
                Learn More
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 mt-8 text-sm text-slate-600">
              <div className="flex items-center">
                <Shield size={16} className="mr-1 text-blue-600" />
                <span>Bank-grade Security</span>
              </div>
              <div className="flex items-center">
                <Lock size={16} className="mr-1 text-blue-600" />
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>FDIC Insured</span>
              </div>
            </div>
          </div>
          
          {/* Right Side: Auth Forms */}
          <div className="w-full lg:w-5/12 z-10">
            {!user && !associate && (
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Lock size={20} className="text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-semibold">Secure Login</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your username"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                    />
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <div className="flex items-center">
                        <AlertCircle size={20} className="text-red-500 mr-2" />
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <input id="remember" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" />
                      <label htmlFor="remember" className="ml-2 text-slate-700">Remember me</label>
                    </div>
                    <a href="#" className="text-blue-600 hover:text-blue-800">Forgot password?</a>
                  </div>
                  
                  <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                      </>
                    ) : "Login to Your Account"}
                  </button>
                  
                  <p className="text-center text-slate-600 text-sm">
                    Don't have an account? <a href="#" className="text-blue-600 hover:text-blue-800">Sign up</a>
                  </p>
                </div>
              </div>
            )}

            {associate && (
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Smartphone size={24} className="text-indigo-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold">Verification Required</h2>
                  <p className="text-slate-600 mt-2">Enter the 6-digit code sent to your mobile</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-center gap-2">
                      {[...Array(6)].map((_, i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          value={otp[i] || ''}
                          onChange={(e) => {
                            const newOtp = otp.split('');
                            newOtp[i] = e.target.value;
                            setOtp(newOtp.join(''));
                            
                            // Auto-focus next input
                            if (e.target.value && i < 5) {
                              e.target.nextElementSibling?.focus();
                            }
                          }}
                          className="w-12 h-14 text-center text-xl font-semibold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleOtpSubmit}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    Verify & Login
                  </button>
                  
                  <div className="text-center">
                    <p className="text-slate-600 text-sm">
                      Didn't receive code? <a href="#" className="text-indigo-600 hover:text-indigo-800">Resend Code</a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Konko Heights</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Our innovative banking solutions are designed to provide you with security, convenience, and financial growth.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
              <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-all">
                <Smartphone size={28} className="text-blue-600 group-hover:text-white transition-all" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Advanced Mobile Banking</h3>
              <p className="text-slate-600">Access your finances anytime, anywhere with our award-winning mobile experience and real-time notifications.</p>
              <a href="#" className="inline-flex items-center mt-4 text-blue-600 font-medium hover:text-blue-800">
                Learn more <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
              <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-all">
                <Shield size={28} className="text-blue-600 group-hover:text-white transition-all" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Enterprise-Grade Security</h3>
              <p className="text-slate-600">Multi-factor authentication, biometric verification, and advanced encryption protect your financial data.</p>
              <a href="#" className="inline-flex items-center mt-4 text-blue-600 font-medium hover:text-blue-800">
                Learn more <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
              <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-all">
                <TrendingUp size={28} className="text-blue-600 group-hover:text-white transition-all" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Wealth Management</h3>
              <p className="text-slate-600">Personalized investment strategies, automated savings, and AI-powered financial insights to grow your wealth.</p>
              <a href="#" className="inline-flex items-center mt-4 text-blue-600 font-medium hover:text-blue-800">
                Learn more <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your banking experience?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">Join thousands of satisfied customers who have switched to Konko Heights for their banking needs.</p>
          <button className="px-8 py-3 bg-white text-blue-700 rounded-lg shadow-lg hover:bg-blue-50 transition-all font-medium">
            Open an Account Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">Konko Heights</h3>
              <p className="text-sm">Redefining modern banking with innovative solutions for a better financial future.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Products</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Checking Accounts</a></li>
                <li><a href="#" className="hover:text-white">Savings Accounts</a></li>
                <li><a href="#" className="hover:text-white">Investment Options</a></li>
                <li><a href="#" className="hover:text-white">Credit Cards</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
                <li><a href="#" className="hover:text-white">Financial Education</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>1-800-KONKO-HT</li>
                <li>support@konkoheights.com</li>
                <li>100 Financial Street, New York, NY</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">&copy; 2025 Konko Heights. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-white">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;