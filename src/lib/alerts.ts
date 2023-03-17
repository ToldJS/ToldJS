import { writable, type Writable } from "svelte/store";
import type { IconSource } from "@steeze-ui/heroicons/types";


export interface Alert { 
    name: string,
    body: string,
    type: "INFO" | "WARN" | "ERROR" | "MESSAGE" | "EVENT" | [string, IconSource],
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right",
    time?: number
};

export const alerts:Writable<Alert[]> = writable([]);

export const createAlert = (alert:Alert) => {
    alerts.update(x => x.push(alert) && x);
};