import type { Sucursal } from '@/src/types/dashboard'
import BaseProxy from './BaseProxy'
export class SucursalesProxy extends BaseProxy {
  getAll() {
    return this.get<Sucursal[]>('/api/v1/Sucursales')
  }
  getByCode(code: string) {
    return this.get<Sucursal>(`/api/v1/Sucursales/${encodeURIComponent(code)}`)
  }
}
export default SucursalesProxy
