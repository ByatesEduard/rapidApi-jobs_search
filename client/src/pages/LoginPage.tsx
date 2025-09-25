import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Alert,
  AlertIcon,
  HStack,
  Spinner,
} from "@chakra-ui/react";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginUser, clearError } from "../redux/features/auth/authSlice";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      loginUser({
        email: formData.email,
        password: formData.password,
      })
    );
  };

  return (
    <Container maxW="sm" py={10}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="lg" textAlign="center">
          Вхід в систему
        </Heading>
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
        <VStack as="form" spacing={4} onSubmit={handleSubmit} align="stretch">
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Пароль</FormLabel>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
          </FormControl>
          <Button type="submit" colorScheme="red" isDisabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : "Увійти"}
          </Button>
          <HStack justify="space-between">
            <RouterLink
              to="/forgot-password"
              style={{ textDecoration: "none" }}
            >
              <Text color="red.300">Забули пароль?</Text>
            </RouterLink>
            <RouterLink to="/register" style={{ textDecoration: "none" }}>
              <Text color="red.300">Немає акаунту? Зареєструватися</Text>
            </RouterLink>
          </HStack>
        </VStack>
      </VStack>
    </Container>
  );
};

export default LoginPage;
