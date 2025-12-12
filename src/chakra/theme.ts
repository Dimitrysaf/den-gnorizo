import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Add your custom colors here if needed
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)