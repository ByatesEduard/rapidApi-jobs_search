import Navbar from './Navbar'
import type { ReactNode } from "react"
import { Box, Container } from '@chakra-ui/react'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box minH="100vh" bg="gray.900" color="gray.100">
      <Navbar />
      <Container maxW="6xl" py={6}>
        <Box as="main">
          {children}
        </Box>
      </Container>
    </Box>
  )
}
