import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Users,
  Calendar,
  FileText,
  Video,
  Bell,
  History,
  LayoutDashboard,
  Activity,
  UserCheck,
  Shield,
} from "lucide-react";

const FeaturesSection = () => {
  const adminFeatures = [
    {
      icon: LayoutDashboard,
      title: "Dashboard Admin",
      description: "Kelola seluruh sistem klinik. Monitor statistik, kelola user, dan lihat semua aktivitas real-time.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Users,
      title: "Kelola Antrian",
      description: "Panggil, selesai, atau lewati antrian. Sistem antrian digital yang efisien untuk pengaturan penuh.",
      color: "from-teal-500 to-cyan-500",
    },
    {
      icon: Bell,
      title: "Kirim Notifikasi",
      description: "Kirim notifikasi massal ke dokter atau pasien. Template siap pakai untuk pengingat janji temu.",
      color: "from-cyan-500 to-blue-500",
    },
  ];

  const doctorFeatures = [
    {
      icon: Calendar,
      title: "Jadwal Praktik",
      description: "Atur jadwal praktik per hari. Tentukan jam kerja dan maksimal pasien per sesi dengan mudah.",
      color: "from-blue-500 to-sky-500",
    },
    {
      icon: FileText,
      title: "Rekam Medis",
      description: "Input dan kelola rekam medis pasien. Diagnosis, resep, vital signs tersimpan dengan aman.",
      color: "from-sky-500 to-cyan-500",
    },
    {
      icon: UserCheck,
      title: "Pasien Hari Ini",
      description: "Lihat daftar pasien hari ini dengan status antrian. Akses cepat ke riwayat medis pasien.",
      color: "from-cyan-500 to-teal-500",
    },
  ];

  const patientFeatures = [
    {
      icon: Calendar,
      title: "Daftar Online",
      description: "Daftar dari rumah! Pilih dokter, tanggal, dan dapatkan nomor antrian langsung.",
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: Video,
      title: "Konsultasi Online",
      description: "Chat dengan dokter secara online. Konsultasi cepat tanpa harus datang ke klinik.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Activity,
      title: "Status Antrian",
      description: "Pantau nomor antrian real-time. Notifikasi otomatis saat giliran Anda tiba.",
      color: "from-teal-500 to-emerald-500",
    },
  ];

  const features = [
    {
      icon: LayoutDashboard,
      title: "Dashboard Klinik",
      description: "Monitor semua aktivitas klinik dalam satu tampilan. Lihat statistik real-time dan kelola operasional dengan mudah.",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: Users,
      title: "Nomor Antrian Digital",
      description: "Sistem antrian otomatis yang mengurangi kerumunan. Pasien dapat melihat nomor antrian secara real-time.",
      color: "from-violet-500 to-fuchsia-500",
    },
    {
      icon: Calendar,
      title: "Pendaftaran Online",
      description: "Pasien dapat mendaftar dari rumah. Pilih dokter, jadwal, dan konfirmasi dalam hitungan detik.",
      color: "from-fuchsia-500 to-pink-500",
    },
    {
      icon: FileText,
      title: "Rekam Medis Digital",
      description: "Simpan dan akses rekam medis dengan aman. Riwayat kesehatan lengkap dalam satu sistem terintegrasi.",
      color: "from-pink-500 to-purple-500",
    },
    {
      icon: Video,
      title: "Konsultasi Online",
      description: "Layanan telemedicine untuk konsultasi jarak jauh. Video call HD dengan dokter kapan saja.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: Bell,
      title: "Notifikasi Real-time",
      description: "Dapatkan update instan melalui SMS, email, atau push notification. Tidak ada lagi antrian terlewat.",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: History,
      title: "Riwayat Kunjungan",
      description: "Lacak seluruh riwayat kunjungan pasien. Analisis tren dan pola untuk pelayanan lebih baik.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: UserCheck,
      title: "Manajemen Dokter",
      description: "Kelola jadwal dan availability dokter. Optimalisasi beban kerja tim medis Anda.",
      color: "from-cyan-500 to-teal-500",
    },
    {
      icon: Activity,
      title: "Analitik & Laporan",
      description: "Dashboard analytics komprehensif. Export laporan untuk evaluasi dan pengambilan keputusan.",
      color: "from-teal-500 to-purple-500",
    },
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-br from-health-50 via-white to-medical-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(white,transparent_85%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="px-4 py-2 bg-emerald-100 border border-emerald-300 rounded-full text-sm text-emerald-700 font-medium inline-block mb-4">
            ✨ Fitur Lengkap untuk Semua
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Disesuaikan untuk Setiap Peran
            </span>
            <br />
            <span className="text-foreground">Admin • Dokter • Pasien</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Setiap role memiliki fitur khusus yang disesuaikan dengan kebutuhan mereka untuk pengalaman terbaik.
          </p>
        </motion.div>

        {/* Admin Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            Fitur Admin
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-health-200 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 group cursor-pointer h-full">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-emerald-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Doctor Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-sky-600" />
            </div>
            Fitur Dokter
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctorFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-health-200 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 group cursor-pointer h-full">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-emerald-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Patient Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-teal-600" />
            </div>
            Fitur Pasien
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patientFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-health-200 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 group cursor-pointer h-full">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-emerald-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Old features - commented out but kept for reference */}
        <div className="hidden">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow-primary group cursor-pointer h-full">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
