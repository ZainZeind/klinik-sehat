import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, Calendar, AlertCircle, Info, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface Notification {
  id_notifikasi: number;
  judul_notifikasi: string;
  isi_notifikasi: string;
  jenis_notifikasi: string;
  status_dibaca: string;
  waktu_kirim: string;
  waktu_dibaca: string | null;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/auth/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data.notifications);
    } catch (error: any) {
      console.error('Fetch notifications error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Gagal mengambil notifikasi"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarking(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/auth/notifications/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Berhasil",
        description: response.data.message
      });

      // Refresh notifications
      await fetchNotifications();
    } catch (error: any) {
      console.error('Mark all as read error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Gagal menandai notifikasi"
      });
    } finally {
      setMarking(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMins < 1) return 'Baru saja';
    if (diffInMins < 60) return `${diffInMins} menit yang lalu`;
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
    return date.toLocaleDateString('id-ID');
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'antrian':
        return Calendar;
      case 'appointment':
        return Calendar;
      case 'success':
        return CheckCheck;
      case 'alert':
      case 'urgent':
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'antrian':
      case 'appointment':
        return 'bg-blue-500/10 text-blue-500';
      case 'success':
        return 'bg-green-500/10 text-green-500';
      case 'alert':
      case 'urgent':
        return 'bg-orange-500/10 text-orange-500';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  const unreadCount = notifications.filter(n => n.status_dibaca === 'Belum Dibaca' || n.status_dibaca === 'Belum dibaca').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifikasi</h1>
            <p className="text-muted-foreground">
              Semua update dan pengingat Anda
              {unreadCount > 0 && (
                <span className="ml-2 text-primary font-medium">
                  ({unreadCount} belum dibaca)
                </span>
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={marking}
            >
              {marking ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCheck className="w-4 h-4 mr-2" />
              )}
              Tandai Semua Dibaca
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-spin" />
                <p className="text-sm text-muted-foreground">Memuat notifikasi...</p>
              </CardContent>
            </Card>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => {
              const NotificationIcon = getTypeIcon(notification.jenis_notifikasi);
              const isRead = notification.status_dibaca === 'Sudah Dibaca';

              return (
                <Card key={notification.id_notifikasi} className={isRead ? 'opacity-60' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.jenis_notifikasi)}`}>
                        <NotificationIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold">{notification.judul_notifikasi}</h3>
                          {!isRead && (
                            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.isi_notifikasi}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {getTimeAgo(notification.waktu_kirim)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Belum Ada Notifikasi</h3>
                <p className="text-sm text-muted-foreground">
                  Notifikasi Anda akan muncul di sini
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
