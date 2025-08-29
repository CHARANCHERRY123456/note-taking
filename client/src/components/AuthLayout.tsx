import { type ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {children}
        </div>
      </div>
      
      {/* Right side - Wave Pattern */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
          {/* Wave Pattern SVG */}
          <svg 
            className="absolute inset-0 w-full h-full object-cover" 
            viewBox="0 0 400 400" 
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#1e40af', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#60a5fa', stopOpacity: 0.6 }} />
              </linearGradient>
            </defs>
            
            {/* Flowing wave pattern */}
            <path 
              d="M0,200 Q100,50 200,150 Q300,250 400,100 L400,400 L0,400 Z" 
              fill="url(#waveGradient)" 
              opacity="0.7"
            />
            <path 
              d="M0,250 Q150,100 250,200 Q350,300 400,150 L400,400 L0,400 Z" 
              fill="url(#waveGradient)" 
              opacity="0.5"
            />
            <path 
              d="M0,300 Q200,150 300,250 Q400,350 400,200 L400,400 L0,400 Z" 
              fill="url(#waveGradient)" 
              opacity="0.3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
