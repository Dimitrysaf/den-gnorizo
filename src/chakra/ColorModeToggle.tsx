import { IconButton } from '@chakra-ui/react'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useColorMode } from '../components/ui/color-mode'

export default function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      aria-label="Toggle color mode"
      onClick={toggleColorMode}
      variant="ghost"
    >
      {colorMode === 'light' ? <FaMoon /> : <FaSun />}
    </IconButton>
  )
}