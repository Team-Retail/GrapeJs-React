export type User = {
  _id: string;
  email: string;
  token: string;
  firstName: string;
  lastName: string;
  companyName: string;
};


export interface Image {
  key: string;
  url: string;
}

export interface PageImages {
  [key: string]: Image[];
}

export interface GroupedImages {
  images: PageImages;
  color_palette: PageImages;
  icons: PageImages;
  full_text: PageImages;
  sub_text: PageImages;
}