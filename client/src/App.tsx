import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Layout } from "./components/Layout";
import JobsPage, { MainPage } from "./pages/JobsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import JobPage from "./pages/JobPage";
import { getMe } from "./redux/features/auth/authSlice";
import { ChakraProvider } from '@chakra-ui/react';
import LikePage from "./pages/LikePage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Спробувати отримати користувача та його likedJobs
      // Ігноруємо помилки, щоб не блокувати UI
      // @ts-ignore
      dispatch(getMe());
    }
  }, [dispatch]);
  return (
    <ChakraProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage/>} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/job-details/:id" element={<JobPage />} />
          <Route path='/like' element={<LikePage/>} />
        </Routes>
      </Layout>
    </ChakraProvider>
  );
}

export default App;
