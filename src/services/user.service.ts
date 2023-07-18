import { UploadedFile } from "express-fileupload";

import { ApiError } from "../errors";
import { User } from "../models/User.model";
import { userRepository } from "../repositories/user.repository";
import { IUser } from "../types/user.type";
import { s3Service } from "./s3.service";

export interface IQuery {
  page: string;
  limit: string;
  sortedBy: string;
  [key: string]: string;
}

export interface IPaginationResponse<T> {
  page: number;
  perPage: number;
  itemsCount: number;
  itemsFound: number;
  data: T[];
}

class UserService {
  public async findAll(): Promise<IUser[]> {
    return await User.find();
  }

  public async findAllWithPagination(
    query: IQuery
  ): Promise<IPaginationResponse<IUser>> {
    try {
      const queryStr = JSON.stringify(query);
      const queryObj = JSON.parse(
        queryStr.replace(/\b(gte|lte|gt|lt)\b/, (match) => `$${match}`)
      );

      const {
        page = 1,
        limit = 10,
        sortedBy = "createdAt",
        ...searchobject
      } = queryObj;
      const skip = +limit * (+page - 1);

      age: {
        $gte: 5;
      } // форма записи для поиска к примеру по возрасту старше 5

      const [users, usersTotalCount, usersSearchCount] = await Promise.all([
        User.find(searchobject).limit(+limit).skip(skip).sort(sortedBy).exec(),
        User.countDocuments().exec(),
        User.countDocuments(searchobject).exec(),
      ]);

      const user = await User.findByEmail("aisclass2012@gmail.com");
      console.log(user);
      user.nameWithAge();
      console.log(user.nameWithAge());
      console.log(user.nameWithSurname);

      return {
        page: +page,
        perPage: +limit,
        itemsCount: usersTotalCount,
        itemsFound: usersSearchCount,
        data: users,
      };
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async create(data: IUser): Promise<IUser> {
    return await userRepository.create(data);
  }

  public async findById(id: string): Promise<IUser> {
    return await this.getOneByIdOrThrow(id);
  }

  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    await this.getOneByIdOrThrow(userId);

    return await User.findOneAndUpdate(
      { _id: userId },
      { ...dto },
      { returnDocument: "after" }
    );
  }

  public async deleteById(userId: string): Promise<void> {
    await this.getOneByIdOrThrow(userId);

    await User.deleteOne({ _id: userId });
  }

  public async uploadAvatar(
    userId: string,
    avatar: UploadedFile
  ): Promise<IUser> {
    const user = await this.getOneByIdOrThrow(userId);

    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }
    const pathToFile = await s3Service.uploadFile(avatar, "user", userId);

    return await User.findByIdAndUpdate(
      userId,
      { $set: { avatar: pathToFile } },
      { new: true }
    );
  }

  public async deleteAvatar(userId: string): Promise<IUser> {
    const user = await this.getOneByIdOrThrow(userId);

    if (!user.avatar) {
      return user;
    }
    await s3Service.deleteFile(user.avatar);

    return await User.findByIdAndUpdate(
      userId,
      { $unset: { avatar: true } },
      { new: true }
    );
  }

  private async getOneByIdOrThrow(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError("User not found", 422);
    }
    return user;
  }
}

export const userService = new UserService();
