// src/pages/LikePage.tsx
import { useEffect, useState } from "react";
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Center,
  Button,
  Flex,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import axios from "../utils/axios";

interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
}

const LikePage = () => {
  const [likedJobs, setLikedJobs] = useState<Job[]>([]);

  // при завантаженні читаємо localStorage
  useEffect(() => {
    const saved = localStorage.getItem("likedJobsData");
    if (saved) {
      setLikedJobs(JSON.parse(saved));
    }
  }, []);

  // видалення з обраних
  const removeFromLiked = (jobId: string) => {
    const updated = likedJobs.filter((job) => job.job_id !== jobId);
    setLikedJobs(updated);
    localStorage.setItem("likedJobsData", JSON.stringify(updated));
    try {
      // Також оновлюємо список ID лайків, щоб на сторінці вакансій серце стало порожнім
      const savedIds = localStorage.getItem("likedJobs");
      const ids: string[] = savedIds ? JSON.parse(savedIds) : [];
      const newIds = ids.filter((id) => id !== jobId);
      localStorage.setItem("likedJobs", JSON.stringify(newIds));

      // Якщо користувач авторизований (є токен), синхронізуємо бекенд
      const hasToken = !!localStorage.getItem("token");
      if (hasToken) {
        axios.delete(`/likes/${jobId}`).catch(() => {});
      }
    } catch {
      console.log('проблема з видаленням ')
    }

    // Сповіщаємо поточну вкладку про зміну лайків (подія storage не спрацьовує в тій самій вкладці)
    window.dispatchEvent(new Event("likes-updated"));
  };

  return (
    <Box p={6}>
      <Heading mb={6} color="white">
        💖 Обрані вакансії
      </Heading>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={4}>
        {likedJobs.length > 0 ? (
          likedJobs.map((job) => (
            <Box
              key={job.job_id}
              borderWidth="1px"
              borderColor="whiteAlpha.200"
              bg="gray.900"
              p={4}
              rounded="lg"
            >
              <RouterLink
                to={`/job-details/${job.job_id}`}
                style={{ textDecoration: "none" }}
              >
                <Heading size="sm" color="white" mb={1}>
                  {job.job_title}
                </Heading>
                <Text fontSize="sm" color="gray.300">
                  {job.employer_name}
                </Text>
              </RouterLink>

              <Flex mt={3}>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => removeFromLiked(job.job_id)}
                >
                  ❌ Видалити
                </Button>
              </Flex>
            </Box>
          ))
        ) : (
          <Center gridColumn="1 / -1">
            <Text color="gray.400">У тебе ще нема збережених вакансій 😢</Text>
          </Center>
        )}
      </SimpleGrid>
    </Box>
  );
};

export default LikePage;
