export const AuthLoadingScreen = () => (
  <div className="h-screen flex items-center justify-center bg-background relative overflow-hidden">
    {/* Animated background elements */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-32 w-24 h-24 bg-purple-500/10 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 left-40 w-20 h-20 bg-pink-500/10 rounded-full animate-pulse delay-2000"></div>
      <div className="absolute bottom-20 right-20 w-28 h-28 bg-indigo-500/10 rounded-full animate-pulse delay-500"></div>
    </div>
    
    {/* Main content */}
    <div className="text-center space-y-6 z-10 relative">
      <div className="relative">
        <span className="font-bold text-4xl bg-gradient-primary bg-clip-text text-transparent">
          BleemHire
        </span>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 font-bold text-4xl text-blue-500/20 blur-sm -z-10">
          BleemHire
        </div>
      </div>
      
      {/* Loading indicator */}
      <div className="flex items-center justify-center space-x-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
      </div>
      
    </div>
    
    {/* Animated border gradient */}
    <div className="absolute inset-0 opacity-30">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-x"></div>
    </div>
  </div>
);