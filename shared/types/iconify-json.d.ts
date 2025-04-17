export type IconifyJson = {
  prefix: string;
  icons: Record<string, { body: string }>;
  aliases: Record<string, { parent: string }>;
  lastModified: number;
  width: number;
  height: number;
};
