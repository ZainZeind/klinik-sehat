import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, FileText } from 'lucide-react';

export default function MedicalRecords() {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    patient_id: '',
    diagnosis: '',
    symptoms: '',
    treatment: '',
    prescription: '',
    blood_pressure: '',
    temperature: '',
    weight: '',
    height: '',
    notes: '',
    record_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadTodayPatients();
  }, []);

  const loadTodayPatients = async () => {
    try {
      const response = await api.getTodayPatients();
      setPatients(response.patients || []);
    } catch (error: any) {
      toast.error('Gagal memuat daftar pasien');
    } finally {
      setLoading(false);
    }
  };

  const loadPatientRecords = async (patientId: number) => {
    try {
      const response = await api.getMedicalRecords(patientId);
      setRecords(response.records || []);
    } catch (error: any) {
      toast.error('Gagal memuat rekam medis');
    }
  };

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    loadPatientRecords(patient.patient_id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createMedicalRecord({
        ...formData,
        patient_id: selectedPatient.patient_id,
      });
      toast.success('Rekam medis berhasil ditambahkan');
      setDialogOpen(false);
      resetForm();
      loadPatientRecords(selectedPatient.patient_id);
    } catch (error: any) {
      toast.error(error.message || 'Gagal menambahkan rekam medis');
    }
  };

  const resetForm = () => {
    setFormData({
      patient_id: '',
      diagnosis: '',
      symptoms: '',
      treatment: '',
      prescription: '',
      blood_pressure: '',
      temperature: '',
      weight: '',
      height: '',
      notes: '',
      record_date: new Date().toISOString().split('T')[0],
    });
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
          <h1 className="text-4xl font-bold">Rekam Medis</h1>
          <p className="text-muted-foreground">Kelola rekam medis pasien</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pasien Hari Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {patients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className={`w-full p-3 border rounded-lg text-left hover:bg-accent transition-colors ${
                      selectedPatient?.id === patient.id ? 'bg-accent' : ''
                    }`}
                  >
                    <p className="font-semibold">{patient.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Antrian #{patient.queue_number}
                    </p>
                  </button>
                ))}
                {patients.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Tidak ada pasien hari ini
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {selectedPatient
                    ? `Rekam Medis - ${selectedPatient.full_name}`
                    : 'Rekam Medis'}
                </CardTitle>
                {selectedPatient && (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetForm}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Rekam Medis
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Tambah Rekam Medis</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="diagnosis">Diagnosis *</Label>
                          <Textarea
                            id="diagnosis"
                            placeholder="Masukkan diagnosis"
                            value={formData.diagnosis}
                            onChange={(e) =>
                              setFormData({ ...formData, diagnosis: e.target.value })
                            }
                            required
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="symptoms">Gejala</Label>
                          <Textarea
                            id="symptoms"
                            placeholder="Masukkan gejala yang dialami"
                            value={formData.symptoms}
                            onChange={(e) =>
                              setFormData({ ...formData, symptoms: e.target.value })
                            }
                            rows={2}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="treatment">Tindakan</Label>
                          <Textarea
                            id="treatment"
                            placeholder="Masukkan tindakan yang dilakukan"
                            value={formData.treatment}
                            onChange={(e) =>
                              setFormData({ ...formData, treatment: e.target.value })
                            }
                            rows={2}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="prescription">Resep</Label>
                          <Textarea
                            id="prescription"
                            placeholder="Masukkan resep obat"
                            value={formData.prescription}
                            onChange={(e) =>
                              setFormData({ ...formData, prescription: e.target.value })
                            }
                            rows={2}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="blood_pressure">Tekanan Darah</Label>
                            <Input
                              id="blood_pressure"
                              placeholder="120/80"
                              value={formData.blood_pressure}
                              onChange={(e) =>
                                setFormData({ ...formData, blood_pressure: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="temperature">Suhu (°C)</Label>
                            <Input
                              id="temperature"
                              type="number"
                              step="0.1"
                              placeholder="36.5"
                              value={formData.temperature}
                              onChange={(e) =>
                                setFormData({ ...formData, temperature: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="weight">Berat (kg)</Label>
                            <Input
                              id="weight"
                              type="number"
                              step="0.1"
                              placeholder="70"
                              value={formData.weight}
                              onChange={(e) =>
                                setFormData({ ...formData, weight: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="height">Tinggi (cm)</Label>
                            <Input
                              id="height"
                              type="number"
                              step="0.1"
                              placeholder="170"
                              value={formData.height}
                              onChange={(e) =>
                                setFormData({ ...formData, height: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes">Catatan</Label>
                          <Textarea
                            id="notes"
                            placeholder="Catatan tambahan"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={2}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="record_date">Tanggal</Label>
                          <Input
                            id="record_date"
                            type="date"
                            value={formData.record_date}
                            onChange={(e) =>
                              setFormData({ ...formData, record_date: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                          >
                            Batal
                          </Button>
                          <Button type="submit">Simpan</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedPatient ? (
                <div className="space-y-4">
                  {records.length > 0 ? (
                    records.map((record) => (
                      <div key={record.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-primary" />
                            <span className="font-semibold">
                              {new Date(record.record_date).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-semibold">Diagnosis: </span>
                            <span>{record.diagnosis}</span>
                          </div>
                          {record.symptoms && (
                            <div>
                              <span className="font-semibold">Gejala: </span>
                              <span>{record.symptoms}</span>
                            </div>
                          )}
                          {record.treatment && (
                            <div>
                              <span className="font-semibold">Tindakan: </span>
                              <span>{record.treatment}</span>
                            </div>
                          )}
                          {record.prescription && (
                            <div>
                              <span className="font-semibold">Resep: </span>
                              <span>{record.prescription}</span>
                            </div>
                          )}
                          {(record.blood_pressure ||
                            record.temperature ||
                            record.weight ||
                            record.height) && (
                            <div className="pt-2 border-t">
                              <span className="font-semibold">Vital Signs: </span>
                              <div className="grid grid-cols-2 gap-2 mt-1">
                                {record.blood_pressure && (
                                  <span>TD: {record.blood_pressure}</span>
                                )}
                                {record.temperature && <span>Suhu: {record.temperature}°C</span>}
                                {record.weight && <span>BB: {record.weight} kg</span>}
                                {record.height && <span>TB: {record.height} cm</span>}
                              </div>
                            </div>
                          )}
                          {record.notes && (
                            <div>
                              <span className="font-semibold">Catatan: </span>
                              <span>{record.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Belum ada rekam medis untuk pasien ini
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Pilih pasien untuk melihat rekam medis
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
