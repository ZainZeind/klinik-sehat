import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

export default function Notifications() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: 'pasien',
    title: '',
    message: '',
    type: 'general',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.sendBulkNotification(
        formData.role,
        formData.title,
        formData.message,
        formData.type
      );
      toast.success('Notifikasi berhasil dikirim');
      setFormData({
        role: 'pasien',
        title: '',
        message: '',
        type: 'general',
      });
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengirim notifikasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Kelola Notifikasi</h1>
          <p className="text-muted-foreground">
            Kirim notifikasi dan pengingat kepada user
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Kirim Notifikasi Massal</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="role">Kirim ke Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="dokter">Dokter</SelectItem>
                      <SelectItem value="pasien">Pasien</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipe Notifikasi</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Umum</SelectItem>
                      <SelectItem value="appointment">Janji Temu</SelectItem>
                      <SelectItem value="queue">Antrian</SelectItem>
                      <SelectItem value="reminder">Pengingat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Judul</Label>
                  <Input
                    id="title"
                    placeholder="Masukkan judul notifikasi"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Pesan</Label>
                  <Textarea
                    id="message"
                    placeholder="Masukkan isi pesan notifikasi"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? 'Mengirim...' : 'Kirim Notifikasi'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template Notifikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg space-y-2">
                  <h4 className="font-semibold">Pengingat Janji Temu</h4>
                  <p className="text-sm text-muted-foreground">
                    "Pengingat: Anda memiliki janji temu besok tanggal [tanggal] pukul [waktu]
                    dengan [nama dokter]. Harap datang 15 menit lebih awal."
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        type: 'reminder',
                        title: 'Pengingat Janji Temu',
                        message:
                          'Pengingat: Anda memiliki janji temu besok. Harap datang 15 menit lebih awal.',
                      })
                    }
                  >
                    Gunakan Template
                  </Button>
                </div>

                <div className="p-4 border rounded-lg space-y-2">
                  <h4 className="font-semibold">Konfirmasi Pendaftaran</h4>
                  <p className="text-sm text-muted-foreground">
                    "Pendaftaran Anda berhasil! Nomor antrian: [nomor]. Estimasi waktu
                    panggilan: [waktu]. Terima kasih."
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        type: 'appointment',
                        title: 'Konfirmasi Pendaftaran',
                        message:
                          'Pendaftaran Anda berhasil! Silakan cek nomor antrian Anda. Terima kasih.',
                      })
                    }
                  >
                    Gunakan Template
                  </Button>
                </div>

                <div className="p-4 border rounded-lg space-y-2">
                  <h4 className="font-semibold">Panggilan Antrian</h4>
                  <p className="text-sm text-muted-foreground">
                    "Nomor antrian [nomor] dipanggil. Silakan menuju ruang praktek [nama
                    dokter]."
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        type: 'queue',
                        title: 'Panggilan Antrian',
                        message: 'Giliran Anda! Silakan menuju ruang praktek dokter.',
                      })
                    }
                  >
                    Gunakan Template
                  </Button>
                </div>

                <div className="p-4 border rounded-lg space-y-2">
                  <h4 className="font-semibold">Jadwal Praktik Berubah</h4>
                  <p className="text-sm text-muted-foreground">
                    "Pemberitahuan: Jadwal praktik [nama dokter] mengalami perubahan. Mohon
                    periksa jadwal terbaru di aplikasi."
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        type: 'general',
                        title: 'Perubahan Jadwal Praktik',
                        message:
                          'Pemberitahuan: Terdapat perubahan jadwal praktik dokter. Mohon periksa jadwal terbaru.',
                      })
                    }
                  >
                    Gunakan Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tips Penggunaan</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Gunakan judul yang jelas dan deskriptif</li>
              <li>Pastikan pesan mudah dipahami dan tidak terlalu panjang</li>
              <li>Pilih tipe notifikasi yang sesuai untuk memudahkan filtering</li>
              <li>
                Notifikasi akan dikirim ke semua user dengan role yang dipilih
              </li>
              <li>
                User dapat melihat notifikasi di dashboard mereka masing-masing
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
