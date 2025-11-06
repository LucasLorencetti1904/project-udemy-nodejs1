import type Model from "@/common/domain/models/Model"

type UserModel = Model & {
    name: string,
    email: string,
    password: string,
    avatar?: string
};

export default UserModel;