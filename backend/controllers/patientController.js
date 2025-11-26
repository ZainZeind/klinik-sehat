import pool from '../config/database.js';

// Online Registration / Appointment
export const getDoctors = async (req, res) => {
  try {
    const [doctors] = await pool.query(
      `SELECT u.id, p.full_name, p.phone, p.profile_picture
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.role = 'dokter'`
    );

    res.json({ doctors });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getDoctorSchedules = async (req, res) => {
  try {
    const { doctor_id } = req.params;

    const [schedules] = await pool.query(
      `SELECT * FROM doctor_schedules 
       WHERE doctor_id = ? AND is_active = TRUE
       ORDER BY FIELD(day_of_week, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu')`,
      [doctor_id]
    );

    res.json({ schedules });
  } catch (error) {
    console.error('Get doctor schedules error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const createAppointment = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { doctor_id, appointment_date, appointment_time, complaint } = req.body;
    const patientId = req.user.id;

    // Check if appointment already exists
    const [existing] = await connection.query(
      `SELECT id FROM appointments 
       WHERE patient_id = ? AND doctor_id = ? AND appointment_date = ? AND status != 'cancelled'`,
      [patientId, doctor_id, appointment_date]
    );

    if (existing.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Anda sudah memiliki janji di tanggal ini' });
    }

    // Create appointment
    const [appointmentResult] = await connection.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, complaint, status)
       VALUES (?, ?, ?, ?, ?, 'confirmed')`,
      [patientId, doctor_id, appointment_date, appointment_time, complaint]
    );

    const appointmentId = appointmentResult.insertId;

    // Generate queue number
    const [queueCount] = await connection.query(
      'SELECT COUNT(*) as count FROM queue WHERE queue_date = ?',
      [appointment_date]
    );

    const queueNumber = queueCount[0].count + 1;

    // Create queue
    await connection.query(
      'INSERT INTO queue (appointment_id, queue_number, queue_date) VALUES (?, ?, ?)',
      [appointmentId, queueNumber, appointment_date]
    );

    // Create notification
    await connection.query(
      `INSERT INTO notifications (user_id, title, message, type, related_id)
       VALUES (?, ?, ?, 'appointment', ?)`,
      [patientId, 'Pendaftaran Berhasil', 
       `Nomor antrian Anda: ${queueNumber}. Tanggal: ${appointment_date}`, appointmentId]
    );

    await connection.commit();

    res.status(201).json({
      message: 'Pendaftaran berhasil',
      appointmentId,
      queueNumber
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  } finally {
    connection.release();
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;

    const [appointments] = await pool.query(
      `SELECT a.*, p.full_name as doctor_name, q.queue_number, q.status as queue_status
       FROM appointments a
       LEFT JOIN profiles p ON a.doctor_id = p.user_id
       LEFT JOIN queue q ON a.id = q.appointment_id
       WHERE a.patient_id = ?
       ORDER BY a.appointment_date DESC`,
      [patientId]
    );

    res.json({ appointments });
  } catch (error) {
    console.error('Get my appointments error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getQueueStatus = async (req, res) => {
  try {
    const { appointment_id } = req.params;
    const patientId = req.user.id;

    const [queue] = await pool.query(
      `SELECT q.*, a.appointment_date, p.full_name as doctor_name
       FROM queue q
       LEFT JOIN appointments a ON q.appointment_id = a.id
       LEFT JOIN profiles p ON a.doctor_id = p.user_id
       WHERE q.appointment_id = ? AND a.patient_id = ?`,
      [appointment_id, patientId]
    );

    if (queue.length === 0) {
      return res.status(404).json({ message: 'Antrian tidak ditemukan' });
    }

    // Get current queue
    const [currentQueue] = await pool.query(
      `SELECT queue_number FROM queue 
       WHERE queue_date = ? AND status = 'in_progress'`,
      [queue[0].queue_date]
    );

    res.json({
      queue: queue[0],
      currentQueueNumber: currentQueue.length > 0 ? currentQueue[0].queue_number : 0
    });
  } catch (error) {
    console.error('Get queue status error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Online Consultation
export const createConsultation = async (req, res) => {
  try {
    const { doctor_id, consultation_type, scheduled_at, notes } = req.body;
    const patientId = req.user.id;

    const [result] = await pool.query(
      `INSERT INTO consultations (patient_id, doctor_id, consultation_type, scheduled_at, notes, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [patientId, doctor_id, consultation_type, scheduled_at || null, notes || null]
    );

    res.status(201).json({
      message: 'Konsultasi berhasil dibuat',
      consultationId: result.insertId
    });
  } catch (error) {
    console.error('Create consultation error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getMyConsultations = async (req, res) => {
  try {
    const patientId = req.user.id;

    const [consultations] = await pool.query(
      `SELECT c.*, p.full_name as doctor_name, p.profile_picture as doctor_picture
       FROM consultations c
       LEFT JOIN profiles p ON c.doctor_id = p.user_id
       WHERE c.patient_id = ?
       ORDER BY c.created_at DESC`,
      [patientId]
    );

    res.json({ consultations });
  } catch (error) {
    console.error('Get my consultations error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const sendConsultationMessage = async (req, res) => {
  try {
    const { consultation_id, message } = req.body;
    const senderId = req.user.id;

    const [result] = await pool.query(
      'INSERT INTO consultation_messages (consultation_id, sender_id, message) VALUES (?, ?, ?)',
      [consultation_id, senderId, message]
    );

    res.status(201).json({
      message: 'Pesan berhasil dikirim',
      messageId: result.insertId
    });
  } catch (error) {
    console.error('Send consultation message error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getConsultationMessages = async (req, res) => {
  try {
    const { consultation_id } = req.params;

    const [messages] = await pool.query(
      `SELECT cm.*, p.full_name as sender_name
       FROM consultation_messages cm
       LEFT JOIN profiles p ON cm.sender_id = p.user_id
       WHERE cm.consultation_id = ?
       ORDER BY cm.created_at ASC`,
      [consultation_id]
    );

    res.json({ messages });
  } catch (error) {
    console.error('Get consultation messages error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
