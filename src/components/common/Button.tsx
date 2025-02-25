import styled from 'styled-components'

export const Button = styled.button`
  font-family: ${props => props.theme.fonts.heading};
  padding: ${props => props.theme.grid.base * 2}px;
  border: ${props => props.theme.borders.pixel};
  background-color: ${props => props.theme.colors.terminalGreen};
  color: ${props => props.theme.colors.neonGreen};
  cursor: pointer;
` 