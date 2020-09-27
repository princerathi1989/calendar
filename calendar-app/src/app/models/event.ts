import { startOfDay, endOfDay } from 'date-fns';
export interface IEventValues {
    id: number;
    title: string;
    color: Color;
    start: Date | null;
    end: Date | null;
}

export interface Color {
    primary: string;
    secondary: string;
}

export class EventValues implements IEventValues {
    id: number;
    title: string;
    color: Color;
    start: Date | null;
    end: Date | null;
    constructor(data?: any) {
        this.id = data ? data.id : 1;
        this.title = data ? data.title : 'New Event';
        this.color = {
            primary : data ? data.color ? data.color.primary : '#d93c00' : '#d93c00',
            secondary : data ? data.color ? data.color.secondary : '#018928' : '#018928'
        };
        this.start = data ? data.start : startOfDay(new Date());
        this.end = data ? data.end : endOfDay(new Date());
    }
}
