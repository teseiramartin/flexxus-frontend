import type { Sucursal } from '@/src/types/dashboard'
import BaseProxy from './BaseProxy'
export class SucursalesProxy extends BaseProxy {
  constructor() {
    super('/api/v1/sucursales')
  }
  getAll() {
    return this.get<Sucursal[]>()
  }
}
