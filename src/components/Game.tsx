import { Alert, Box, Button, Stack, Switch } from "@mui/material"
import { ChangeEvent, useReducer } from "react"
import GameGrid from "./GameGrid"

export default function Game() {

  const SIDE_LENGTH = 3
  const GRID_SIZE = SIDE_LENGTH * SIDE_LENGTH

  const createEmptyGameGrid = function(): string[] {
    return new Array<string>(GRID_SIZE).fill('')
  }

  interface State {
    data: string[]
    moves: number
    player: number
    gameover: boolean
    winner: number
    twoPlayers: boolean
  }

  type Action = 
    | { type: 'clear' }
    | { type: 'init' }
    | { type: 'move', index: number }
    | { type: 'mode', twoPlayers: boolean }

  const getPlayerValue = function(player: number) {
    return player === 1 ? 'O' : 'X'
  }

  const checkForWinner = function(data: string[], index: number, player: number): boolean {
    const value = getPlayerValue(player)
    const row = Math.floor(index / SIDE_LENGTH)
    const col = index % SIDE_LENGTH
    if (1 + countRun(data, value, row, col, 0, 1) 
      + countRun(data, value, row, col, 0, -1) === SIDE_LENGTH) return true
    if (1 + countRun(data, value, row, col, 1, 0)
      + countRun(data, value, row, col, -1, 0) === SIDE_LENGTH) return true
    if (1 + countRun(data, value, row, col, -1, -1)
      + countRun(data, value, row, col, 1, 1) === SIDE_LENGTH) return true
    if (1 + countRun(data, value, row, col, 1, -1)
      + countRun(data, value, row, col, -1, 1) === SIDE_LENGTH) return true
    return false
  }

  const countRun = function(data: string[], value: string, row: number, col: number, drow: number, dcol: number): number {
    row = row + drow
    col = col + dcol
    if (row < 0 || row >= SIDE_LENGTH || col < 0 || col >= SIDE_LENGTH) return 0
    if (data[row * SIDE_LENGTH + col] !== value) return 0
    return 1 + countRun(data, value, row, col, drow, dcol)
  }

  const checkForGameOver = function(moves: number, data: string[]): boolean {
    return moves === data.length
  }

  const getNextMoveFromAI = function(data: string[]) {
    let index: number
    do {
      index = Math.floor(Math.random() * data.length)
    } while (data[index] !== '')
    return index
  }

  const doMove = function(state: State, index: number) {
    const data = state.data
    let newData = [
      ...data.slice(0, index),
      getPlayerValue(state.player),
      ...data.slice(index + 1, data.length)
    ]
    let moves = state.moves + 1
    let winner = 0
    let player = state.player
    let gameover = false
    if (checkForWinner(newData, index, state.player)) winner = state.player
    else if (checkForGameOver(moves, newData)) gameover = true
    else if (!state.twoPlayers) {
      const player2 = 2
      moves++
      let next = getNextMoveFromAI(newData)
      newData[next] = getPlayerValue(player2)
      if (checkForWinner(newData, next, player2)) winner = player2
      else if (checkForGameOver(moves, newData)) gameover = true
    }
    else player = state.player === 1 ? 2 : 1
    return {
      data: newData,
      moves,
      player,
      winner,
      gameover,
      twoPlayers: state.twoPlayers
    }    
  }

  const reducer = (state: State, action: Action): State => {
    if (action.type === 'clear') {
      return { 
        data: createEmptyGameGrid(),
        player: 1,
        moves: 0,
        winner: 0,
        gameover: false,
        twoPlayers: state.twoPlayers
      } 
    } else if (action.type === 'mode') { 
      let res: State = { ...state }
      res.twoPlayers = action.twoPlayers
      return res 
    } else if (action.type === 'move') {
      return doMove(state, action.index)
    } else return state
  }

  const [state, dispatch] = useReducer(reducer, {
    data: createEmptyGameGrid(),
    player: 1,
    moves: 0,
    winner: 0,
    gameover: false,
    twoPlayers: false
  })

  const onGridCellClick = function(index: number) {
    dispatch({ type: 'move', index }) 
  }

  const reset = function() {
    dispatch({ type: 'clear' })
  }

  const onTwoPlayersChange = function(e: ChangeEvent, checked: boolean) {
    dispatch({ type: 'mode', twoPlayers: checked })
  }

  return (
    <Stack>
      <h1 style={{marginBottom: '8px'}}>Tic Tac Toe</h1>
      <GameGrid size={GRID_SIZE} data={state.data} onCellClick={onGridCellClick} active={!state.winner}></GameGrid>
      <Box sx={{marginTop: '16px', display:'flex', flexDirection: 'row', alignItems: 'center'}}>
        <span style={{marginRight: '8px'}}>Mode:</span>
        <span>1 Player</span>
        <Switch disabled={state.player === 2} checked={state.twoPlayers} onChange={onTwoPlayersChange}></Switch>
        <span>2 Players</span>
      </Box>
      { !state.winner && !state.gameover ? (
          <Box sx={{marginTop: '16px'}}>
            Next Up: Player {state.player} - {getPlayerValue(state.player)}
          </Box> 
        ) : <></>
      }
      { state.winner ?
        <Alert severity="success">The winner is Player {state.winner}</Alert>
        : <></>
      }
      { state.gameover ?
        <Alert severity="info">Game tied.</Alert>
        : <></>
      }
      { state.moves || state.winner ?
        <Box sx={{marginTop: '16px', display: 'flex', flexDirection: 'row', alignItems:'end'}}>
          <Button onClick={reset}>Start Over</Button>
        </Box> 
        : <></> }
    </Stack>
  )
}