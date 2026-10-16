'use client'

import { Fragment, useState, type ReactNode } from 'react'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
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
  const [expandedRowId, setExpandedRowId] = useState<string | false>(false)
  const safePage = Math.min(page, Math.max(Math.ceil(rows.length / rowsPerPage) - 1, 0))
  const visible = paginated
    ? rows.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage)
    : rows
  const toggleRow = (rowId: string) =>
    setExpandedRowId((current) => (current === rowId ? false : rowId))

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
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + (renderExpandedRow ? 1 : 0)}>
                  No hay datos para esta consulta.
                </TableCell>
              </TableRow>
            )}
            {visible.map((row) => {
              const id = getRowId(row)
              const isExpanded = expandedRowId === id
              const contentId = `${ariaLabel}-${id}-content`
              const summaryId = `${ariaLabel}-${id}-summary`
              return (
                <Fragment key={id}>
                  <TableRow hover className='shared-table-row'>
                    {renderExpandedRow && (
                      <TableCell padding='checkbox'>
                        <IconButton
                          size='small'
                          className={`expand-button ${isExpanded ? 'expanded' : ''}`}
                          onClick={() => toggleRow(id)}
                          aria-expanded={isExpanded}
                          aria-controls={contentId}
                          aria-label={isExpanded ? 'Contraer detalle' : 'Expandir detalle'}>
                          <ArrowForwardIosSharpIcon />
                        </IconButton>
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.key} align={column.align}>
                        {column.render(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                  {renderExpandedRow && (
                    <TableRow className='accordion-table-row'>
                      <TableCell className='accordion-table-cell' colSpan={columns.length + 1}>
                        <MuiAccordion
                          disableGutters
                          elevation={0}
                          square
                          expanded={isExpanded}
                          className='row-accordion'>
                          <MuiAccordionSummary
                            id={summaryId}
                            aria-controls={contentId}
                            className='row-accordion-summary'>
                            <span>{isExpanded ? 'Ocultar detalle' : 'Mostrar detalle'}</span>
                          </MuiAccordionSummary>
                          <MuiAccordionDetails
                            id={contentId}
                            aria-labelledby={summaryId}
                            className='row-accordion-details'>
                            {isExpanded && renderExpandedRow(row)}
                          </MuiAccordionDetails>
                        </MuiAccordion>
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
          onPageChange={(_, next) => {
            setPage(next)
            setExpandedRowId(false)
          }}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value))
            setPage(0)
            setExpandedRowId(false)
          }}
          rowsPerPageOptions={[5, 10, 20]}
          labelRowsPerPage='Filas'
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      )}
    </>
  )
}
