export interface Training {
  title: string;
  cpfCode: string | null;
  edofTitle: string | null;
  duration: string;
  description: string;
  slug: string;
  alias: string;
  fullAlias: string;
  path: string;
  type: string;
  standardPrice: number;
  customPrice: number;
  customPriceExtra: number;
  remotelyPrice: number;
  objectives: string;
  prerequisites: string;
  trainingOrder: number;
}
