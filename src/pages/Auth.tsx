import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import RegisterForm from "@/components/RegisterForm";

const Auth = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (location.state?.mode === 'register') {
      setIsLogin(false);
    }
  }, [location]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error: any) {
      // Error already handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: any) => {
    setLoading(true);
    try {
      await register(data);
      navigate("/dashboard");
    } catch (error: any) {
      // Error already handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Back to Home Button */}
      <Button
        onClick={() => navigate("/")}
        variant="ghost"
        className="absolute top-6 left-6 z-20 hover:bg-accent/10 hover:text-accent"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Beranda
      </Button>

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-3xl p-4 md:p-8 my-8"
      >
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border p-6 md:p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo size="lg" showText={false} />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              {isLogin ? "Selamat Datang" : "Daftar Pasien Baru"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin
                ? "Masuk ke akun Klinik Sehat Anda"
                : "Buat akun pasien untuk mendaftar dan konsultasi"}
            </p>
          </div>

          {/* Form */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-border focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-background/50 border-border focus:border-primary transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 text-lg py-6"
              >
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          ) : (
            <RegisterForm onSubmit={handleRegister} loading={loading} />
          )}

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail("");
                setPassword("");
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? (
                <>
                  Belum punya akun?{" "}
                  <span className="font-semibold text-primary">
                    Daftar di sini
                  </span>
                </>
              ) : (
                <>
                  Sudah punya akun?{" "}
                  <span className="font-semibold text-primary">
                    Masuk di sini
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
