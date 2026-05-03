import React from "react";
import {
  Home,
  Search,
  PlusSquare,
  Play,
  User,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import type { User as UserType } from "../types";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen flex justify-center text-left overflow-hidden">
      <div className="w-full  bg-zinc-950 relative shadow-2xl flex flex-col md:flex-row h-screen overflow-hidden border-x border-zinc-900">
        {children}
      </div>
    </div>
  );
};

export function Navbar({
  activeTab,
  onTabChange,
  onAddClick,
}: {
  activeTab: string | null;
  onTabChange: (id: string) => void;
  onAddClick: () => void;
}) {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "explore", icon: Search, label: "Explore" },
    { id: "add", icon: PlusSquare, isAction: true, label: "Create" },
    { id: "reels", icon: Play, label: "Reels" },
    { id: "profile", icon: User, label: "Profile" },
  ];
  return (
    <nav className="absolute bottom-0 md:left-0 w-full md:w-[80px] lg:w-[240px] md:h-full md:border-t-0 md:border-r bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 flex md:flex-col justify-around md:justify-start md:pt-20 items-center lg:items-start h-[60px] md:h-auto z-50">
      <div className="hidden md:flex lg:hidden w-full justify-center mb-10">
        <ShieldCheck className="w-8 h-8 text-emerald-500" />
      </div>
      <div className="hidden lg:flex w-full px-6 mb-10 items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-emerald-500" />
        <span className="text-xl font-bold tracking-tight text-white">
          NurStream
        </span>
      </div>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => (tab.isAction ? onAddClick() : onTabChange(tab.id))}
          className={`transition-all flex items-center lg:w-full lg:px-6 md:py-6 lg:py-4 ${activeTab === tab.id ? "text-emerald-500 scale-110 md:scale-100" : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5 lg:rounded-xl"}`}
        >
          <tab.icon
            className="w-6 h-6 shrink-0"
            strokeWidth={activeTab === tab.id ? 3 : 2}
          />
          <span
            className={`hidden lg:block ml-4 font-medium text-lg ${activeTab === tab.id ? "text-emerald-500 font-bold" : ""}`}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  );
}

export function LoginView({
  users,
  onLogin,
  onSignUp,
}: {
  users: UserType[];
  onLogin: (id: string) => void;
  onSignUp?: (user: Omit<UserType, "id">) => void;
}) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [displayName, setDisplayName] = React.useState("");
  const [avatar, setAvatar] = React.useState("");
  const [error, setError] = React.useState("");

  const handleLogin = () => {
    setError("");
    const user = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    );
    if (user) {
      if (user.password && user.password !== password) {
        setError("Incorrect password.");
        return;
      }
      onLogin(user.id);
    } else {
      setError("User not found. Please sign up.");
    }
  };

  const handleSignUp = () => {
    setError("");
    if (!username || !displayName || !password) {
      setError("Username, Password, and Display Name are required.");
      return;
    }
    if (
      users.some((u) => u.username.toLowerCase() === username.toLowerCase())
    ) {
      setError("Username already exists.");
      return;
    }
    if (onSignUp) {
      onSignUp({
        username,
        password,
        displayName,
        avatar:
          avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        bio: "New to NurStream",
        coverImage:
          "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=800&q=80",
        isVerified: false,
        savedPublic: false,
        messagePrivacy: "request",
      });
    }
  };

  const quickUsers = users.slice(0, 6);

  return (
    <div className="absolute inset-0 z-[999] bg-zinc-950 overflow-y-auto no-scrollbar">
      <div className="min-h-full flex flex-col items-center justify-center p-6 text-center text-white relative">
        {/* Background Gradient & Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950 pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-sm flex flex-col items-center py-12">
          {/* Logo & Header */}
          <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-gradient-to-br from-emerald-400/20 to-teal-500/20 p-4 rounded-[2rem] mb-6 inline-block shadow-lg shadow-emerald-500/10 ring-1 ring-white/10 backdrop-blur-md">
              <ShieldCheck className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
            </div>
            <h1 className="text-4xl font-black mb-2 tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
              NurStream
            </h1>
            <p className="text-zinc-400 text-sm font-medium">
              Join the global Ummah
            </p>
            {void console.log("Users in ligin view:", users)}
          </div>

          {/* Form Container */}
          <div className="w-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            {error && (
              <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl p-4 mb-6 flex items-center gap-3 animate-in fade-in">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                <p className="text-left leading-tight">{error}</p>
              </div>
            )}

            {isSignUp ? (
              <div className="w-full relative text-left space-y-4">
                <div className="space-y-3">
                  <input
                    className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 text-white placeholder:text-zinc-600 transition-all"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError("");
                    }}
                  />
                  <div className="relative">
                    <input
                      className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 pr-12 text-sm outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 text-white placeholder:text-zinc-600 transition-all"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <input
                    className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 text-white placeholder:text-zinc-600 transition-all"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      setError("");
                    }}
                  />
                  <input
                    className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 text-white placeholder:text-zinc-600 transition-all"
                    placeholder="Avatar URL (Optional)"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                  />
                </div>
                <div className="pt-2 space-y-3">
                  <button
                    onClick={handleSignUp}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-2xl font-bold text-white shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all"
                  >
                    Create Account
                  </button>
                  <button
                    onClick={() => {
                      setIsSignUp(false);
                      setError("");
                    }}
                    className="w-full py-4 bg-transparent text-zinc-400 hover:text-white font-bold text-sm active:scale-[0.98] transition-all"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full relative text-left">
                <div className="relative mb-3">
                  <input
                    className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 text-white placeholder:text-zinc-600 transition-all"
                    placeholder="Username (Try: My_Identity)"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError("");
                    }}
                    onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>
                <div className="relative mb-6">
                  <input
                    className="w-full bg-black/20 border border-white/5 rounded-2xl pl-5 pr-24 py-4 text-sm outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 text-white placeholder:text-zinc-600 transition-all"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-16 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={handleLogin}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-xl shadow-md shadow-emerald-500/20 active:scale-95 transition-all group"
                  >
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => {
                      setIsSignUp(true);
                      setError("");
                    }}
                    className="text-sm text-zinc-400 hover:text-emerald-400 font-medium transition-colors"
                  >
                    New user?{" "}
                    <span className="font-bold text-emerald-500">
                      Sign up here
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {!isSignUp && (
            <div className="w-full mt-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-5 text-center">
                Quick Login
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {quickUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => onLogin(u.id)}
                    className="flex flex-col items-center gap-2.5 group"
                  >
                    <div className="w-14 h-14 rounded-full p-[2px] bg-zinc-800 group-hover:bg-gradient-to-tr group-hover:from-emerald-400 group-hover:to-teal-400 transition-all duration-300 shadow-lg group-hover:shadow-emerald-500/20">
                      <img
                        src={u.avatar}
                        className="w-full h-full rounded-full bg-zinc-950 object-cover border-2 border-zinc-950"
                        alt="av"
                      />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-semibold group-hover:text-emerald-400 transition-colors">
                      {/* {u.username.split("_")[0]} */}
                      {u.displayName}

                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
