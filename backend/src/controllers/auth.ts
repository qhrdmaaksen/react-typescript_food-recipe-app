import { Request, Response } from "express";
import { User } from "../model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {CONSTANTS} from "src/constants";

// 토큰을 발급하는 함수
const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRESIN as string,
  });
};

// 데이터 베이스에 등록된 유저 정보를 가져오는 함수
export const registerOrLogin = async (req: Request, res: Response) => {
  // 클라이언트에게 전달할 데이터
  const { email, password }: { email: string; password: string } = req.body;

  try {
    // 데이터 베이스에 등록된 유저 정보 가져오기
    const _user = await User.findOne({ email }).select("+password").exec();

    if (_user) {
      // 데이터 베이스에 등록된 유저 비밀번호와 클라이언트에게 전달받은 비밀번호가 일치하지 않은 경우
      if (!(await bcrypt.compare(password, _user?.password as string))) {
        return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
      }
      /*
        데이터 베이스에 등록된 유저 비밀번호와 클라이언트에게 전달받은 비밀번호가 일치하는 경우 토큰발급      */
      const token = signToken(_user?._id as unknown as string);
      return res.status(200).json({ token, email, id: _user?.id });
    }
    // 데이터 베이스에 등록된 유저 정보가 없는 경우 새로운 유저 등록 후 토큰 발급
    const newUser = await User.create({ email, password: await bcrypt.hash(password, CONSTANTS.SALT) });
    const token = signToken(newUser?._id as unknown as string);

    return res
      .status(201)
      .json({ token, email: newUser?.email, id: newUser._id });
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ error: "요청을 처리하는 동안 오류가 발생했습니다" });
  }
};
