import { ReactNode } from 'react';
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
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
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
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/">
            <Logo size="md" />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="mb-4 px-4 py-2">
            <p className="text-sm text-muted-foreground">Logged in as</p>
            <p className="font-semibold">{user?.full_name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start"
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
