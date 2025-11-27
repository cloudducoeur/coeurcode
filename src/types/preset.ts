export interface QRCodePreset {
  id: string;
  name: string;
  color: string;
  backgroundColor: string;
  logoUrl?: string;
  logoWidth?: number;
  logoHeight?: number;
}

export const presets: QRCodePreset[] = [
  {
    id: 'restos-du-coeur',
    name: 'Restos du Cœur',
    color: '#E2147C',
    backgroundColor: '#FFFFFF',
    logoUrl: 'https://cdn.cookielaw.org/logos/9c585bbb-74b2-42fe-af0c-1d78dbc36f2d/d3330bd7-cef1-421a-9c06-7d5bc1509815/7b5fa8d3-3a1c-49f0-a583-0b610354c21b/logo_RDC_badge_blanc.png',
    logoWidth: 50,
    logoHeight: 50,
  },
  {
    id: 'radio-restos',
    name: 'Radio Restos',
    color: '#7A77B6',
    backgroundColor: '#FFFFFF',
    logoUrl: 'https://i.ibb.co/RT9Ggm7N/logo-radio-restos-badge.png',
    logoWidth: 50,
    logoHeight: 50,
  },
  {
    id: 'les-enfoires',
    name: 'Les Enfoirés',
    color: '#E2147C',
    backgroundColor: '#FFFFFF',
    logoUrl: 'https://i.ibb.co/WpxKtbDC/ezgif-2782b381c0257bcc.png',
    logoWidth: 50,
    logoHeight: 50,
  },
  {
    id: 'custom',
    name: 'Personnalisé',
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
];
