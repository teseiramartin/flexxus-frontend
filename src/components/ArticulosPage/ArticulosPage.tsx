import { useCallback, useState, type FormEvent } from 'react'
import {
  Alert,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  LinearProgress,
  Stack,
  TablePagination,
  TextField,
  Typography
} from '@mui/material'
import { DataTable, SectionPanel, type Column } from '@/src/shared/components'
import { ArticulosProxy, type ArticulosFilters } from '@/src/services/ArticulosProxy'
import { useApiQuery } from '@/src/services/useApiQuery'
import type { Articulo } from '@/src/types/api'
import { currency } from '@/src/utils/formatters'

const proxy = new ArticulosProxy()
function Detalle({ codigo }: { codigo: string }) {
  const query = useCallback(() => proxy.detalle(codigo), [codigo])
  const { data, error, pending, retry } = useApiQuery(query)
  return (
    <>
      {pending && <LinearProgress aria-label='Cargando artículo' />}
      {error && (
        <Alert severity='error' action={<Button onClick={retry}>Reintentar</Button>}>
          {error}
        </Alert>
      )}
      {data && (
        <Stack spacing={1}>
          <Typography>{data.descripcion}</Typography>
          <Typography>
            Código: {data.codigo} · Código de barras: {data.codigoBarra || 'Sin informar'}
          </Typography>
          <Typography>
            Marca: {data.marcaDescripcion} · Rubro: {data.rubroDescripcion} ({data.codigoRubro})
          </Typography>
          <Typography>
            Compra: {currency.format(data.precioCompra)} · Venta:{' '}
            {currency.format(data.precioVenta1)}
          </Typography>
          <Typography>
            {data.activo ? 'Activo' : 'Inactivo'} · {data.bloqueado ? 'Bloqueado' : 'No bloqueado'}
          </Typography>
        </Stack>
      )}
    </>
  )
}
export function ArticulosPage() {
  const [filters, setFilters] = useState<ArticulosFilters>({
    busqueda: '',
    codigoRubro: '',
    soloActivos: true,
    Pagina: 1,
    Tamanio: 10
  })
  const [search, setSearch] = useState('')
  const [rubro, setRubro] = useState('')
  const [codigo, setCodigo] = useState<string | null>(null)
  const query = useCallback(() => proxy.buscar(filters), [filters])
  const { data, error, pending, retry } = useApiQuery(query)
  const columns: Column<Articulo>[] = [
    {
      key: 'codigo',
      label: 'Código',
      render: (r) => <Button onClick={() => setCodigo(r.codigo)}>{r.codigo}</Button>
    },
    { key: 'descripcion', label: 'Artículo', render: (r) => r.descripcion },
    { key: 'marca', label: 'Marca', render: (r) => r.marcaDescripcion },
    { key: 'rubro', label: 'Rubro', render: (r) => r.rubroDescripcion },
    {
      key: 'precio',
      label: 'Precio venta',
      align: 'right',
      render: (r) => currency.format(r.precioVenta1)
    }
  ]
  const submit = (event: FormEvent) => {
    event.preventDefault()
    setFilters({ ...filters, busqueda: search.trim(), codigoRubro: rubro.trim(), Pagina: 1 })
  }
  return (
    <Container maxWidth={false} className='dashboard-container'>
      <SectionPanel title='Artículos' caption='Catálogo real de Flexxus'>
        <Stack
          component='form'
          onSubmit={submit}
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ my: 2 }}>
          <TextField
            size='small'
            label='Buscar por código o descripción'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextField
            size='small'
            label='Código de rubro'
            value={rubro}
            onChange={(e) => setRubro(e.target.value)}
          />
          <FormControlLabel
            label='Solo activos no bloqueados'
            control={
              <Checkbox
                checked={filters.soloActivos}
                onChange={(_, checked) =>
                  setFilters({ ...filters, soloActivos: checked, Pagina: 1 })
                }
              />
            }
          />
          <Button type='submit' variant='contained'>
            Buscar
          </Button>
          <Button onClick={retry} disabled={pending}>
            Actualizar
          </Button>
        </Stack>
        {pending && <LinearProgress aria-label='Cargando artículos' />}
        {error && (
          <Alert severity='error' action={<Button onClick={retry}>Reintentar</Button>}>
            {error}
          </Alert>
        )}
        {data && (
          <>
            <DataTable
              rows={data.items}
              columns={columns}
              getRowId={(r) => r.codigo}
              ariaLabel='Artículos'
              paginated={false}
            />
            <TablePagination
              component='div'
              count={data.total}
              page={filters.Pagina - 1}
              rowsPerPage={filters.Tamanio}
              rowsPerPageOptions={[10, 20, 50]}
              labelRowsPerPage='Filas'
              onPageChange={(_, page) => setFilters({ ...filters, Pagina: page + 1 })}
              onRowsPerPageChange={(e) =>
                setFilters({ ...filters, Tamanio: Number(e.target.value), Pagina: 1 })
              }
            />
          </>
        )}
      </SectionPanel>
      <Dialog open={codigo !== null} onClose={() => setCodigo(null)} fullWidth maxWidth='sm'>
        <DialogTitle>
          Detalle de artículo <Button onClick={() => setCodigo(null)}>Cerrar</Button>
        </DialogTitle>
        <DialogContent>{codigo !== null && <Detalle codigo={codigo} />}</DialogContent>
      </Dialog>
    </Container>
  )
}
