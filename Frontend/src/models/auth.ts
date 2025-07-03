export interface ILoginResponse {
  token: string;
  user: IUserData;
}

export interface IUserData {
  _id: string;
  firstName: string;
  password: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  role: number;
}

export interface ILoginFormValue {
  email: string;
  password: string;
}

export interface ILoginResponseFail {
  message: string;
  code: string;
}

export interface ILoginResponseFailed {
  error: string;
}


