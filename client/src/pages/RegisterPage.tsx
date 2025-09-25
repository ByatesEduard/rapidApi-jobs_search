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
  FormHelperText,
} from "@chakra-ui/react";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { registerUser, clearError } from "../redux/features/auth/authSlice";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState("");

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
    setLocalError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Паролі не співпадають!");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Пароль повинен містити принаймні 6 символів");
      return;
    }

    dispatch(
      registerUser({
        email: formData.email,
        password: formData.password,
      })
    );
  };

  return (
    <Container maxW="sm" py={10}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="lg" textAlign="center">
          Реєстрація
        </Heading>

        {(error || localError) && (
          <Alert status="error">
            <AlertIcon />
            {localError || error}
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
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />
            <FormHelperText>Мінімум 6 символів</FormHelperText>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Підтвердіть пароль</FormLabel>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </FormControl>

          <Button type="submit" colorScheme="red" isDisabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : "Зареєструватися"}
          </Button>

          <HStack justify="center">
            <RouterLink to="/login" style={{ textDecoration: "none" }}>
              <Text color="red.300">Вже є акаунт? Увійти</Text>
            </RouterLink>
          </HStack>
        </VStack>
      </VStack>
    </Container>
  );
};

export default RegisterPage;
