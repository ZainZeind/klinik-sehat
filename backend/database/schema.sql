-- Database Schema for Clinic Queue Pro

CREATE DATABASE IF NOT EXISTS clinic_queue_db;
USE clinic_queue_db;

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'dokter', 'pasien') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  date_of_birth DATE,
  gender ENUM('L', 'P') COMMENT 'L=Laki-laki, P=Perempuan',
  profile_picture VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- Doctor Schedules table
CREATE TABLE IF NOT EXISTS doctor_schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  doctor_id INT NOT NULL,
  day_of_week ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu') NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_patients INT DEFAULT 20,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_doctor_id (doctor_id),
  INDEX idx_day_of_week (day_of_week)
);

-- Appointments table (Pendaftaran)
CREATE TABLE IF NOT EXISTS appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  complaint TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_patient_id (patient_id),
  INDEX idx_doctor_id (doctor_id),
  INDEX idx_appointment_date (appointment_date),
  INDEX idx_status (status)
);

-- Queue table (Sistem Antrian)
CREATE TABLE IF NOT EXISTS queue (
  id INT PRIMARY KEY AUTO_INCREMENT,
  appointment_id INT UNIQUE NOT NULL,
  queue_number INT NOT NULL,
  queue_date DATE NOT NULL,
  status ENUM('waiting', 'in_progress', 'completed', 'skipped') DEFAULT 'waiting',
  called_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  INDEX idx_queue_date (queue_date),
  INDEX idx_status (status),
  INDEX idx_queue_number (queue_number)
);

-- Medical Records table (Rekam Medis)
CREATE TABLE IF NOT EXISTS medical_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_id INT,
  diagnosis TEXT NOT NULL,
  symptoms TEXT,
  treatment TEXT,
  prescription TEXT,
  blood_pressure VARCHAR(20),
  temperature DECIMAL(4,1),
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  notes TEXT,
  record_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
  INDEX idx_patient_id (patient_id),
  INDEX idx_doctor_id (doctor_id),
  INDEX idx_record_date (record_date)
);

-- Consultations table (Konsultasi Online)
CREATE TABLE IF NOT EXISTS consultations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  consultation_type ENUM('chat', 'video') DEFAULT 'chat',
  status ENUM('pending', 'active', 'completed', 'cancelled') DEFAULT 'pending',
  scheduled_at TIMESTAMP NULL,
  started_at TIMESTAMP NULL,
  ended_at TIMESTAMP NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_patient_id (patient_id),
  INDEX idx_doctor_id (doctor_id),
  INDEX idx_status (status)
);

-- Consultation Messages table
CREATE TABLE IF NOT EXISTS consultation_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  consultation_id INT NOT NULL,
  sender_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_consultation_id (consultation_id),
  INDEX idx_sender_id (sender_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('appointment', 'queue', 'reminder', 'general') DEFAULT 'general',
  is_read BOOLEAN DEFAULT FALSE,
  related_id INT COMMENT 'ID terkait (appointment_id, queue_id, etc)',
  scheduled_at TIMESTAMP NULL COMMENT 'Untuk notifikasi terjadwal',
  sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_type (type)
);

-- Insert default users
-- Note: All passwords are hashed using bcrypt (generated using bcryptjs with salt rounds = 10)

-- Admin user (email: admin@clinic.com, password: admin123)
INSERT INTO users (email, password, role) VALUES 
('admin@clinic.com', '$2a$10$pOQ9I/ulvEKaD0bguBC6deCViiFCYFkolpupsI24a8vi6rLHHwvSi', 'admin');

-- Doctor user (email: dokter@clinic.com, password: dokter123)
INSERT INTO users (email, password, role) VALUES 
('dokter@clinic.com', '$2a$10$8ri9dJ4Uy8bJ685k3kmRPOL0gAKsYMmJDf8jS.wjIRVncXMFnkfUu', 'dokter');

-- Patient user (email: pasien@clinic.com, password: pasien123)
INSERT INTO users (email, password, role) VALUES 
('pasien@clinic.com', '$2a$10$6rfjXgJsr0Xw.wqvju.HEu25vHpDHSoM7AiE/j10A5.hiwk4R6cz6', 'pasien');

-- Insert profiles for default users
INSERT INTO profiles (user_id, full_name, phone, gender, address) VALUES 
(1, 'Administrator', '081234567890', 'L', 'Jl. Admin No. 1'),
(2, 'Dr. Budi Santoso, Sp.PD', '081234567891', 'L', 'Jl. Dokter No. 2'),
(3, 'Ahmad Rizki', '081234567892', 'L', 'Jl. Pasien No. 3');

-- Insert sample doctor schedule for Dr. Budi
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, max_patients, notes) VALUES
(2, 'Senin', '08:00:00', '12:00:00', 20, 'Poliklinik Umum'),
(2, 'Selasa', '08:00:00', '12:00:00', 20, 'Poliklinik Umum'),
(2, 'Rabu', '08:00:00', '12:00:00', 20, 'Poliklinik Umum'),
(2, 'Kamis', '08:00:00', '12:00:00', 20, 'Poliklinik Umum'),
(2, 'Jumat', '08:00:00', '11:00:00', 15, 'Poliklinik Umum');
