import type { typedata } from "@/store/userStore";

export interface typeMessage{
    _id:string;
    conversationId:string;
    readBy:string[];
    sender:typedata | string;
    text:string;
    createdAt:string;
    updatedAt:string;
}