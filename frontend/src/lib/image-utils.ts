export async function compressImageToWebp(file: File, quality = 0.95): Promise<File> {
  // Solo convertir imágenes (ignorando SVGs que no deben rasterizarse y GIFs que perderían animación)
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const MAX_DIMENSION = 2560; // Aumentado a 2560 (2.5K) para no perder calidad
        let targetWidth = img.width;
        let targetHeight = img.height;

        if (targetWidth > MAX_DIMENSION || targetHeight > MAX_DIMENSION) {
          const ratio = Math.min(MAX_DIMENSION / targetWidth, MAX_DIMENSION / targetHeight);
          targetWidth = Math.round(targetWidth * ratio);
          targetHeight = Math.round(targetHeight * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // fallback if canvas fails
          return;
        }
        
        // NO dibujar fondo blanco, preservar la transparencia nativa para logos PNG.
        // Draw the resized image
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file); // fallback
              return;
            }
            
            // Reemplazar la extensión por .webp
            const originalName = file.name || 'image.jpg';
            const lastDotIndex = originalName.lastIndexOf('.');
            const newName = lastDotIndex > 0 
              ? originalName.substring(0, lastDotIndex) + '.webp' 
              : originalName + '.webp';

            const newFile = new File([blob], newName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            resolve(newFile);
          },
          'image/webp',
          quality
        );
      };
      img.onerror = (error) => {
        console.error('Error loading image for compression', error);
        resolve(file); // fallback to original file if parsing fails
      };
    };
    reader.onerror = (error) => {
      console.error('Error reading file', error);
      resolve(file);
    };
  });
}
