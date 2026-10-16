'use client'

import { useEffect, useMemo } from 'react'
import {
  AssessmentOutlined,
  CalendarMonthOutlined,
  ErrorOutlineOutlined,
  StorefrontOutlined
} from '@mui/icons-material'
import { Alert, Box, Container, Skeleton, Stack } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/src/state/hooks'
import { loadDashboard, refreshDashboard, setFilters } from '@/src/state/dashboard'
import { months } from '@/src/utils/formatters'
import { DashboardFilters } from '../DashboardFilters'
import { DashboardHeader } from '../DashboardHeader'
import { MetricsPanel } from '../MetricsPanel'
import { ProvidersTable } from '../ProvidersTable'
import { SalesTable } from '../SalesTable'
import { TrendChart } from '../TrendChart'
import { UsersTable } from '../UsersTable'
import { VoucherBreakdown } from '../VoucherBreakdown'
import './DashboardPage.css'
import { USE_MOCKS } from '@/src/services/config'
import { RealSales, RealTrend } from '../RemoteData/RemoteData'

export function DashboardPage() {
  const dispatch = useAppDispatch()
  const { data, filters, pending, refreshPending, error } = useAppSelector(
    (state) => state.dashboard
  )
  const branches = useMemo(
    () =>
      data?.sucursales ??
      (filters.branch ? [{ codigo: filters.branch, descripcion: filters.branch }] : []),
    [data?.sucursales, filters.branch]
  )
  const selected = useMemo(
    () =>
      filters.branch
        ? (branches.find((item) => item.codigo === filters.branch)?.descripcion ?? filters.branch)
        : 'Todas las sucursales',
    [branches, filters.branch]
  )

  useEffect(() => {
    void dispatch(loadDashboard(filters))
  }, [dispatch, filters])

  return (
    <Box className='app-shell'>
      <Container maxWidth={false} className='dashboard-container'>
        <DashboardHeader
          refreshing={refreshPending || pending}
          onRefresh={() => void dispatch(refreshDashboard(filters))}
        />
        <DashboardFilters
          filters={filters}
          branches={branches}
          refreshing={refreshPending || pending}
          onChange={(newFilters) => dispatch(setFilters(newFilters))}
          onRefresh={() => void dispatch(refreshDashboard(filters))}
        />
        <Alert severity='info' sx={{ mb: 2 }}>
          {USE_MOCKS
            ? 'Modo demostración: el dashboard muestra datos simulados. El catálogo de artículos consulta la API real.'
            : 'Datos reales. Las compras incluyen todas las sucursales; proveedores muestra pendientes actuales. El saldo es IVA compras menos IVA ventas.'}
        </Alert>
        {error && (
          <Alert severity='warning' icon={<ErrorOutlineOutlined />} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {pending && !data ? (
          <Box className='loading-grid'>
            <Skeleton variant='rounded' height={130} />
            <Skeleton variant='rounded' height={130} />
            <Skeleton variant='rounded' height={130} />
            <Skeleton variant='rounded' height={320} />
          </Box>
        ) : (
          data && (
            <>
              <Stack
                direction='row'
                sx={{ alignItems: 'center', gap: 1, mb: 2 }}
                className='context-line'>
                <StorefrontOutlined fontSize='small' />
                <span>{selected}</span>
                <i />
                <CalendarMonthOutlined fontSize='small' />
                <span>
                  {months[filters.month - 1]} {filters.year}
                </span>
                <i />
                <AssessmentOutlined fontSize='small' />
                <span>
                  Consultado{' '}
                  {new Date(data.updatedAt).toLocaleString('es-AR', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })}
                </span>
              </Stack>
              <MetricsPanel summary={data.resumen} />
              <Box className='analysis-grid'>
                {USE_MOCKS ? (
                  <TrendChart data={data.evolucionMensual} />
                ) : (
                  <RealTrend key={data.updatedAt} filters={filters} />
                )}
                <VoucherBreakdown rows={data.porTipoComprobante} />
              </Box>
              <Box className='business-grid'>
                <ProvidersTable
                  key={`providers-${data.updatedAt}`}
                  rows={data.proveedores}
                  real={!USE_MOCKS}
                />
                <UsersTable
                  key={`users-${data.updatedAt}`}
                  rows={data.usuarios}
                  filters={USE_MOCKS ? undefined : filters}
                />
              </Box>
              {USE_MOCKS ? (
                <SalesTable rows={data.detalleVentas} />
              ) : (
                <RealSales key={data.updatedAt} filters={filters} />
              )}
            </>
          )
        )}
      </Container>
    </Box>
  )
}
