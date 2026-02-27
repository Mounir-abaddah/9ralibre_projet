import type { typedata } from "@/store/userStore";

export interface lastMessage{
    _id:string;
    sender:string;
    text:string;
}

export interface typeChat{
    _id:string;
    members:typedata[];
    createdAt:string;
    updatedAt:string;
    lastMessage:lastMessage;
    unreadCount:number; 
}