export interface Banner {
  _id?: string;
  imageUrl?: string;
  showInPortal: boolean;
  priority: number;
  isActive?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannerApiResponse {
  errCode: number;
  status: boolean;
  msg: string;
  result: Banner[];
  totalCount?: number;
}
