import { getAuthToken } from "./auth";

// ============================================================================
// API DTO TYPES
// ============================================================================

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PagedRequestParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
  searchTerm?: string;
}

export interface AssetClassDto {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface AssetCategoryDto {
  id: number;
  assetClassId: number;
  parentCategoryId?: number | null;
  code: string;
  name: string;
  description?: string;
  path?: string;
  depth?: number;
  displayOrder?: number;
  isActive: boolean;
}

export interface CategoryAttributeOptionDto {
  id: number;
  attributeId: number;
  value: string;
  label: string;
  displayOrder?: number;
  isActive: boolean;
}

export interface CategoryAttributeDto {
  id: number;
  categoryId: number;
  code: string;
  name: string;
  dataType: string | number;
  isRequired: boolean;
  isSearchable: boolean;
  isFilterable: boolean;
  displayOrder?: number;
  description?: string;
  defaultValue?: string;
  validationRules?: string;
  isActive: boolean;
  options?: CategoryAttributeOptionDto[];
}

export interface AssetStatusDto {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CurrencyDto {
  code: string;
  name: string;
  symbol?: string;
}

export interface DepreciationMethodDto {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface LifecycleEventTypeDto {
  id: number;
  stage?: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface LocationDto {
  id: number;
  parentLocationId?: number | null;
  code: string;
  name: string;
  locationType?: string;
  address?: string;
  isActive: boolean;
}

export interface AssetDto {
  id: string;
  assetCode: string;
  name: string;
  description?: string;
  ownership: number | string;
  assetClassId: number;
  assetClassName?: string;
  categoryId: number;
  categoryName?: string;
  statusId: number;
  statusName?: string;
  departmentId?: string;
  custodianId?: string;
  currentLocationId?: number;
  currentLocationName?: string;
  extraAttributes?: string;
  isActive: boolean;
}

export interface CreateAssetDto {
  assetCode: string;
  name: string;
  description?: string;
  ownership: number;
  assetClassId: number;
  categoryId: number;
  statusId: number;
  departmentId?: string | null;
  custodianId?: string | null;
  currentLocationId?: number | null;
  extraAttributes?: string | null;
  isActive?: boolean;
}

export interface UpdateAssetDto extends CreateAssetDto {}

export interface CreateAssetAcquisitionDto {
  assetId: string;
  acquisitionDate: string;
  acquisitionCost: number;
  currencyCode: string;
  supplierId?: string | null;
  purchaseReference?: string | null;
  acquisitionType: number;
  warrantyExpiryDate?: string | null;
}

export interface CreateAssetDepreciationScheduleDto {
  assetId: string;
  methodId: number;
  usefulLifeMonths: number;
  salvageValue: number;
  startDate: string;
  isActive?: boolean;
}

export interface CreateLocationDto {
  parentLocationId?: number | null;
  code: string;
  name: string;
  locationType?: string;
  address?: string;
  isActive?: boolean;
}

export interface CreateAssetCategoryDto {
  assetClassId: number;
  parentCategoryId?: number | null;
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateAssetClassDto {
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateAssetClassDto extends CreateAssetClassDto {
  isActive: boolean;
}

export interface UpdateAssetCategoryDto extends CreateAssetCategoryDto {
  isActive: boolean;
}

export interface CreateCategoryAttributeDto {
  categoryId: number;
  code: string;
  name: string;
  dataType: number;
  isRequired: boolean;
  isSearchable: boolean;
  isFilterable: boolean;
  displayOrder?: number | null;
  description?: string | null;
  defaultValue?: string | null;
  validationRules?: string | null;
  isActive?: boolean;
}

export interface UpdateCategoryAttributeDto extends CreateCategoryAttributeDto {
  isActive: boolean;
}

export interface CreateCategoryAttributeOptionDto {
  attributeId: number;
  value: string;
  label: string;
  displayOrder?: number | null;
  isActive?: boolean;
}

export interface UpdateCategoryAttributeOptionDto extends CreateCategoryAttributeOptionDto {
  isActive: boolean;
}

export interface CreateAssetStatusDto {
  code: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
}

export interface UpdateAssetStatusDto extends CreateAssetStatusDto {
  isActive: boolean;
}

export interface UpdateLocationDto extends CreateLocationDto {
  isActive: boolean;
}

export interface CreateCurrencyDto {
  code: string;
  name: string;
  symbol?: string | null;
}

export interface UpdateCurrencyDto extends CreateCurrencyDto {}

export interface CreateDepreciationMethodDto {
  code: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
}

export interface UpdateDepreciationMethodDto extends CreateDepreciationMethodDto {
  isActive: boolean;
}

export interface CreateLifecycleEventTypeDto {
  stage?: string | null;
  code: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
}

export interface UpdateLifecycleEventTypeDto extends CreateLifecycleEventTypeDto {
  isActive: boolean;
}

// ============================================================================
// ENUM MAPPINGS
// ============================================================================

export const OWNERSHIP_TO_INT: Record<string, number> = {
  OWNED: 0,
  LEASED: 1,
  RENTED: 2,
  FINANCE: 3,
};

export const OWNERSHIP_FROM_INT: Record<number, string> = {
  0: "Owned",
  1: "Leased",
  2: "Rented",
  3: "Finance",
};

export const ACQUISITION_TO_INT: Record<string, number> = {
  PURCHASE: 0,
  FOC: 1,
  DONATION: 2,
  TRANSFER: 3,
};

// ============================================================================
// HTTP CLIENT WRAPPER
// ============================================================================

async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `API request to ${url} failed with status ${response.status}: ${errorText || response.statusText}`,
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

function buildQuery(params?: PagedRequestParams): string {
  if (!params) return "";
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  if (params.sortBy) q.set("sortBy", params.sortBy);
  if (params.sortDescending !== undefined) q.set("sortDescending", String(params.sortDescending));
  if (params.searchTerm) q.set("searchTerm", params.searchTerm);
  const str = q.toString();
  return str ? `?${str}` : "";
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const api = {
  // Lookups & Masters
  async getAssetClasses(params?: PagedRequestParams): Promise<PagedResponse<AssetClassDto>> {
    return apiFetch<PagedResponse<AssetClassDto>>(`/api/assets/AssetClass${buildQuery({ pageSize: 100, ...params })}`);
  },

  async createAssetClass(dto: CreateAssetClassDto): Promise<AssetClassDto> {
    return apiFetch<AssetClassDto>("/api/assets/AssetClass", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  async getAssetCategories(params?: PagedRequestParams): Promise<PagedResponse<AssetCategoryDto>> {
    return apiFetch<PagedResponse<AssetCategoryDto>>(`/api/AssetCategories${buildQuery({ pageSize: 500, ...params })}`);
  },

  async createAssetCategory(dto: CreateAssetCategoryDto): Promise<AssetCategoryDto> {
    return apiFetch<AssetCategoryDto>("/api/AssetCategories", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  async getCategoryAttributes(params?: PagedRequestParams): Promise<PagedResponse<CategoryAttributeDto>> {
    return apiFetch<PagedResponse<CategoryAttributeDto>>(`/api/CategoryAttributes${buildQuery({ pageSize: 500, ...params })}`);
  },

  async getCategoryAttributeOptions(params?: PagedRequestParams): Promise<PagedResponse<CategoryAttributeOptionDto>> {
    return apiFetch<PagedResponse<CategoryAttributeOptionDto>>(`/api/CategoryAttributeOptions${buildQuery({ pageSize: 500, ...params })}`);
  },

  async getAssetStatuses(params?: PagedRequestParams): Promise<PagedResponse<AssetStatusDto>> {
    return apiFetch<PagedResponse<AssetStatusDto>>(`/api/assets/AssetStatus${buildQuery({ pageSize: 100, ...params })}`);
  },

  async getCurrencies(params?: PagedRequestParams): Promise<PagedResponse<CurrencyDto>> {
    return apiFetch<PagedResponse<CurrencyDto>>(`/api/assets/Currency${buildQuery({ pageSize: 100, ...params })}`);
  },

  async getDepreciationMethods(params?: PagedRequestParams): Promise<PagedResponse<DepreciationMethodDto>> {
    return apiFetch<PagedResponse<DepreciationMethodDto>>(`/api/assets/DepreciationMethod${buildQuery({ pageSize: 100, ...params })}`);
  },

  async getLifecycleEventTypes(params?: PagedRequestParams): Promise<PagedResponse<LifecycleEventTypeDto>> {
    return apiFetch<PagedResponse<LifecycleEventTypeDto>>(`/api/assets/LifecycleEventType${buildQuery({ pageSize: 100, ...params })}`);
  },

  // Locations
  async getLocations(params?: PagedRequestParams): Promise<PagedResponse<LocationDto>> {
    return apiFetch<PagedResponse<LocationDto>>(`/api/assets/Location${buildQuery({ pageSize: 500, ...params })}`);
  },

  async getLocationById(id: number): Promise<LocationDto> {
    return apiFetch<LocationDto>(`/api/assets/Location/${id}`);
  },

  async createLocation(dto: CreateLocationDto): Promise<LocationDto> {
    return apiFetch<LocationDto>("/api/assets/Location", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  async getAssetClassById(id: number): Promise<AssetClassDto> {
    return apiFetch<AssetClassDto>(`/api/assets/AssetClass/${id}`);
  },

  async updateAssetClass(id: number, dto: UpdateAssetClassDto): Promise<void> {
    return apiFetch<void>(`/api/assets/AssetClass/${id}`, { method: "PUT", body: JSON.stringify(dto) });
  },

  async deleteAssetClass(id: number): Promise<void> {
    return apiFetch<void>(`/api/assets/AssetClass/${id}`, { method: "DELETE" });
  },

  async getAssetCategoryById(id: number): Promise<AssetCategoryDto> {
    return apiFetch<AssetCategoryDto>(`/api/AssetCategories/${id}`);
  },

  async updateAssetCategory(id: number, dto: UpdateAssetCategoryDto): Promise<AssetCategoryDto> {
    return apiFetch<AssetCategoryDto>(`/api/AssetCategories/${id}`, { method: "PUT", body: JSON.stringify(dto) });
  },

  async deleteAssetCategory(id: number): Promise<void> {
    return apiFetch<void>(`/api/AssetCategories/${id}`, { method: "DELETE" });
  },

  async getCategoryAttributeById(id: number): Promise<CategoryAttributeDto> {
    return apiFetch<CategoryAttributeDto>(`/api/CategoryAttributes/${id}`);
  },

  async createCategoryAttribute(dto: CreateCategoryAttributeDto): Promise<CategoryAttributeDto> {
    return apiFetch<CategoryAttributeDto>("/api/CategoryAttributes", { method: "POST", body: JSON.stringify(dto) });
  },

  async updateCategoryAttribute(id: number, dto: UpdateCategoryAttributeDto): Promise<CategoryAttributeDto> {
    return apiFetch<CategoryAttributeDto>(`/api/CategoryAttributes/${id}`, { method: "PUT", body: JSON.stringify(dto) });
  },

  async deleteCategoryAttribute(id: number): Promise<void> {
    return apiFetch<void>(`/api/CategoryAttributes/${id}`, { method: "DELETE" });
  },

  async getCategoryAttributeOptionById(id: number): Promise<CategoryAttributeOptionDto> {
    return apiFetch<CategoryAttributeOptionDto>(`/api/CategoryAttributeOptions/${id}`);
  },

  async createCategoryAttributeOption(dto: CreateCategoryAttributeOptionDto): Promise<CategoryAttributeOptionDto> {
    return apiFetch<CategoryAttributeOptionDto>("/api/CategoryAttributeOptions", { method: "POST", body: JSON.stringify(dto) });
  },

  async updateCategoryAttributeOption(id: number, dto: UpdateCategoryAttributeOptionDto): Promise<CategoryAttributeOptionDto> {
    return apiFetch<CategoryAttributeOptionDto>(`/api/CategoryAttributeOptions/${id}`, { method: "PUT", body: JSON.stringify(dto) });
  },

  async deleteCategoryAttributeOption(id: number): Promise<void> {
    return apiFetch<void>(`/api/CategoryAttributeOptions/${id}`, { method: "DELETE" });
  },

  async getAssetStatusById(id: number): Promise<AssetStatusDto> {
    return apiFetch<AssetStatusDto>(`/api/assets/AssetStatus/${id}`);
  },

  async createAssetStatus(dto: CreateAssetStatusDto): Promise<AssetStatusDto> {
    return apiFetch<AssetStatusDto>("/api/assets/AssetStatus", { method: "POST", body: JSON.stringify(dto) });
  },

  async updateAssetStatus(id: number, dto: UpdateAssetStatusDto): Promise<void> {
    return apiFetch<void>(`/api/assets/AssetStatus/${id}`, { method: "PUT", body: JSON.stringify(dto) });
  },

  async deleteAssetStatus(id: number): Promise<void> {
    return apiFetch<void>(`/api/assets/AssetStatus/${id}`, { method: "DELETE" });
  },

  async updateLocation(id: number, dto: UpdateLocationDto): Promise<void> {
    return apiFetch<void>(`/api/assets/Location/${id}`, { method: "PUT", body: JSON.stringify(dto) });
  },

  async deleteLocation(id: number): Promise<void> {
    return apiFetch<void>(`/api/assets/Location/${id}`, { method: "DELETE" });
  },

  async createCurrency(dto: CreateCurrencyDto): Promise<CurrencyDto> {
    return apiFetch<CurrencyDto>("/api/assets/Currency", { method: "POST", body: JSON.stringify(dto) });
  },

  async updateCurrency(id: string, dto: UpdateCurrencyDto): Promise<void> {
    return apiFetch<void>(`/api/assets/Currency/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(dto) });
  },

  async deleteCurrency(id: string): Promise<void> {
    return apiFetch<void>(`/api/assets/Currency/${encodeURIComponent(id)}`, { method: "DELETE" });
  },

  async createDepreciationMethod(dto: CreateDepreciationMethodDto): Promise<DepreciationMethodDto> {
    return apiFetch<DepreciationMethodDto>("/api/assets/DepreciationMethod", { method: "POST", body: JSON.stringify(dto) });
  },

  async updateDepreciationMethod(id: number, dto: UpdateDepreciationMethodDto): Promise<void> {
    return apiFetch<void>(`/api/assets/DepreciationMethod/${id}`, { method: "PUT", body: JSON.stringify(dto) });
  },

  async deleteDepreciationMethod(id: number): Promise<void> {
    return apiFetch<void>(`/api/assets/DepreciationMethod/${id}`, { method: "DELETE" });
  },

  async createLifecycleEventType(dto: CreateLifecycleEventTypeDto): Promise<LifecycleEventTypeDto> {
    return apiFetch<LifecycleEventTypeDto>("/api/assets/LifecycleEventType", { method: "POST", body: JSON.stringify(dto) });
  },

  async updateLifecycleEventType(id: number, dto: UpdateLifecycleEventTypeDto): Promise<void> {
    return apiFetch<void>(`/api/assets/LifecycleEventType/${id}`, { method: "PUT", body: JSON.stringify(dto) });
  },

  async deleteLifecycleEventType(id: number): Promise<void> {
    return apiFetch<void>(`/api/assets/LifecycleEventType/${id}`, { method: "DELETE" });
  },

  // Assets
  async getAssets(params?: PagedRequestParams): Promise<PagedResponse<AssetDto>> {
    return apiFetch<PagedResponse<AssetDto>>(`/api/Assets${buildQuery({ pageSize: 50, ...params })}`);
  },

  async getAssetById(id: string): Promise<AssetDto> {
    return apiFetch<AssetDto>(`/api/Assets/${id}`);
  },

  async createAsset(dto: CreateAssetDto): Promise<AssetDto> {
    return apiFetch<AssetDto>("/api/Assets", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  async updateAsset(id: string, dto: UpdateAssetDto): Promise<AssetDto> {
    return apiFetch<AssetDto>(`/api/Assets/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    });
  },

  async deleteAsset(id: string): Promise<void> {
    return apiFetch<void>(`/api/Assets/${id}`, {
      method: "DELETE",
    });
  },

  // Asset Acquisitions
  async createAssetAcquisition(dto: CreateAssetAcquisitionDto): Promise<any> {
    return apiFetch("/api/AssetAcquisitions", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },

  // Asset Depreciation Schedules
  async createAssetDepreciationSchedule(dto: CreateAssetDepreciationScheduleDto): Promise<any> {
    return apiFetch("/api/assets/AssetDepreciationSchedules", {
      method: "POST",
      body: JSON.stringify(dto),
    });
  },
};
