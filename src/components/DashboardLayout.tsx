import { ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import Logo from './Logo';
import {
  Calendar,
  ClipboardList,
  Users,
  LogOut,
  Home,
  MessageSquare,
  Bell,
  FileText,
  LayoutDashboard,
  Settings,
  HelpCircle,
  Moon,
  Sun,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [unreadNotifications] = useState(3); // Simulated notification count

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const getMenuItems = () => {
    if (user?.role === 'admin') {
      return [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/admin' },
        { icon: ClipboardList, label: 'Kelola Antrian', path: '/dashboard/admin/queue' },
        { icon: Users, label: 'Kelola User', path: '/dashboard/admin/users' },
        { icon: FileText, label: 'Database Pasien', path: '/dashboard/admin/patients' },
        { icon: Bell, label: 'Notifikasi', path: '/dashboard/admin/notifications' },
      ];
    } else if (user?.role === 'dokter') {
      return [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/doctor' },
        { icon: Calendar, label: 'Jadwal Praktik', path: '/dashboard/doctor/schedule' },
        { icon: FileText, label: 'Rekam Medis', path: '/dashboard/doctor/medical-records' },
        { icon: Users, label: 'Pasien Hari Ini', path: '/dashboard/doctor/patients' },
      ];
    } else {
      return [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/patient' },
        { icon: Calendar, label: 'Daftar Online', path: '/dashboard/patient/registration' },
        { icon: MessageSquare, label: 'Konsultasi', path: '/dashboard/patient/consultation' },
        { icon: ClipboardList, label: 'Status Antrian', path: '/dashboard/patient/queue' },
        { icon: FileText, label: 'Riwayat', path: '/dashboard/patient/history' },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-56 bg-card border-r border-border flex flex-col">
        <div className="p-3 border-b border-border">
          <Link to="/">
            <Logo size="sm" />
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          {/* Notification Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start relative hover:bg-accent"
            onClick={() => navigate('/dashboard/notifications')}
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifikasi
            {unreadNotifications > 0 && (
              <span className="ml-auto w-5 h-5 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </Button>

          {/* Settings Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start hover:bg-accent"
            onClick={() => navigate('/dashboard/settings')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Pengaturan
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start hover:bg-accent"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
            {darkMode ? "Mode Terang" : "Mode Gelap"}
          </Button>

          {/* User Info */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center space-x-2 px-3 py-2 bg-accent/5 rounded-lg border border-accent/20">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">{user?.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full justify-start hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};
