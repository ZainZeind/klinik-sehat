import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Users, FileText, Video, LayoutDashboard, LogOut, Home, MessageSquare, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import Logo from "./Logo";

const Navigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const navItems = [
    { name: "Beranda", icon: Home, action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { name: "Fitur", icon: LayoutDashboard, action: () => scrollToSection('features') },
    { name: "Tentang", icon: FileText, action: () => scrollToSection('features') },
    { name: "Kontak", icon: MessageSquare, action: () => scrollToSection('features') },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border"
    >
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Logo size="sm" />
          </motion.div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:text-primary hover:bg-secondary/50 transition-all text-xs"
                  onClick={item.action}
                >
                  <item.icon className="w-3.5 h-3.5 mr-1.5" />
                  {item.name}
                </Button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-3"
          >
            {isAuthenticated && user ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 px-2 py-1.5 bg-accent/5 rounded-lg border border-accent/20">
                  <div className="w-7 h-7 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{user.full_name?.charAt(0) || 'U'}</span>
                  </div>
                  <p className="text-xs font-medium">{user.full_name}</p>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  className="gap-1.5 text-xs"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  title="Logout"
                  className="hover:bg-destructive/10 hover:text-destructive p-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  size="sm" 
                  className="hidden sm:inline-flex gap-1.5 hover:bg-accent text-xs"
                  onClick={() => navigate("/auth")}
                >
                  <Users className="w-3.5 h-3.5" />
                  Masuk
                </Button>
                <Button 
                  size="sm"
                  className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 gap-1.5 text-xs"
                  onClick={() => navigate("/auth", { state: { mode: 'register' } })}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Daftar Sekarang
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
