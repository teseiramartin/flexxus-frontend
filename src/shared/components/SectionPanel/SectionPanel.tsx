import type { PropsWithChildren, ReactNode } from 'react'
import { Box, Paper, Stack, Typography } from '@mui/material'
import './SectionPanel.css'
export function SectionPanel({
  title,
  caption,
  action,
  children
}: PropsWithChildren<{ title: string; caption?: string; action?: ReactNode }>) {
  return (
    <Paper className='section-panel' elevation={0}>
      <Stack direction='row' sx={{ justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant='h6'>{title}</Typography>
          {caption && <Typography className='section-caption'>{caption}</Typography>}
        </Box>
        {action}
      </Stack>
      {children}
    </Paper>
  )
}
