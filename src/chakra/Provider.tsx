import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { ColorModeProvider } from '../components/ui/color-mode'
import { system } from './theme'

type Props = { children: React.ReactNode }

export default function Provider({ children }: Props) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  )
}