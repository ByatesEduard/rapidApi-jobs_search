import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { fetchJobs } from "../redux/features/auth/rapidSlice";
import type { RootState } from "../redux/store";
import { useAppDispatch } from "../redux/hooks";
import { 
  SimpleGrid, Box, Heading, Text, Spinner, Center, 
  Input, Flex, IconButton, Button 
} from '@chakra-ui/react';
import { SearchIcon } from "@chakra-ui/icons";
import Loading from "../components/Loading";
import axios from "../utils/axios";

interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
}

export const MainPage = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useSelector((state: RootState) => state.rapid);
  const didFetchRef = useRef(false);
  const [query, setQuery] = useState('');
  
  // --- Лайки ---
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [likedJobs, setLikedJobs] = useState<string[]>(() => {
    const saved = localStorage.getItem("likedJobs");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleLike = async (jobId: string) => {
    setLikedJobs((prev) => {
      let updated: string[];
      const isLiked = prev.includes(jobId);
      if (isLiked) {
        updated = prev.filter((id) => id !== jobId);
      } else {
        updated = [...prev, jobId];
      }
      localStorage.setItem("likedJobs", JSON.stringify(updated));

      // Зберігаємо мінімальні дані вакансії для сторінки Обрані
      try {
        const dataKey = "likedJobsData";
        const savedData = localStorage.getItem(dataKey);
        let list: Array<{ job_id: string; job_title: string; employer_name: string }>= savedData ? JSON.parse(savedData) : [];

        if (isLiked) {
          list = list.filter((j) => j.job_id !== jobId);
        } else {
          const job = items.find((j: Job) => j.job_id === jobId);
          if (job) {
            const minimal = { job_id: job.job_id, job_title: job.job_title, employer_name: job.employer_name };
            const exists = list.some((j) => j.job_id === jobId);
            if (!exists) list.push(minimal);
          }
        }
        localStorage.setItem(dataKey, JSON.stringify(list));
      } catch {}

      return updated;
    });

    // Синхронізація з бекендом, якщо авторизовано
    try {
      if (isAuthenticated) {
        const isNowLiked = !likedJobs.includes(jobId);
        if (isNowLiked) {
          await axios.post(`/likes/${jobId}`);
        } else {
          await axios.delete(`/likes/${jobId}`);
        }
      }
    } catch (e) {
      // ігноруємо помилку щоб UI був чуйним; опційно можна показати тост
      console.error('Like sync failed', e);
    }
  };

  const normalizedQuery = query.trim().toLowerCase();

  const visibleJobs = items.filter(
    (job: Job) =>
      job.job_title.toLowerCase().includes(normalizedQuery) ||
      job.employer_name.toLowerCase().includes(normalizedQuery)
  );

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    dispatch(fetchJobs('frontend developer'));
  }, [dispatch]);

  // Якщо авторизовано, підвантажити лайки з бекенду і синхронізувати локально
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        if (!isAuthenticated) return;
        const { data } = await axios.get('/likes');
        const serverLiked: string[] = data?.likedJobs ?? [];
        setLikedJobs(serverLiked);
        localStorage.setItem('likedJobs', JSON.stringify(serverLiked));
      } catch (e) {
        console.error('Failed to load likes', e);
      }
    };
    fetchLikes();
  }, [isAuthenticated]);

  // Слухаємо оновлення лайків з інших частин застосунку/вкладок
  useEffect(() => {
    const syncFromLocalStorage = () => {
      try {
        const saved = localStorage.getItem('likedJobs');
        const ids: string[] = saved ? JSON.parse(saved) : [];
        setLikedJobs(ids);
      } catch {}
    };

    window.addEventListener('likes-updated', syncFromLocalStorage as EventListener);
    window.addEventListener('storage', syncFromLocalStorage as EventListener);
    return () => {
      window.removeEventListener('likes-updated', syncFromLocalStorage as EventListener);
      window.removeEventListener('storage', syncFromLocalStorage as EventListener);
    };
  }, []);

  if (isLoading) return (
    <Center py={10}>
      <Spinner color='red.400' mr={3} />
      <Text color='gray.300'><Loading/> </Text>
    </Center>
  );

  if (error) return (
    <Center py={6}>
      <Text color='red.300'>Помилка: {error}</Text>
    </Center>
  );

  return (
    <Box>
      {/* Поле пошуку */}
      <Flex mb={6} gap={2}>
        <Input
          placeholder="Пошук вакансій..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          bg="gray.800"
          borderColor="whiteAlpha.300"
          _placeholder={{ color: "gray.500" }}
        />
        <IconButton 
          aria-label="search" 
          icon={<SearchIcon />} 
          colorScheme="red"
        />
      </Flex>

      {/* Список вакансій */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={4}>
        {visibleJobs.length > 0 ? (
          visibleJobs.map((job: Job) => {
            const isLiked = likedJobs.includes(job.job_id);
            return (
              <Box 
                key={job.job_id}
                borderWidth='1px' 
                borderColor='whiteAlpha.200' 
                bg='gray.900' 
                p={4} 
                rounded='lg' 
                transition='all 0.2s' 
                _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
              >
                <RouterLink 
                  to={`/job-details/${job.job_id}`} 
                  style={{ textDecoration: 'none' }}
                >
                  <Heading size='sm' color='white' mb={1}>
                    {job.job_title}
                  </Heading>
                  <Text fontSize='sm' color='gray.300'>
                    {job.employer_name}
                  </Text>
                </RouterLink>
                
                {/* Кнопка лайка */}
                <Button 
                  size="sm"
                  mt={2}
                  colorScheme={isLiked ? "pink" : "gray"} 
                  onClick={() => toggleLike(job.job_id)}
                >
                  {isLiked ? "💖 В обраному" : "🤍 Додати"}
                </Button>
              </Box>
            );
          })
        ) : (
          <Center gridColumn="1 / -1">
            <Text color="gray.400"> 😢Нічого не знайдено 😢</Text>
          </Center>
        )}
      </SimpleGrid>
    </Box>
  );
};

export default MainPage;
