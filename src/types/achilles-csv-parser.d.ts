declare module "achilles-csv-parser" {
  export const parse: (content: string) => { front: string; back: string }[];
}
