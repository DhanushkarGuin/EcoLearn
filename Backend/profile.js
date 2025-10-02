// profile.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load env variables at the top
dotenv.config({ path: './.env' });

const app = express();
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// ---------------- ROUTES ---------------- //

// Create or update student profile
app.post('/api/students', upload.single('photo'), async (req, res) => {
  try {
    const { name, studentClass, rollNumber } = req.body;

    if (!name || !studentClass || !rollNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let photoUrl = null;

    // Upload photo if provided
    if (req.file) {
      const fileExt = path.extname(req.file.originalname);
      const fileName = `student-${Date.now()}${fileExt}`;
      const filePath = req.file.path;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, fs.createReadStream(filePath), { cacheControl: '3600', upsert: true });

      if (uploadError) {
        console.error(uploadError);
        fs.unlinkSync(filePath); // Clean up temp file
        return res.status(500).json({ message: 'Failed to upload image', error: uploadError.message });
      }

      const { data: publicData, error: publicError } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      if (publicError) {
        console.error(publicError);
        fs.unlinkSync(filePath);
        return res.status(500).json({ message: 'Failed to get public URL', error: publicError.message });
      }

      photoUrl = publicData.publicUrl;

      // Remove temp file
      fs.unlinkSync(filePath);
    }

    // Check if student exists
    const { data: existingStudent, error: fetchError } = await supabase
      .from('students')
      .select('*')
      .eq('roll_number', rollNumber)
      .single();

    let studentData;

    if (existingStudent) {
      // Update
      const { data, error } = await supabase
        .from('students')
        .update({ name, student_class: studentClass, photo_url: photoUrl })
        .eq('roll_number', rollNumber)
        .select()
        .single();

      if (error) throw error;
      studentData = data;
    } else {
      // Insert
      const { data, error } = await supabase
        .from('students')
        .insert([{ name, student_class: studentClass, roll_number: rollNumber, photo_url: photoUrl, points: 0, rank: 'N/A' }])
        .select()
        .single();

      if (error) throw error;
      studentData = data;
    }

    return res.json({ success: true, data: studentData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});

// Get student profile by roll number
app.get('/api/students/:rollNumber', async (req, res) => {
  try {
    const { rollNumber } = req.params;

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('roll_number', rollNumber)
      .single();

    if (error) return res.status(404).json({ success: false, message: 'Student not found', error: error.message });

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
