export interface Ticket {
    _id?: string;             // el id del ticket
    category: string;           // el tipo de ticket
    anonymous: boolean;     // si el usuario quiere ser anonimo
    status?: boolean;        // abierto o cerrado
    area: string;           // aquien va dirigido
    sub_area: string;
    chat?: Array<Message>;   // los mensajes
    user?: string;            // el usuario que envia el ticket
    rating?: number;        // La calificación que se le da
    active?: boolean;
}

export interface Message {
    id?: number;
    timestamp?: number;
    text: string;
    from_user: boolean;
    ticket: string;
}

export interface Area {
    name: string;
    icon: string;
    active: boolean;
    _id?: string;
    subareas?: Array<Subarea>;
}

export interface Subarea {
    name: string;
    area: string;
    active: boolean;
    _id?: string;
}

export interface Category {
    _id?: string;
    name: string;
    icon: string;
    active: boolean;
}

export interface User {
    _id: string;
    nombre: string;
    apellido_paterno:string;
    apellido_materno:string;
    email: string;
    password:string;
    is_admin: number;
    job_title:string;
    phone_number:string;
}

export interface Admin {
    user: string;
    area: string;
}