import prisma from "../db";
import { createJWT, hashPassword, comparePassword } from "../modules/utils";

export const createNewUser = async (req, res) => {
  const existingUser =
    (await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    })) || null;

  if (existingUser) {
    return res.status(401).json({
      message: "Username already exist. Please choose a different one",
    });
  }

  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      password: await hashPassword(req.body.password),
    },
  });
  const token = createJWT(user);
  return res.status(200).json({
    token,
    user,
    message: "New user account has been created successfully",
  });
};

export const signIn = async (req, res) => {
  const user =
    (await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    })) || null;

  if (!user) {
    return res.status(401).json({
      message: "Username does not exist",
    });
  }

  const passwordMatch = await comparePassword(req.body.password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({
      message: "Password does not match",
    });
  }

  const token = createJWT(user);
  return res.status(200).json({
    token,
    user,
    message: "User has been signed in successfully",
  });
};
