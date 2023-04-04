import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: 60,
  height: 60,
}));

export interface GameGridProps {
  size: number
  data: string[]
  active: boolean
  onCellClick: (index: number) => void
}

export default function GameGrid(props: GameGridProps) {

  const ROWS = Math.sqrt(props.size)
  const COLSIZE = 12 / ROWS

  const isDisabled = function(index: number) {
    return !props.active || props.data[index] !== ''
  }

  const getCellColor = function(value: string): string {
    return value === 'O' ? 'rgb(128,192,128) !important' : 'rgb(255,128,128) !important'
  }

  return (
    <Box sx={{ flexGrow: 0, width: 200 }}>
      <Grid container spacing={2}>
        {
          props.data.map((item, index) => (
            <Grid item xs={COLSIZE} key={index}>
              <Item>
                <Button 
                  sx={{height: '100%', width: '100%', color: getCellColor(item)}}
                  onClick={() => props.onCellClick(index)}
                  disabled={isDisabled(index)}
                >
                  {item || ''}
                </Button>
              </Item>
            </Grid>
          ))
        }
      </Grid>
    </Box>
  );
}