const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

function generateSHA1(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  // Create a SHA-1 hash using SubtleCrypto
  return crypto.subtle.digest('SHA-1', data)
    .then(hashBuffer => {
      // Convert buffer to byte array
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      // Convert bytes to hex string
      const hashHex = hashArray
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      return hashHex;
    });
}

export async function generateSignature(params: Record<string, string>): Promise<string> {
  // Sort parameters alphabetically
  const sortedKeys = Object.keys(params).sort();
  
  // Create string of parameters and values
  const stringToSign = sortedKeys
    .map(key => `${key}=${params[key]}`)
    .join('&') + API_SECRET;

  // Generate SHA-1 hash
  return await generateSHA1(stringToSign);
}