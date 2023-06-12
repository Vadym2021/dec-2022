import {ApiError} from "../errors";
import {User} from "../models/User.mode";
import {userRepository} from "../repositories/user.repository";
import {IUser} from "../types/user.type";

class UserService {
    public async findAll(): Promise<IUser[]> {

        return await User.find().select("+password"); //select("+password") виводимо пароль, якщо не треба, то видалити
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
            {_id: userId},
            {...dto},
            {returnDocument: "after"}
        );
    }

    private async getOneByIdOrThrow(userId: string): Promise<IUser> {

        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError('User not found', 422)
        }
        return user;
    }

    public async deleteById(userId: string): Promise<void> {
        await this.getOneByIdOrThrow(userId);

        await User.deleteOne({_id: userId});
    }
}


export const userService = new UserService();
