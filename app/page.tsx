"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AssessmentOutlined,
  CachedOutlined,
  CalendarMonthOutlined,
  CheckCircleOutlineOutlined,
  ErrorOutlineOutlined,
  RefreshRounded,
  StorefrontOutlined,
  TrendingUpRounded,
} from "@mui/icons-material";
import Image from "next/image";
import logoImage from "@/public/assets/frontera-logo.png";
import { getDashboard, invalidateDashboardCache } from "@/lib/dashboard-repository";
import type { DashboardData, DashboardFilters, VentaDetalle } from "@/lib/dashboard-types";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});
const number = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });
const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function MetricCard({ label, value, tone = "primary" }: { label: string; value: number; tone?: "primary" | "danger" | "success" }) {
  const color = tone === "danger" ? "#d92d20" : tone === "success" ? "#067647" : "#12366a";
  return (
    <Paper className="metric-card" elevation={0}>
      <Typography className="eyebrow">{label}</Typography>
      <Typography className="metric-value" sx={{ color }}>{currency.format(value)}</Typography>
      <Box className="metric-accent" sx={{ backgroundColor: color }} />
    </Paper>
  );
}

function TrendChart({ data }: { data: DashboardData["evolucionMensual"] }) {
  const max = Math.max(...data.flatMap((item) => [item.ventas, item.compras]));
  return (
    <Paper className="panel chart-panel" elevation={0}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="h6">Evolución mensual</Typography>
          <Typography className="panel-caption">Ventas y compras acumuladas del año</Typography>
        </Box>
        <Stack direction="row" spacing={2} className="legend">
          <span><i className="dot sales" />Ventas</span>
          <span><i className="dot purchases" />Compras</span>
        </Stack>
      </Stack>
      <Box className="bars" role="img" aria-label="Comparación mensual de IVA ventas e IVA compras">
        {data.map((item) => (
          <Box className="bar-group" key={item.mes}>
            <Tooltip title={`Ventas: ${currency.format(item.ventas)}`} arrow>
              <Box className="bar sales" sx={{ height: `${Math.max((item.ventas / max) * 100, 3)}%` }} />
            </Tooltip>
            <Tooltip title={`Compras: ${currency.format(item.compras)}`} arrow>
              <Box className="bar purchases" sx={{ height: `${Math.max((item.compras / max) * 100, 3)}%` }} />
            </Tooltip>
            <Typography component="span">{item.mes}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

function VoucherBreakdown({ rows }: { rows: DashboardData["porTipoComprobante"] }) {
  const total = rows.reduce((sum, item) => sum + Math.abs(item.ivaVentas), 0) || 1;
  return (
    <Paper className="panel" elevation={0}>
      <Typography variant="h6">Por tipo de comprobante</Typography>
      <Typography className="panel-caption">Composición del IVA ventas</Typography>
      <Stack spacing={2.1} mt={3}>
        {rows.map((row) => (
          <Box key={row.tipo}>
            <Stack direction="row" justifyContent="space-between" mb={0.7}>
              <Typography fontWeight={650}>{row.tipo}</Typography>
              <Typography fontWeight={700} color={row.ivaVentas < 0 ? "error.main" : "text.primary"}>{currency.format(row.ivaVentas)}</Typography>
            </Stack>
            <Box className="progress-track">
              <Box className="progress-fill" sx={{ width: `${Math.max((Math.abs(row.ivaVentas) / total) * 100, 2)}%`, backgroundColor: row.ivaVentas < 0 ? "#f97066" : "#315b9b" }} />
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

function SalesTable({ rows }: { rows: VentaDetalle[] }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const safePage = Math.min(page, Math.max(Math.ceil(rows.length / rowsPerPage) - 1, 0));
  const visible = rows.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);

  return (
    <Paper className="panel table-panel" elevation={0}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={1} mb={2}>
        <Box>
          <Typography variant="h6">Detalle de ventas</Typography>
          <Typography className="panel-caption">Comprobantes y artículos asociados</Typography>
        </Box>
        <Chip label={`${rows.length} movimientos`} size="small" className="count-chip" />
      </Stack>
      <TableContainer>
        <Table size="small" aria-label="Detalle paginado de ventas">
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell><TableCell>Comprobante</TableCell><TableCell>Fecha</TableCell>
              <TableCell>Rubro</TableCell><TableCell>Artículo</TableCell><TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Precio total</TableCell><TableCell align="right">IVA</TableCell><TableCell align="right">Sin IVA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.map((row) => (
              <TableRow hover key={row.id}>
                <TableCell><strong>{row.usuario}</strong></TableCell>
                <TableCell>{row.comprobante}</TableCell><TableCell>{row.fecha}</TableCell><TableCell>{row.rubro}</TableCell>
                <TableCell className="article-cell">{row.articulo}</TableCell><TableCell align="right">{number.format(row.cantidad)}</TableCell>
                <TableCell align="right">{currency.format(row.precioTotal)}</TableCell><TableCell align="right">{number.format(row.iva)}%</TableCell>
                <TableCell align="right">{currency.format(row.precioSinIva)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination component="div" count={rows.length} page={safePage} rowsPerPage={rowsPerPage}
        onPageChange={(_, next) => setPage(next)} onRowsPerPageChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(0); }}
        rowsPerPageOptions={[5, 10, 20]} labelRowsPerPage="Filas" labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`} />
    </Paper>
  );
}

export default function Home() {
  const [filters, setFilters] = useState<DashboardFilters>({ year: 2025, month: 1, branch: "001" });
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      if (force) invalidateDashboardCache(filters);
      setData(await getDashboard(filters));
    } catch {
      setError("No pudimos obtener los datos. La última versión guardada seguirá disponible si existe.");
    } finally {
      setLoading(false); setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    // The dashboard query is the external resource synchronized by this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);
  const selectedBranch = useMemo(() => data?.sucursales.find((item) => item.codigo === filters.branch)?.descripcion ?? "Casa Central", [data, filters.branch]);

  return (
    <Box className="app-shell">
      <Container maxWidth={false} className="dashboard-container">
        <Box component="header" className="topbar">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Image src={logoImage} alt="Logo de la aplicación" className="brand-mark" />
            <Box>
              <Typography className="brand-name">Frontera <span>BI</span></Typography>
              <Typography className="brand-subtitle">Inteligencia comercial</Typography>
            </Box>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Chip icon={<CheckCircleOutlineOutlined />} label="Datos locales" className="status-chip" />
            <Tooltip title="Actualizar todos los datos">
              <span><IconButton className="refresh-button" onClick={() => void load(true)} disabled={refreshing} aria-label="Actualizar todos los datos">
                {refreshing ? <CircularProgress size={22} /> : <RefreshRounded />}
              </IconButton></span>
            </Tooltip>
          </Stack>
        </Box>

        <Box className="hero">
          <Box>
            <Typography className="section-kicker">LIBRO IVA VENTAS</Typography>
            <Typography variant="h3">Resumen fiscal y comercial</Typography>
            <Typography className="hero-copy">Información consolidada para analizar ventas, compras y comprobantes.</Typography>
          </Box>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} className="filters">
            <FormControl size="small"><InputLabel>Año</InputLabel><Select label="Año" value={filters.year} onChange={(e) => setFilters((prev) => ({ ...prev, year: Number(e.target.value) }))}><MenuItem value={2024}>2024</MenuItem><MenuItem value={2025}>2025</MenuItem><MenuItem value={2026}>2026</MenuItem></Select></FormControl>
            <FormControl size="small"><InputLabel>Mes</InputLabel><Select label="Mes" value={filters.month} onChange={(e) => setFilters((prev) => ({ ...prev, month: Number(e.target.value) }))}>{months.map((month, index) => <MenuItem value={index + 1} key={month}>{month}</MenuItem>)}</Select></FormControl>
            <FormControl size="small"><InputLabel>Sucursal</InputLabel><Select label="Sucursal" value={filters.branch} onChange={(e) => setFilters((prev) => ({ ...prev, branch: e.target.value }))}>{(data?.sucursales ?? [{ codigo: "001", descripcion: "Casa Central" }]).map((branch) => <MenuItem value={branch.codigo} key={branch.codigo}>{branch.descripcion}</MenuItem>)}</Select></FormControl>
            <Button variant="contained" startIcon={<CachedOutlined />} onClick={() => void load(true)} disabled={refreshing}>Actualizar</Button>
          </Stack>
        </Box>

        {error && <Alert severity="warning" icon={<ErrorOutlineOutlined />} sx={{ mb: 2 }}>{error}</Alert>}
        {loading && !data ? (
          <Box className="loading-grid"><Skeleton variant="rounded" height={130} /><Skeleton variant="rounded" height={130} /><Skeleton variant="rounded" height={130} /><Skeleton variant="rounded" height={320} /></Box>
        ) : data && (
          <>
            <Stack direction="row" alignItems="center" spacing={1} mb={2} className="context-line">
              <StorefrontOutlined fontSize="small" /><span>{selectedBranch}</span><i />
              <CalendarMonthOutlined fontSize="small" /><span>{months[filters.month - 1]} {filters.year}</span><i />
              <AssessmentOutlined fontSize="small" /><span>Actualizado {new Date(data.updatedAt).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}</span>
            </Stack>
            <Box className="metrics-grid">
              <MetricCard label="Total IVA ventas" value={data.resumen.ivaVentas} />
              <MetricCard label="Total IVA compras" value={data.resumen.ivaCompras} tone="success" />
              <MetricCard label="Saldo del período" value={data.resumen.saldo} tone={data.resumen.saldo < 0 ? "danger" : "success"} />
              <Paper className="metric-card compact" elevation={0}><TrendingUpRounded className="metric-icon" /><Box><Typography className="eyebrow">Facturación promedio</Typography><Typography className="secondary-value">{currency.format(data.resumen.facturacionPromedio)}</Typography></Box></Paper>
            </Box>
            <Box className="analysis-grid"><TrendChart data={data.evolucionMensual} /><VoucherBreakdown rows={data.porTipoComprobante} /></Box>
            <SalesTable rows={data.detalleVentas} />
          </>
        )}
      </Container>
    </Box>
  );
}
