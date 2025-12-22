// employeePhoto.controller.ts
import { Request, Response } from "express";
import { EmployeePhotoModel } from "./employeePhoto.model.js";
import { compressImage } from "./employeePhoto.helper.js";
import type { PhotoResponse } from "./employeePhoto.types.js";

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
      } as PhotoResponse);
      return;
    }

    // Validasi employee_code
    if (!employee_code || employee_code.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Employee code is required",
      } as PhotoResponse);
      return;
    }

    const originalSize = file.size;
    console.log(`Uploading photo for ${employee_code} - Original size: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);

    // Compress gambar jika lebih dari 2MB
    const { buffer, mimetype, size } = await compressImage(file.buffer, file.mimetype);

    const wasCompressed = size < originalSize;

    // Simpan ke database
    await EmployeePhotoModel.upsert(
      employee_code,
      buffer,
      mimetype,
      size
    );

    res.status(200).json({
      success: true,
      message: wasCompressed 
        ? `Foto profil berhasil diupload dan dikompres dari ${(originalSize / 1024 / 1024).toFixed(2)}MB ke ${(size / 1024 / 1024).toFixed(2)}MB`
        : "Foto profil berhasil diupload",
      data: {
        employee_code,
        mimetype,
        file_size: size,
        uploaded_at: new Date(),
        original_size: originalSize,
        compressed: wasCompressed,
      },
    } as PhotoResponse);
  } catch (error) {
    console.error("Error upload foto:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengupload foto profil",
    } as PhotoResponse);
  }
};

// Get foto profil
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
        message: "Foto profil tidak ditemukan",
      } as PhotoResponse);
      return;
    }

    // Set header content-type dan kirim binary data
    res.set("Content-Type", photo.mimetype);
    res.set("Cache-Control", "public, max-age=86400"); // Cache 1 hari
    res.send(photo.photo);
  } catch (error) {
    console.error("Error get foto:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil foto profil",
    } as PhotoResponse);
  }
};

// Delete foto profil
export const destroyEmployeePhoto = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { employee_code } = req.params;

    const deleted = await EmployeePhotoModel.delete(employee_code);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Foto profil tidak ditemukan",
      } as PhotoResponse);
      return;
    }

    res.status(200).json({
      success: true,
      message: "Foto profil berhasil dihapus",
    } as PhotoResponse);
  } catch (error) {
    console.error("Error delete foto:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus foto profil",
    } as PhotoResponse);
  }
};