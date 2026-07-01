// Roles de usuario (espelha UserRole do backend)
export const UserRoles = {
  SUPER_ADMIN:     'super_admin',
  ADMIN:           'admin',
  OPERATOR:        'operator',
  DRIVER:          'driver',
  MEDICAL_PARTNER: 'medical_partner',
  CLINIC_PARTNER:  'clinic_partner',
} as const

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles]

export interface UserData {
  id:        string
  companyId: string
  name:      string
  email:     string
  role:      UserRole
  phone:     string | null
  avatarUrl: string | null
  active:    boolean
  createdAt: string
  updatedAt: string
}

export interface CompanyBasic {
  id:     string
  name:   string
  plan:   string
  active: boolean
}

export interface MeResponse {
  user:    UserData
  company: CompanyBasic
}

export interface ApiSuccess<T> {
  success: true
  data:    T
  message?: string
}

export interface ApiError {
  success: false
  error:   string
  message: string
  details?: Record<string, string[]>
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface PaginatedResponse<T> {
  success: true
  data:    T[]
  meta: {
    total:      number
    page:       number
    limit:      number
    totalPages: number
  }
}

export function hasRole(user: UserData | null, roles: UserRole[]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

export function isAdmin(user: UserData | null): boolean {
  return hasRole(user, [UserRoles.ADMIN, UserRoles.SUPER_ADMIN])
}
