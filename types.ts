export enum Role {
  User = 'user',
  Model = 'model'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}