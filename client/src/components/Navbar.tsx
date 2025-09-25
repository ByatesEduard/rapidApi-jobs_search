import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logout } from '../redux/features/auth/authSlice';
import { Box, Button, Container, Flex, HStack, Text } from '@chakra-ui/react';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={50}
      bg="gray.900"
      color="gray.100"
      backdropFilter="saturate(180%) blur(6px)"
      borderBottomWidth="1px"
      borderColor="whiteAlpha.200"
    >
      <Container maxW="6xl" py={2}>
        <Flex align="center" justify="space-between">
          <HStack spacing={3}>
            <RouterLink to="/" style={{ textDecoration: 'none' }}>
              <Text
                as="span"
                fontWeight="extrabold"
                fontSize="sm"
                bg="red.600"
                px={2}
                py={1}
                borderRadius="md"
                color="white"
                letterSpacing="wide"
              >
                JobSearch
              </Text>
            </RouterLink>
          </HStack>

          <HStack spacing={2}>
            <RouterLink to="/">
              <Button variant="ghost" size="sm" colorScheme="whiteAlpha">
                Головна
              </Button>
            </RouterLink>

            {isAuthenticated ? (
              <>
                {/* Кнопка "Обрані 💖" тільки для авторизованих */}
                <Button
                  as={RouterLink}
                  to="/like"
                  colorScheme="pink"
                  variant="ghost"
                  size="sm"
                >
                  Обрані 💖
                </Button>

                <Text
                  display={{ base: 'none', md: 'block' }}
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderWidth="1px"
                  borderColor="whiteAlpha.300"
                  borderRadius="md"
                  color="gray.200"
                >
                  {user?.email}
                </Text>

                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  colorScheme="whiteAlpha"
                >
                  Вийти
                </Button>
              </>
            ) : (
              <RouterLink to="/login">
                <Button colorScheme="red" size="sm">
                  Вхід
                </Button>
              </RouterLink>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
