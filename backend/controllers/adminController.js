import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

// Queue Management
export const getTodayQueue = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [queue] = await pool.query(
      `SELECT q.*, a.appointment_time,
              p_patient.full_name as patient_name,
              p_doctor.full_name as doctor_name
       FROM queue q
       LEFT JOIN appointments a ON q.appointment_id = a.id
       LEFT JOIN profiles p_patient ON a.patient_id = p_patient.user_id
       LEFT JOIN profiles p_doctor ON a.doctor_id = p_doctor.user_id
       WHERE q.queue_date = ?
       ORDER BY q.queue_number ASC`,
      [today]
    );

    res.json({ queue });
  } catch (error) {
    console.error('Get today queue error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const callQueue = async (req, res) => {
  try {
    const { queue_id } = req.body;

    const [result] = await pool.query(
      `UPDATE queue SET status = 'in_progress', called_at = NOW() WHERE id = ?`,
      [queue_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Antrian tidak ditemukan' });
    }

    // Get queue info for notification
    const [queueInfo] = await pool.query(
      `SELECT q.queue_number, a.patient_id 
       FROM queue q 
       LEFT JOIN appointments a ON q.appointment_id = a.id 
       WHERE q.id = ?`,
      [queue_id]
    );

    if (queueInfo.length > 0) {
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type, related_id)
         VALUES (?, ?, ?, 'queue', ?)`,
        [queueInfo[0].patient_id, 'Giliran Anda', 
         `Nomor antrian ${queueInfo[0].queue_number} dipanggil. Silakan menuju ruang praktek.`, queue_id]
      );
    }

    res.json({ message: 'Antrian berhasil dipanggil' });
  } catch (error) {
    console.error('Call queue error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const completeQueue = async (req, res) => {
  try {
    const { queue_id } = req.body;

    const [result] = await pool.query(
      `UPDATE queue SET status = 'completed', completed_at = NOW() WHERE id = ?`,
      [queue_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Antrian tidak ditemukan' });
    }

    res.json({ message: 'Antrian selesai' });
  } catch (error) {
    console.error('Complete queue error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const skipQueue = async (req, res) => {
  try {
    const { queue_id } = req.body;

    const [result] = await pool.query(
      `UPDATE queue SET status = 'skipped' WHERE id = ?`,
      [queue_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Antrian tidak ditemukan' });
    }

    res.json({ message: 'Antrian dilewati' });
  } catch (error) {
    console.error('Skip queue error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// User Management
export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    
    let query = `
      SELECT u.id, u.email, u.role, u.created_at,
             p.full_name, p.phone, p.address, p.date_of_birth, p.gender
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
    `;
    
    const params = [];
    
    if (role) {
      query += ' WHERE u.role = ?';
      params.push(role);
    }
    
    query += ' ORDER BY u.created_at DESC';

    const [users] = await pool.query(query, params);
    res.json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const createUser = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { email, password, role, full_name, phone, address, date_of_birth, gender } = req.body;

    const [existingUser] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await connection.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, role]
    );

    const userId = userResult.insertId;

    await connection.query(
      'INSERT INTO profiles (user_id, full_name, phone, address, date_of_birth, gender) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, full_name, phone || null, address || null, date_of_birth || null, gender || null]
    );

    await connection.commit();

    res.status(201).json({
      message: 'User berhasil dibuat',
      userId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  } finally {
    connection.release();
  }
};

export const updateUser = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { email, password, role, full_name, phone, address, date_of_birth, gender } = req.body;

    // Update user basic info
    if (password && password.trim() !== '') {
      // If password provided, hash and update
      const hashedPassword = await bcrypt.hash(password, 10);
      await connection.query(
        'UPDATE users SET email = ?, password = ?, role = ? WHERE id = ?',
        [email, hashedPassword, role, id]
      );
    } else {
      // If no password, update without changing password
      await connection.query(
        'UPDATE users SET email = ?, role = ? WHERE id = ?',
        [email, role, id]
      );
    }

    // Update profile
    await connection.query(
      `UPDATE profiles 
       SET full_name = ?, phone = ?, address = ?, date_of_birth = ?, gender = ?
       WHERE user_id = ?`,
      [full_name, phone || null, address || null, date_of_birth || null, gender || null, id]
    );

    await connection.commit();

    res.json({ message: 'User berhasil diperbarui' });
  } catch (error) {
    await connection.rollback();
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  } finally {
    connection.release();
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Patient Database
export const getAllPatients = async (req, res) => {
  try {
    const [patients] = await pool.query(
      `SELECT u.id, u.email, u.created_at,
              p.full_name, p.phone, p.address, p.date_of_birth, p.gender,
              COUNT(DISTINCT a.id) as total_visits,
              MAX(a.appointment_date) as last_visit
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       LEFT JOIN appointments a ON u.id = a.patient_id
       WHERE u.role = 'pasien'
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );

    res.json({ patients });
  } catch (error) {
    console.error('Get all patients error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getPatientDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const [patient] = await pool.query(
      `SELECT u.id, u.email, u.created_at,
              p.*
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = ? AND u.role = 'pasien'`,
      [id]
    );

    if (patient.length === 0) {
      return res.status(404).json({ message: 'Pasien tidak ditemukan' });
    }

    const [appointments] = await pool.query(
      `SELECT a.*, p.full_name as doctor_name
       FROM appointments a
       LEFT JOIN profiles p ON a.doctor_id = p.user_id
       WHERE a.patient_id = ?
       ORDER BY a.appointment_date DESC`,
      [id]
    );

    const [medicalRecords] = await pool.query(
      `SELECT mr.*, p.full_name as doctor_name
       FROM medical_records mr
       LEFT JOIN profiles p ON mr.doctor_id = p.user_id
       WHERE mr.patient_id = ?
       ORDER BY mr.record_date DESC`,
      [id]
    );

    res.json({
      patient: patient[0],
      appointments,
      medicalRecords
    });
  } catch (error) {
    console.error('Get patient detail error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Notifications Management
export const createNotification = async (req, res) => {
  try {
    const { user_id, title, message, type, scheduled_at } = req.body;

    const [result] = await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, scheduled_at)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, title, message, type || 'general', scheduled_at || null]
    );

    res.status(201).json({
      message: 'Notifikasi berhasil dibuat',
      notificationId: result.insertId
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const sendBulkNotification = async (req, res) => {
  try {
    const { role, title, message, type } = req.body;

    const [users] = await pool.query(
      'SELECT id FROM users WHERE role = ?',
      [role]
    );

    const values = users.map(user => [user.id, title, message, type || 'general']);

    if (values.length > 0) {
      await pool.query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES ?',
        [values]
      );
    }

    res.json({ message: `Notifikasi berhasil dikirim ke ${values.length} user` });
  } catch (error) {
    console.error('Send bulk notification error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [totalPatients] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE role = "pasien"'
    );

    const [totalDoctors] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE role = "dokter"'
    );

    const [todayAppointments] = await pool.query(
      'SELECT COUNT(*) as count FROM appointments WHERE appointment_date = ?',
      [today]
    );

    const [todayQueue] = await pool.query(
      'SELECT COUNT(*) as count FROM queue WHERE queue_date = ? AND status = "waiting"',
      [today]
    );

    const [recentAppointments] = await pool.query(
      `SELECT a.*, 
              p_patient.full_name as patient_name,
              p_doctor.full_name as doctor_name
       FROM appointments a
       LEFT JOIN profiles p_patient ON a.patient_id = p_patient.user_id
       LEFT JOIN profiles p_doctor ON a.doctor_id = p_doctor.user_id
       ORDER BY a.created_at DESC
       LIMIT 5`
    );

    res.json({
      stats: {
        totalPatients: totalPatients[0].count,
        totalDoctors: totalDoctors[0].count,
        todayAppointments: todayAppointments[0].count,
        todayQueue: todayQueue[0].count
      },
      recentAppointments
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
