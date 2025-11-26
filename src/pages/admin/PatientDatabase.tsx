import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Search, Eye } from 'lucide-react';

export default function PatientDatabase() {
  const [patients, setPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = patients.filter(
        (p) =>
          p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.phone?.includes(searchQuery)
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchQuery, patients]);

  const loadPatients = async () => {
    try {
      const response = await api.getAllPatients();
      setPatients(response.patients || []);
      setFilteredPatients(response.patients || []);
    } catch (error: any) {
      toast.error('Gagal memuat data pasien');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (patientId: number) => {
    try {
      const response = await api.getPatientDetail(patientId);
      setSelectedPatient(response);
      setDetailDialogOpen(true);
    } catch (error: any) {
      toast.error('Gagal memuat detail pasien');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Database Pasien</h1>
          <p className="text-muted-foreground">Data lengkap semua pasien</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Daftar Pasien ({filteredPatients.length})</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama, email, atau telepon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Total Kunjungan</TableHead>
                  <TableHead>Kunjungan Terakhir</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.full_name}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.phone || '-'}</TableCell>
                    <TableCell>{patient.total_visits || 0}</TableCell>
                    <TableCell>
                      {patient.last_visit
                        ? new Date(patient.last_visit).toLocaleDateString('id-ID')
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetail(patient.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredPatients.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                {searchQuery ? 'Tidak ada hasil pencarian' : 'Tidak ada data pasien'}
              </p>
            )}
          </CardContent>
        </Card>

        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Pasien</DialogTitle>
            </DialogHeader>
            {selectedPatient && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                    <p className="font-semibold">{selectedPatient.patient.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{selectedPatient.patient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telepon</p>
                    <p className="font-semibold">{selectedPatient.patient.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tanggal Lahir</p>
                    <p className="font-semibold">
                      {selectedPatient.patient.date_of_birth
                        ? new Date(selectedPatient.patient.date_of_birth).toLocaleDateString(
                            'id-ID'
                          )
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
                    <p className="font-semibold">
                      {selectedPatient.patient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Alamat</p>
                    <p className="font-semibold">{selectedPatient.patient.address || '-'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Riwayat Kunjungan</h3>
                  <div className="space-y-3">
                    {selectedPatient.appointments?.length > 0 ? (
                      selectedPatient.appointments.map((appointment: any) => (
                        <div key={appointment.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-semibold">Dr. {appointment.doctor_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.complaint || 'Tidak ada keluhan'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">
                                {new Date(appointment.appointment_date).toLocaleDateString(
                                  'id-ID'
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {appointment.status}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        Belum ada riwayat kunjungan
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Rekam Medis</h3>
                  <div className="space-y-3">
                    {selectedPatient.medicalRecords?.length > 0 ? (
                      selectedPatient.medicalRecords.map((record: any) => (
                        <div key={record.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between mb-2">
                            <p className="font-semibold">Dr. {record.doctor_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(record.record_date).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Diagnosis: </span>
                              <span>{record.diagnosis}</span>
                            </div>
                            {record.symptoms && (
                              <div>
                                <span className="text-muted-foreground">Gejala: </span>
                                <span>{record.symptoms}</span>
                              </div>
                            )}
                            {record.treatment && (
                              <div>
                                <span className="text-muted-foreground">Tindakan: </span>
                                <span>{record.treatment}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        Belum ada rekam medis
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
