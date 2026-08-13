import axios from 'axios'
import type { Sucursal } from '@/src/types/dashboard'
import BaseProxy from './BaseProxy'

export class SucursalesProxy extends BaseProxy {
  constructor() {
    super()
    this._baseUrl = `${this._baseUrl}/api/v1/sucursales`
  }

  async getAll(): Promise<Sucursal[]> {
    const response = await axios.get(this._baseUrl)
    return response.data.data ?? response.data
  }

  async getByCode(code: string): Promise<Sucursal> {
    const response = await axios.get(`${this._baseUrl}/${code}`)
    return response.data.data ?? response.data
  }
}

export default SucursalesProxy
