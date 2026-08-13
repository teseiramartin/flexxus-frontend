'use client'
import { Fragment, useState, type ReactNode } from 'react'
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material'
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material'
import './DataTable.css'

export type Column<T> = {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  render: (row: T) => ReactNode
}
type Props<T> = {
  rows: T[]
  columns: Column<T>[]
  getRowId: (row: T) => string
  ariaLabel: string
  renderExpandedRow?: (row: T) => ReactNode
  paginated?: boolean
  initialRowsPerPage?: number
}

export function DataTable<T>({
  rows,
  columns,
  getRowId,
  ariaLabel,
  renderExpandedRow,
  paginated = true,
  initialRowsPerPage = 5
}: Props<T>) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const safePage = Math.min(page, Math.max(Math.ceil(rows.length / rowsPerPage) - 1, 0))
  const visible = paginated
    ? rows.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage)
    : rows
  const toggle = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <>
      <TableContainer className='shared-table-container'>
        <Table size='small' aria-label={ariaLabel}>
          <TableHead>
            <TableRow>
              {renderExpandedRow && <TableCell padding='checkbox' />}
              {columns.map((column) => (
                <TableCell key={column.key} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.map((row) => {
              const id = getRowId(row)
              const open = expanded.has(id)
              return (
                <Fragment key={id}>
                  <TableRow hover className='shared-table-row'>
                    {renderExpandedRow && (
                      <TableCell padding='checkbox'>
                        <IconButton
                          size='small'
                          onClick={() => toggle(id)}
                          aria-label={open ? 'Contraer detalle' : 'Expandir detalle'}>
                          {open ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                        </IconButton>
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.key} align={column.align}>
                        {column.render(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                  {open && renderExpandedRow && (
                    <TableRow>
                      <TableCell className='expanded-cell' colSpan={columns.length + 1}>
                        {renderExpandedRow(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {paginated && (
        <TablePagination
          component='div'
          count={rows.length}
          page={safePage}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, next) => setPage(next)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value))
            setPage(0)
          }}
          rowsPerPageOptions={[5, 10, 20]}
          labelRowsPerPage='Filas'
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      )}
    </>
  )
}
