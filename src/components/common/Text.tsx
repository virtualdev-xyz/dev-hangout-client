import styled from 'styled-components'

export const Heading = styled.h1`
  font-family: ${props => props.theme.fonts.heading};
  color: ${props => props.theme.colors.crtBlue};
`

export const SubHeading = styled.h2`
  font-family: ${props => props.theme.fonts.subheading};
  color: ${props => props.theme.colors.magenta};
`

export const BodyText = styled.p`
  font-family: ${props => props.theme.fonts.body};
  color: ${props => props.theme.colors.neonGreen};
` 