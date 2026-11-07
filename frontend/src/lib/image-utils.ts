async function normalizeSvgToDataUrl(file: File): Promise<{ url: string; width?: number; height?: number }> {
  const rawText = await file.text();
  let svgText = rawText.trim();

  // Asegurar namespace xmlns si no existe
  if (svgText.includes('<svg') && !svgText.includes('xmlns=')) {
    svgText = svgText.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  let vbWidth: number | undefined;
  let vbHeight: number | undefined;
  const viewBoxMatch = svgText.match(/viewBox=["']\s*[-?\d.]+\s+[-?\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/i);
  if (viewBoxMatch) {
    const w = parseFloat(viewBoxMatch[1]);
    const h = parseFloat(viewBoxMatch[2]);
    if (w > 0 && h > 0) {
      const scale = 1200 / Math.max(w, h);
      vbWidth = Math.round(w * scale);
      vbHeight = Math.round(h * scale);
    }
  }

  const encoded = encodeURIComponent(svgText)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return {
    url: `data:image/svg+xml;charset=utf-8,${encoded}`,
    width: vbWidth,
    height: vbHeight,
  };
}

export async function compressImageToWebp(file: File, quality = 0.95): Promise<File> {
  // Solo convertir imágenes (ignorando GIFs que perderían animación; los SVGs sí se rasterizan en alta resolución con transparencia a WebP/PNG)
  const isSvg = file.type === 'image/svg+xml' || file.name?.toLowerCase().endsWith('.svg');
  if ((!file.type.startsWith('image/') && !isSvg) || file.type === 'image/gif') {
    return file;
  }

  let svgMeta: { url: string; width?: number; height?: number } | null = null;
  if (isSvg) {
    try {
      svgMeta = await normalizeSvgToDataUrl(file);
    } catch {
      svgMeta = null;
    }
  }

  return new Promise((resolve) => {
    const loadFromSrc = (src: string) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIMENSION = 2560; // Aumentado a 2560 (2.5K) para no perder calidad
        const MIN_SVG_DIMENSION = 1200; // Garantizar nitidez en logos vectoriales SVG
        let targetWidth = svgMeta?.width || img.naturalWidth || img.width || MIN_SVG_DIMENSION;
        let targetHeight = svgMeta?.height || img.naturalHeight || img.height || MIN_SVG_DIMENSION;

        if (isSvg && targetWidth < MIN_SVG_DIMENSION && targetHeight < MIN_SVG_DIMENSION) {
          const scaleUp = MIN_SVG_DIMENSION / Math.max(targetWidth, targetHeight, 1);
          targetWidth = Math.round(targetWidth * scaleUp);
          targetHeight = Math.round(targetHeight * scaleUp);
        }

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
        
        // NO dibujar fondo blanco, preservar la transparencia nativa para logos PNG/SVG.
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const originalName = file.name || 'image.jpg';
        const lastDotIndex = originalName.lastIndexOf('.');
        const baseName = lastDotIndex > 0 ? originalName.substring(0, lastDotIndex) : originalName;

        canvas.toBlob(
          (blob) => {
            if (blob && blob.type === 'image/webp') {
              resolve(
                new File([blob], `${baseName}.webp`, {
                  type: 'image/webp',
                  lastModified: Date.now(),
                })
              );
              return;
            }
            // Fallback a PNG (preserva transparencia en navegadores sin codificador WebP)
            canvas.toBlob(
              (pngBlob) => {
                if (!pngBlob) {
                  resolve(file);
                  return;
                }
                resolve(
                  new File([pngBlob], `${baseName}.png`, {
                    type: 'image/png',
                    lastModified: Date.now(),
                  })
                );
              },
              'image/png'
            );
          },
          'image/webp',
          quality
        );
      };
      img.onerror = (error) => {
        console.error('Error loading image for compression', error);
        resolve(file); // fallback to original file if parsing fails
      };
      img.src = src;
    };

    if (svgMeta) {
      loadFromSrc(svgMeta.url);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      loadFromSrc(event.target?.result as string);
    };
    reader.onerror = (error) => {
      console.error('Error reading file', error);
      resolve(file);
    };
  });
}
