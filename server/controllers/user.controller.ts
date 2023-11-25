import { Request, Response } from 'express';
// import { getRepository } from 'typeorm';
import { AppDataSource } from '../index';
import { User } from '../entities/user.entity';
import { instanceToPlain } from 'class-transformer';
import jwt from 'jsonwebtoken';
 
class UserController {
  // get all users
  getAllUsers = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    return res.status(200).json({ users });
  };

  register = async (req: Request, res: Response) => {
    const { userName, fullName, email, password } = req.body;

    // Check if user already exists
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User();
    newUser.userName = userName;
    newUser.fullName = fullName;
    newUser.email = email;
    newUser.password = password;
    // newUser.role = UserRole.NORMAL;

    // Save user to database
    try {
      const registeredUser = await userRepository.save(newUser);
      console.log(registeredUser);
      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to create user' });
    }
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(email, password);

    // Check if user exists
    const userRepository = AppDataSource.getRepository(User);
    let userFound;
    try {
      userFound = await userRepository.findOne({ where: { email: email } });
    } catch (error) {
      console.log(error);
    }
    if (!userFound) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password is correct
    const isPasswordCorrect = userFound.password === password;
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const plainUser = instanceToPlain(userFound);
    const userMinusPassword = {
      ...plainUser,
      password: undefined,
      id: undefined
    };
    const token = await this.createToken(userMinusPassword);

    // Return token and userFound data
    return res.status(200).json({ token, user: userFound });
  };

  createToken = async (payload: object) => {
    const token = jwt.sign(payload, '0000', {
      expiresIn: '7d',
    });
    console.log(token);

    return token;
  };
}

export const userController = new UserController();
