import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Users, FileText, Video, LayoutDashboard, LogOut } from "lucide-react";
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
    { name: "Fitur", icon: LayoutDashboard, action: () => scrollToSection('features') },
    { name: "Role", icon: Users, action: () => scrollToSection('features') },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Logo size="md" />
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
                  className="text-foreground hover:text-primary hover:bg-secondary/50 transition-all"
                  onClick={item.action}
                >
                  <item.icon className="w-4 h-4 mr-2" />
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
                <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-secondary/50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">{user.full_name?.charAt(0) || 'U'}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{user.full_name}</p>
                    <Badge variant="outline" className="text-xs">
                      {user.role === 'admin' ? 'Admin' : user.role === 'dokter' ? 'Dokter' : 'Pasien'}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="hidden sm:inline-flex"
                  onClick={() => navigate("/auth")}
                >
                  Masuk
                </Button>
                <Button 
                  className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
                  onClick={() => navigate("/auth")}
                >
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
