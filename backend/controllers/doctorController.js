import pool from '../config/database.js';

// Manage Doctor Schedules
export const getSchedules = async (req, res) => {
  try {
    const doctorId = req.user.role === 'dokter' ? req.user.id : req.params.doctorId;
    
    const [schedules] = await pool.query(
      `SELECT ds.*, p.full_name as doctor_name 
       FROM doctor_schedules ds
       LEFT JOIN profiles p ON ds.doctor_id = p.user_id
       WHERE ds.doctor_id = ? AND ds.is_active = TRUE
       ORDER BY FIELD(ds.day_of_week, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu')`,
      [doctorId]
    );

    res.json({ schedules });
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const { day_of_week, start_time, end_time, max_patients, notes } = req.body;
    const doctorId = req.user.id;

    const [result] = await pool.query(
      `INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, max_patients, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [doctorId, day_of_week, start_time, end_time, max_patients || 20, notes || null]
    );

    res.status(201).json({
      message: 'Jadwal berhasil ditambahkan',
      scheduleId: result.insertId
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { day_of_week, start_time, end_time, max_patients, notes, is_active } = req.body;
    const doctorId = req.user.id;

    const [result] = await pool.query(
      `UPDATE doctor_schedules 
       SET day_of_week = ?, start_time = ?, end_time = ?, max_patients = ?, notes = ?, is_active = ?
       WHERE id = ? AND doctor_id = ?`,
      [day_of_week, start_time, end_time, max_patients, notes, is_active, id, doctorId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
    }

    res.json({ message: 'Jadwal berhasil diperbarui' });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;

    const [result] = await pool.query(
      'DELETE FROM doctor_schedules WHERE id = ? AND doctor_id = ?',
      [id, doctorId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
    }

    res.json({ message: 'Jadwal berhasil dihapus' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Medical Records Management
export const createMedicalRecord = async (req, res) => {
  try {
    const {
      patient_id,
      appointment_id,
      diagnosis,
      symptoms,
      treatment,
      prescription,
      blood_pressure,
      temperature,
      weight,
      height,
      notes,
      record_date
    } = req.body;
    
    const doctorId = req.user.id;

    const [result] = await pool.query(
      `INSERT INTO medical_records 
       (patient_id, doctor_id, appointment_id, diagnosis, symptoms, treatment, prescription, 
        blood_pressure, temperature, weight, height, notes, record_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [patient_id, doctorId, appointment_id || null, diagnosis, symptoms, treatment, prescription,
       blood_pressure, temperature, weight, height, notes, record_date]
    );

    res.status(201).json({
      message: 'Rekam medis berhasil ditambahkan',
      recordId: result.insertId
    });
  } catch (error) {
    console.error('Create medical record error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getMedicalRecords = async (req, res) => {
  try {
    const { patient_id } = req.params;
    
    const [records] = await pool.query(
      `SELECT mr.*, 
              p_patient.full_name as patient_name,
              p_doctor.full_name as doctor_name
       FROM medical_records mr
       LEFT JOIN profiles p_patient ON mr.patient_id = p_patient.user_id
       LEFT JOIN profiles p_doctor ON mr.doctor_id = p_doctor.user_id
       WHERE mr.patient_id = ?
       ORDER BY mr.record_date DESC`,
      [patient_id]
    );

    res.json({ records });
  } catch (error) {
    console.error('Get medical records error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      diagnosis,
      symptoms,
      treatment,
      prescription,
      blood_pressure,
      temperature,
      weight,
      height,
      notes
    } = req.body;

    const [result] = await pool.query(
      `UPDATE medical_records 
       SET diagnosis = ?, symptoms = ?, treatment = ?, prescription = ?,
           blood_pressure = ?, temperature = ?, weight = ?, height = ?, notes = ?
       WHERE id = ? AND doctor_id = ?`,
      [diagnosis, symptoms, treatment, prescription, blood_pressure, temperature, 
       weight, height, notes, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rekam medis tidak ditemukan' });
    }

    res.json({ message: 'Rekam medis berhasil diperbarui' });
  } catch (error) {
    console.error('Update medical record error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getTodayPatients = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const [patients] = await pool.query(
      `SELECT a.*, p.full_name, p.phone, p.date_of_birth, q.queue_number, q.status as queue_status
       FROM appointments a
       LEFT JOIN profiles p ON a.patient_id = p.user_id
       LEFT JOIN queue q ON a.id = q.appointment_id
       WHERE a.doctor_id = ? AND a.appointment_date = ?
       ORDER BY q.queue_number ASC`,
      [doctorId, today]
    );

    res.json({ patients });
  } catch (error) {
    console.error('Get today patients error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
