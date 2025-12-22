// employeePhoto.helper.ts
import multer from "multer";
import sharp from "sharp";

// Konfigurasi storage untuk menyimpan di memory (buffer)
const storage = multer.memoryStorage();

// Filter untuk hanya menerima file gambar
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
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

// Fungsi untuk compress gambar jika lebih dari 2MB
export const compressImage = async (
  buffer: Buffer,
  mimetype: string
): Promise<{ buffer: Buffer; mimetype: string; size: number }> => {
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  const originalSize = buffer.length;

  // Jika sudah di bawah 2MB, return langsung
  if (originalSize <= MAX_SIZE) {
    return {
      buffer,
      mimetype,
      size: originalSize,
    };
  }

  console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)}MB - Compressing...`);

  // Compress dengan sharp
  let quality = 80; // Mulai dengan quality 80%
  let compressedBuffer = buffer;
  let attempts = 0;
  const maxAttempts = 5;

  while (compressedBuffer.length > MAX_SIZE && attempts < maxAttempts) {
    compressedBuffer = await sharp(buffer)
      .resize(1920, 1920, { // Max width/height 1920px, maintain aspect ratio
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality, mozjpeg: true }) // Convert to JPEG with compression
      .toBuffer();

    console.log(
      `Attempt ${attempts + 1}: Quality ${quality}% - Size: ${(compressedBuffer.length / 1024 / 1024).toFixed(2)}MB`
    );

    quality -= 10; // Kurangi quality 10% per attempt
    attempts++;
  }

  // Jika masih lebih dari 2MB setelah 5 attempt, resize lebih agresif
  if (compressedBuffer.length > MAX_SIZE) {
    compressedBuffer = await sharp(buffer)
      .resize(1024, 1024, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 60, mozjpeg: true })
      .toBuffer();

    console.log(`Final aggressive resize: ${(compressedBuffer.length / 1024 / 1024).toFixed(2)}MB`);
  }

  return {
    buffer: compressedBuffer,
    mimetype: "image/jpeg", // Always return as JPEG after compression
    size: compressedBuffer.length,
  };
};