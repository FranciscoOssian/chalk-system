export interface UserType {
  name: string;
  bio: string;
  age: number;
  uid: string;
  gender: string;
  profilePicture: string;
  authenticated: boolean;
  matchingConfig: {
    from: number;
    to: number;
    lang: string;
    genders: string[];
  };
}
