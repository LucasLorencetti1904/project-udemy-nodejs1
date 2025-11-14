import type Model from "@/common/domain/models/Model"

type UserTokenModel = Model & {
    token: string,
    userId: string,
};

export default UserTokenModel;