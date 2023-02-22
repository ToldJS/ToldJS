export interface IApiResult {
    Sender?: string;
    Origin?: string;
    Destination?: string;
    Weight?: number;
    Unit?: "kg" | "lb";
}