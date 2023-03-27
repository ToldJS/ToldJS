import { z } from "zod";

export const inputSchema = z.object({
  modtager: z.object({
    navn: z.string().nonempty(),
    addresse: z.string().nonempty()
  }),
  afsender: z.object({
    navn: z.string().nonempty(),
    addresse: z.string().nonempty(),
    land: z.string().nonempty()
  }),
  pakkeinfo: z.object({
    valuta: z.string().nonempty(),
    fragtpris: z.string().regex(/^[+]?(\d*(\.|,))?\d+$/),
    vægt: z.string().regex(/^[+]?(\d*(\.|,))?\d+$/),
    vægtEnhed: z.enum(['kg', 'lb']),
    gave: z.boolean()
  }),
  varer: z
    .object({
      antal: z.number().int().min(1),
      beskrivelse: z.string().nonempty(),
      varekode: z.string().nonempty(),
      pris: z.string().regex(/^[+]?(\d*(\.|,))?\d+$/)
    })
    .array()
});
export type inputSchema = z.infer<typeof inputSchema>;

export interface IReturnPackageInfo {
  "Paragraph-XBmZnk_Srq": string,
  "Paragraph-gkNPApzl3u": string,
  "Paragraph-i50fqh2_X4": string,
  "Paragraph-e5q0m4rY8T": string,
  "Paragraph-XV11j-QheT": string,
  "Paragraph-wGaObkhsZx": string,
  "Paragraph-GrfeejCUP0": string,
  "Paragraph-SiTU2MooOi": string,
  "Text-PiYzs293Y0": string,
  "Text-Rw3KyxekGY": string,
  "Text-_i-Ij4vfm-": string,
  "Text-2m6m5775oA": string,
  "Text-48HtIw2mbQ": string,
  "Text-ie8YPD_3Cp": string,
  "Text-hiwAnkNgDZ": string,
  "Text-krZIKZ8C1L": string,
  "Text-rbiHV68ups": string,
  "Text-5OZwfBKoeQ": string,
  "Text-3fGwFJumdT": string,
  "Text-2OaVb3yIok": string,
  "Text-vcYrmOBi0r": string,
  "Text-Ig2RP-DMyu": string,
  "Text-lIGpxzVG9K": string,
  "Text-MZHN36Cq6o": string,
  "Text-Z-0qnHPoNw": string,
  "Text-bNe-IGw-2l": string,
  "Text-VCTP6H0oqb": string,
  "Text-rmaLuaF7fc": string,
  "Text-ZMQQaEnH75": string,
  "Text-DELFVaUWwe": string,
  "Text-y37_GgETGg": string,
  "Text-I7K5ODHj6N": string,
  "Text-LETnSee-lw": string,
  "Text-SmAH_sbVkX": string,
  "Text-Nk4H6gS4bF": string,
  "Text--uoJu5kXaW": string,
  "Text-Qu44ql-9Yf": string,
  "Text-BdBAFlOpad": string,
  "Text-Cplh5EoNhS": string,
  "Text-Hhm7UHiU_i": string,
  "Text-iSgQu01Q22": string,
  "Text-JpYnmqUvjD": string,
  "Text-RrwGZzfWmv": string,
  "Text-E2Pi5dt9Lo": string,
  "Text-8W0o1rIqF-": string,
  "Text-zSF-wJqykx": string
}

export interface IReturnInfo {
  desc: string,
  packageInfo: IReturnPackageInfo,
}