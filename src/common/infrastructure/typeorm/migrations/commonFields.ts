import { TableColumnOptions } from "typeorm";

export const id: TableColumnOptions = {
    name: "id",
    type: "uuid",
    isPrimary: true,
    generationStrategy: "uuid",
    default: "uuid_generate_v4()"
};

export const createdAt: TableColumnOptions = {
    name: "created_at",
    type: "timestamp",
    default: "CURRENT_TIMESTAMP"
};

export const updatedAt: TableColumnOptions = {
    name: "updated_at",
    type: "timestamp",
    default: "CURRENT_TIMESTAMP"
};

export const timestamps: TableColumnOptions[] = [
    createdAt,
    updatedAt
];

const commonFields: TableColumnOptions[] = [
    id,
    ...timestamps
];

export default commonFields;