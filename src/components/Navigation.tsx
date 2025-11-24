import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Users, FileText, Video, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Antrian", icon: Users },
    { name: "Rekam Medis", icon: FileText },
    { name: "Konsultasi", icon: Video },
    { name: "Jadwal", icon: Calendar },
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
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow-primary">
              <span className="text-2xl font-bold">K</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Klinik Queue
            </span>
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
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
