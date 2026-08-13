'use client'
import {
  AssessmentOutlined,
  CalendarMonthOutlined,
  ErrorOutlineOutlined,
  StorefrontOutlined
} from '@mui/icons-material'
import { Alert, Box, Container, Skeleton, Stack } from '@mui/material'
import { useMemo } from 'react'
import { useDashboard } from '@/src/state/dashboard'
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

export function DashboardPage() {
  const { data, filters, loading, refreshing, error, updateFilters, refresh } = useDashboard()
  const branches = useMemo(
    () => data?.sucursales ?? [{ codigo: '001', descripcion: 'Casa Central' }],
    [data?.sucursales]
  )
  const selected = useMemo(
    () => branches.find((item) => item.codigo === filters.branch)?.descripcion ?? 'Casa Central',
    [branches, filters.branch]
  )
  return (
    <Box className='app-shell'>
      <Container maxWidth={false} className='dashboard-container'>
        <DashboardHeader refreshing={refreshing} onRefresh={() => void refresh()} />
        <DashboardFilters
          filters={filters}
          branches={branches}
          refreshing={refreshing}
          onChange={updateFilters}
          onRefresh={() => void refresh()}
        />
        {error && (
          <Alert severity='warning' icon={<ErrorOutlineOutlined />} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {loading && !data ? (
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
                alignItems='center'
                spacing={1}
                mb={2}
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
                  Actualizado{' '}
                  {new Date(data.updatedAt).toLocaleString('es-AR', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })}
                </span>
              </Stack>
              <MetricsPanel summary={data.resumen} />
              <Box className='analysis-grid'>
                <TrendChart data={data.evolucionMensual} />
                <VoucherBreakdown rows={data.porTipoComprobante} />
              </Box>
              <Box className='business-grid'>
                <ProvidersTable rows={data.proveedores} />
                <UsersTable rows={data.usuarios} />
              </Box>
              <SalesTable rows={data.detalleVentas} />
            </>
          )
        )}
      </Container>
    </Box>
  )
}
