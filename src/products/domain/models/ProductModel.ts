import type Model from "@/common/domain/models/Model";

type ProductModel = Model & {
    name: string,
    price: number,
    quantity: number
};

export default ProductModel;