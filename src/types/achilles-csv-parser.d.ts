declare module "achilles-csv-parser" {
  export const parse: (
    content: string
  ) => { jerriais: string; english: string }[];
}
