// employeePhoto.controller.ts
import { Request, Response } from "express";
import { EmployeePhotoModel } from "./employeePhoto.model.js";
import { compressAndSaveImage, deletePhotoFile, UPLOAD_DIR } from "./employeePhoto.helper.js";
import path from "path";

// Upload foto profil
export const uploadEmployeePhoto = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { employee_code } = req.params;
    const file = req.file;

    if (!file) {
      res.status(400).json({
        success: false,
        message: "Tidak ada file yang diupload",
        employee_code: employee_code || null,
      });
      return;
    }

    // Validasi employee_code
    if (!employee_code || employee_code.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Employee code is required",
        employee_code: null,
      });
      return;
    }

    const originalSize = file.size;
    console.log(`Uploading photo for ${employee_code} - Original: ${file.originalname} (${(originalSize / 1024 / 1024).toFixed(2)}MB)`);

    // Cek apakah sudah ada foto sebelumnya
    const existingPhoto = await EmployeePhotoModel.findByEmployeeCode(employee_code);
    
    // Compress dan save ke filesystem
    const { filename, filePath, mimetype, size } = await compressAndSaveImage(
      file.buffer,
      file.mimetype,
      employee_code,
      file.originalname
    );

    const wasCompressed = size < originalSize;

    // Simpan metadata ke database
    await EmployeePhotoModel.upsert(
      employee_code,
      filename,
      filePath,
      mimetype,
      size
    );

    // Hapus file lama jika ada
    if (existingPhoto && existingPhoto.filename) {
      await deletePhotoFile(existingPhoto.filename);
    }

    res.status(200).json({
      success: true,
      message: wasCompressed 
        ? `Foto profil untuk ${employee_code} berhasil diupload dan dikompres dari ${(originalSize / 1024 / 1024).toFixed(2)}MB ke ${(size / 1024 / 1024).toFixed(2)}MB`
        : `Foto profil untuk ${employee_code} berhasil diupload`,
      employee_code,
      data: {
        employee_code,
        filename,
        file_path: filePath,
        photo_url: `${req.protocol}://${req.get('host')}/api/v1/employee-photos/${employee_code}`,
        mimetype,
        file_size: size,
        uploaded_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Error upload foto:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengupload foto profil",
      employee_code: req.params.employee_code || null,
    });
  }
};

// Get foto profil (serve file)
export const fetchEmployeePhoto = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { employee_code } = req.params;

    const photo = await EmployeePhotoModel.findByEmployeeCode(employee_code);

    if (!photo) {
      res.status(404).json({
        success: false,
        message: `Foto profil untuk ${employee_code} tidak ditemukan`,
        employee_code,
      });
      return;
    }

    // Serve file dari filesystem
    const filePath = path.join(UPLOAD_DIR, photo.filename);
    
    // Set headers
    res.set("Content-Type", photo.mimetype);
    res.set("Cache-Control", "public, max-age=86400"); // Cache 1 hari
    
    // Send file
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error get foto:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil foto profil",
      employee_code: req.params.employee_code || null,
    });
  }
};

// Delete foto profil
export const destroyEmployeePhoto = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { employee_code } = req.params;

    // Ambil data foto untuk mendapatkan filename
    const photo = await EmployeePhotoModel.findByEmployeeCode(employee_code);

    if (!photo) {
      res.status(404).json({
        success: false,
        message: `Foto profil untuk ${employee_code} tidak ditemukan`,
        employee_code,
      });
      return;
    }

    // Hapus dari database
    const deleted = await EmployeePhotoModel.delete(employee_code);

    if (deleted) {
      // Hapus file dari filesystem
      await deletePhotoFile(photo.filename);
    }

    res.status(200).json({
      success: true,
      message: `Foto profil untuk ${employee_code} berhasil dihapus`,
      employee_code,
    });
  } catch (error) {
    console.error("Error delete foto:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus foto profil",
      employee_code: req.params.employee_code || null,
    });
  }
};