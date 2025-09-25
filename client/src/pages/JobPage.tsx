import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import rapidApiClient from '../utils/rapidApiClient'
import { Box, Button, Container, Heading, Text } from '@chakra-ui/react'
import Loading from '../components/Loading'

const JobPage: React.FC = () => {
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams();
  const navigate = useNavigate();

  const jobId = params.id as string | undefined;

  const fetchPost = useCallback(async () => {
    try {
      if (!jobId) return;
      setLoading(true);
      const { data } = await rapidApiClient.get('/job-details', {
        params: { job_id: jobId },
      });
      const details = Array.isArray(data?.data) ? data.data[0] : null;
      setJob(details);
    } catch (error) {
      console.error("Помилка при завантаженні вакансії:", error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading) {
    return (
      <Container maxW='3xl' py={10}>
        <Text textAlign='center' color='gray.300'><Loading/></Text>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container maxW='3xl' py={10}>
        <Text textAlign='center' color='gray.300'>Вакансію не знайдено</Text>
      </Container>
    );
  }

  return (
    <Container maxW='3xl'>
      <Button mb={4} variant='outline' colorScheme='whiteAlpha' onClick={() => navigate(-1)}>
        ← Назад
      </Button>
      <Box borderWidth='1px' borderColor='whiteAlpha.200' bg='gray.900' rounded='xl' p={{ base: 5, md: 6 }} shadow='sm'>
        <Heading size='lg' color='white' mb={2}>{job.job_title}</Heading>
        {job.employer_name && (
          <Text fontSize='sm' color='gray.300' mb={4}>{job.employer_name}</Text>
        )}
        <Text whiteSpace='pre-line' color='gray.200' lineHeight='tall'>
          {job.job_description}
        </Text>
      </Box>
    </Container>
  );
};

export default JobPage;
