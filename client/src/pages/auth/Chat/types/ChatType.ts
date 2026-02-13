export interface ChatMember {
  _id: string
  nom: string
  prenom: string
  role: string
  image: string
}

export interface ChatType {
  _id: string
  members: ChatMember[]
  createdAt: string
  updatedAt: string
  __v: number
  unreadCount?: number // 🔥 Nombre de messages non lus
}
