import User from '../models/User.js';

export const getLikes = async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ likedJobs: user.likedJobs || [] });
  } catch (e) {
    console.error('getLikes error:', e);
    return res.status(500).json({ message: 'Failed to get likes' });
  }
};

export const likeJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    if (!jobId) return res.status(400).json({ message: 'jobId is required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.likedJobs.includes(jobId)) {
      user.likedJobs.push(jobId);
      await user.save();
    }

    return res.json({ likedJobs: user.likedJobs });
  } catch (e) {
    console.error('likeJob error:', e);
    return res.status(500).json({ message: 'Failed to like job' });
  }
};

export const unlikeJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    if (!jobId) return res.status(400).json({ message: 'jobId is required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.likedJobs = (user.likedJobs || []).filter((id) => id !== jobId);
    await user.save();

    return res.json({ likedJobs: user.likedJobs });
  } catch (e) {
    console.error('unlikeJob error:', e);
    return res.status(500).json({ message: 'Failed to unlike job' });
  }
};
