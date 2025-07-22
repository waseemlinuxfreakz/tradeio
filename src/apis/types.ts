export type GoogleLoginResponse = {
  status: number;
  data: {
    error?: string;
    message?: string;
    user?: {
      id: string;
      email: string;
      // add other user fields if needed
    };
  };
};
