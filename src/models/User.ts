// MODEL: User
export interface User {
  id: string;
  name: string;
  gender: string | null;
  dob: string | null;
  avatar: string | null;
  username: string;
  email: string;
  phone: string;
  login_streak: number;
  last_login_at: string | null;
  role_id: string | null;


}

