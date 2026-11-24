export const STORE = {
  name: 'Nova gadgets',
  whatsapp: '573203708381',   // con código de país (57), solo dígitos
  phoneLabel: '320 370 8381',
  // Redes sociales: pega la URL en cada una y el círculo se vuelve un enlace.
  // Para quitar una red, borra su línea.
  socials: [
    { key: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61595436444690' },
    { key: 'tiktok', name: 'TikTok', url: '' },
  ] as { key: string; name: string; url: string }[],
};