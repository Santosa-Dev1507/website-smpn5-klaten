export type Kelas = "VII" | "VIII" | "IX";

export type KisiKisiStatus = "tersedia" | "segera";

export interface KisiKisiItem {
  id: string;
  tahunAjaran: string;
  kelas: Kelas;
  mataPelajaran: string;
  status: KisiKisiStatus;
  linkUnduh: string;
  linkPreview: string;
}

export interface KisiKisiResponse {
  items: KisiKisiItem[];
  tahunAjaranList: string[];
  isDemo: boolean;
  updatedAt: string;
}
