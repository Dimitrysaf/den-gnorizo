import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Box, Button, Code, Heading, Text, HStack, Flex, Spacer } from '@chakra-ui/react'
import ColorModeToggle from './chakra/ColorModeToggle'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Flex align="center" gap={4}>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <Spacer />
        <ColorModeToggle />
      </Flex>

      <Heading as="h1" size="lg" my={4}>
        Vite + React
      </Heading>

      <Box className="card">
        <HStack>
          <Button colorScheme="teal" onClick={() => setCount((c) => c + 1)}>
            count is {count}
          </Button>
          <Text>
            Edit <Code>src/App.tsx</Code> and save to test HMR
          </Text>
        </HStack>
      </Box>

      <Text className="read-the-docs" mt={4}>
        Click on the Vite and React logos to learn more
      </Text>
    </>
  )
}

export default App
