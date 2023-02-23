export interface IUserPackageInfo {
    afsenderNavn: string;
    afsenderAdresse: string;
    afsenderLand: string;
    modtagerNavn: string;
    modtagerAdresse: string;
    varerIAlt: string;
    pakkerIAlt: string;
    valuta: string;
    vareBeskrivelse?: string;
    vareKode: string;
    vaegt: string;
    vaegtEnhed: "kg" | "lb";
    gave: boolean;
    trackingNumber: string; 
    pakkePris: string;
    fragtPris: string;
}