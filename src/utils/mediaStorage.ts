/**
 * Utility for handling user uploaded videos and certificates
 */

export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const fileToObjectUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const formatVideoUrl = (url: string): { embedUrl: string; isDirectVideo: boolean; isYoutube: boolean; isVimeo: boolean } => {
  if (!url) return { embedUrl: '', isDirectVideo: false, isYoutube: false, isVimeo: false };

  const trimmed = url.trim();

  // Blob URL or base64 data url or direct video extension
  if (
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:video') ||
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(trimmed)
  ) {
    return { embedUrl: trimmed, isDirectVideo: true, isYoutube: false, isVimeo: false };
  }

  // YouTube matchers
  // https://www.youtube.com/watch?v=dQw4w9WgXcQ
  // https://youtu.be/dQw4w9WgXcQ
  // https://www.youtube.com/embed/dQw4w9WgXcQ
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`,
      isDirectVideo: false,
      isYoutube: true,
      isVimeo: false,
    };
  }

  // Vimeo matcher
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      isDirectVideo: false,
      isYoutube: false,
      isVimeo: true,
    };
  }

  return { embedUrl: trimmed, isDirectVideo: false, isYoutube: false, isVimeo: false };
};
