import React, { useState } from 'react'
import {
  Box,
  Button,
  Heading,
  IconButton,
  useBreakpointValue,
  Stack,
  Portal,
  CloseButton, 
} from '@chakra-ui/react'

import { Drawer } from '@chakra-ui/react' 
import { Tabs } from '@chakra-ui/react'
import { HiMenu } from 'react-icons/hi'
import { ErrorBoundary } from 'react-error-boundary'

interface LayoutProps {
  children: React.ReactNode
  currentTab?: string
  onTabChange?: (tab: string) => void
}

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

const tabs = [
  { id: 'home', label: 'Αρχική' },
  { id: 'discussion', label: 'Συζήτηση' },
  { id: 'errors', label: 'Σφάλματα' },
  { id: 'proposals', label: 'Προτάσεις' },
  { id: 'settings', label: 'Ρυθμίσεις' },
  { id: 'about', label: 'Σχετικά' },
]

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <Box p={8} textAlign="center">
      <Heading size="lg" mb={4}>
        Κάτι πήγε στραβά
      </Heading>
      <Box mb={4} p={4} bg="red.50" borderRadius="md">
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {error.message}
        </pre>
      </Box>
      <button onClick={resetErrorBoundary}>Δοκιμάστε ξανά</button>
    </Box>
  )
}

export default function Layout({
  children,
  currentTab = 'home',
  onTabChange,
}: LayoutProps) {
  const [activeTab, setActiveTab] = useState(currentTab)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const visibleTabCount = useBreakpointValue({ base: 3, sm: 4, md: 6 }) || 6

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    onTabChange?.(value)
    setIsDrawerOpen(false) 
  }
  
  const handleDrawerOpenChange = (details: { open: boolean }) => {
    setIsDrawerOpen(details.open);
  }

  const visibleTabs = tabs.slice(0, visibleTabCount)
  const overflowTabs = tabs.slice(visibleTabCount)
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <Box minH="100vh" display="flex" flexDirection="column">
        {/* Header */}
        <Box>
          <Box> 
            <Heading size="2xl" mb={0} textAlign="left" p={2}>
              Α' Συντακτική Βουλή των Πολιτών
            </Heading>
            
            {/* Tabs */}
            <Tabs.Root
              value={activeTab}
              onValueChange={(details) => handleTabChange(details.value)}
              variant="subtle"
              p={2}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Tabs.List flex="1" justifyContent="flex-start">
                  {visibleTabs.map((tab) => (
                    <Tabs.Trigger key={tab.id} value={tab.id}>
                      {tab.label}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>

                {/* Overflow Drawer */}
                {overflowTabs.length > 0 && (
                  <Drawer.Root 
                    open={isDrawerOpen} 
                    onOpenChange={handleDrawerOpenChange}
                    placement="end"
                    size="full"
                  >
                    <Drawer.Trigger asChild>
                      <IconButton
                        aria-label="Περισσότερες επιλογές"
                        variant="subtle"
                        size="md"
                      >
                        <HiMenu />
                      </IconButton>
                    </Drawer.Trigger>
                    
                    <Portal>
                      <Drawer.Backdrop />
                      <Drawer.Positioner>
                        <Drawer.Content>
                          <Drawer.Header p={4}>
                            <Drawer.Title>Περισσότερες σελίδες</Drawer.Title>
                            <Drawer.CloseTrigger asChild>
                              <CloseButton size="md" />
                            </Drawer.CloseTrigger>
                          </Drawer.Header>
                          
                            <Drawer.Body>
                            {/* Navigation Items in a vertical stack */}
                                <Stack align="stretch" flex="1">
                                    {overflowTabs.map((tab) => (
                                    <Button
                                        key={tab.id}
                                        variant={activeTab === tab.id ? 'subtle' : 'ghost'}
                                        colorScheme="blue" 
                                        size="md"
                                        justifyContent="flex-start"
                                        onClick={() => handleTabChange(tab.id)}
                                    >
                                        {tab.label}
                                    </Button>
                                    ))}
                                </Stack>
                            </Drawer.Body>
                        </Drawer.Content>
                      </Drawer.Positioner>
                    </Portal>
                  </Drawer.Root>
                )}
              </Box>
            </Tabs.Root>
          </Box>
        </Box>

        {/* Main Content*/}
        <Box flex="1" overflow="auto" width="100%" p={2}>
          {children}
        </Box>
      </Box>
    </ErrorBoundary>
  )
}