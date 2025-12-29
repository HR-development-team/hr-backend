// employeePhoto.helper.ts
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

// Konfigurasi storage untuk menyimpan di memory (buffer)
const storage = multer.memoryStorage();

// Filter untuk hanya menerima file gambar (HEIC tidak didukung untuk sementara)
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    "image/jpeg", 
    "image/jpg", 
    "image/png", 
    "image/gif", 
    "image/webp"
  ];

  // Cek apakah file HEIC/HEIF
  const isHeic = file.mimetype.includes('heic') || 
                 file.mimetype.includes('heif') || 
                 file.originalname.toLowerCase().endsWith('.heic') ||
                 file.originalname.toLowerCase().endsWith('.heif');

  if (isHeic) {
    cb(new Error('Format HEIC/HEIF tidak didukung. Silakan convert ke JPEG/PNG terlebih dahulu atau gunakan aplikasi converter seperti https://heictojpg.com'));
  } else if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar (JPEG, PNG, GIF, WEBP) yang diperbolehkan"));
  }
};

export const uploadPhoto = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Max 10MB untuk upload (akan di-compress jika > 2MB)
  },
});

// Path untuk menyimpan foto
export const UPLOAD_DIR = path.join(process.cwd(), "uploads", "employee-photos");

// Pastikan folder upload ada
export const ensureUploadDirExists = async (): Promise<void> => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    console.log(`Created upload directory: ${UPLOAD_DIR}`);
  }
};

// Generate filename unik
export const generateFilename = (employeeCode: string, mimetype: string): string => {
  const ext = mimetype.split('/')[1]; // jpeg, png, etc
  const timestamp = Date.now();
  return `${employeeCode}_${timestamp}.${ext}`;
};

// Fungsi untuk compress gambar jika lebih dari 2MB dan save ke file
export const compressAndSaveImage = async (
  buffer: Buffer,
  mimetype: string,
  employeeCode: string,
  originalFilename?: string
): Promise<{ filename: string; filePath: string; mimetype: string; size: number }> => {
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  const originalSize = buffer.length;

  console.log(`Processing image: ${originalFilename || 'unknown'} - Size: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);

  await ensureUploadDirExists();

  let processedBuffer = buffer;
  let finalMimetype = mimetype;

  // Jika lebih dari 2MB, compress
  if (originalSize > MAX_SIZE) {
    console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)}MB - Compressing...`);

    let quality = 80;
    let attempts = 0;
    const maxAttempts = 5;

    while (processedBuffer.length > MAX_SIZE && attempts < maxAttempts) {
      processedBuffer = await sharp(buffer)
        .resize(1920, 1920, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();

      console.log(
        `Attempt ${attempts + 1}: Quality ${quality}% - Size: ${(processedBuffer.length / 1024 / 1024).toFixed(2)}MB`
      );

      quality -= 10;
      attempts++;
    }

    // Jika masih lebih dari 2MB, resize lebih agresif
    if (processedBuffer.length > MAX_SIZE) {
      processedBuffer = await sharp(buffer)
        .resize(1024, 1024, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 60, mozjpeg: true })
        .toBuffer();

      console.log(`Final aggressive resize: ${(processedBuffer.length / 1024 / 1024).toFixed(2)}MB`);
    }

    finalMimetype = "image/jpeg"; // After compression, always JPEG
  }

  // Generate filename
  const filename = generateFilename(employeeCode, finalMimetype);
  const filePath = path.join(UPLOAD_DIR, filename);

  // Save to filesystem
  await fs.writeFile(filePath, processedBuffer);
  console.log(`File saved: ${filePath}`);

  return {
    filename,
    filePath: `uploads/employee-photos/${filename}`, // Relative path untuk disimpan di DB
    mimetype: finalMimetype,
    size: processedBuffer.length,
  };
};

// Fungsi untuk hapus file foto lama
export const deletePhotoFile = async (filename: string): Promise<void> => {
  try {
    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.unlink(filePath);
    console.log(`File deleted: ${filePath}`);
  } catch (error) {
    console.error(`Error deleting file: ${error}`);
    // Tidak throw error, karena file mungkin sudah tidak ada
  }
};