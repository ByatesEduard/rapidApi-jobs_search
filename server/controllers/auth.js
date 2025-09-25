import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Register attempt:', { email, hasPassword: !!password });

    // Перевірка наявності даних
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: "Email та пароль обов'язкові" });
    }

    // Простa валідація email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ message: "Невірний формат email" });
    }

    // Простa валідація пароля (мінімум 6 символів)
    if (password.length < 6) {
      return res.status(400).json({ message: "Пароль повинен містити мінімум 6 символів" });
    }

    const isUsed = await User.findOne({ email });
    if (isUsed) {
      return res.status(400).json({ message: "Email вже використовується" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      password: hash,
      likedJobs: []
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.json({
      token,
      user: { _id: newUser._id, email: newUser.email, likedJobs: newUser.likedJobs },
      message: "Користувач успішно зареєстрований"
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: "Помилка реєстрації" });
  }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        console.log('Login attempt:', { email, hasPassword: !!password });

        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({ message: "Email та пароль обов'язкові" });
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Invalid email format:', email);
            return res.status(400).json({ message: "Невірний формат email" });
        }
        
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Неправильні дані для входу"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Неправильні дані для входу"});
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "30d"}
        );

        return res.json({
            token,
            user: { _id: user._id, email: user.email, likedJobs: user.likedJobs || [] },
            message: "Успішний вхід"
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({message: "Помилка входу"});
    }
};

export const getMe = async (req, res) => {
    try {
        if(!req.userId){
            return res.status(403).json({message: "Access denied"});
        }

        const user = await User.findById(req.userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, {expiresIn: "30d"});

        res.json({
            token,
            user
        })
    } catch (error) {
        res.status(500).json({message: "Dont forget to login"})
    }
}