import type { Request } from "express";

export interface UserRequestBody {
    id: number;
    username: string;
    email: string;
    created_at: Date;
}

export interface UserRequest extends Request <{}, {}, UserRequestBody> {
    auth?: {
        sub: string;
        [key: string]: any;
    };
}