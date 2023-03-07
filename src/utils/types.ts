export interface CVDetail {
  id: string;
  objective: string;
  cvUrl: string;
  minExpectedSalary: number;
  maxExpectedSalary: number;
  numberOfYearsExperience: number;
  skills: string;
  tags: String;
  jobPosition: string;
  createdAt: any;
  updatedAt: any;
  deletedAt: any;
  createdBy: string;
}
export interface ProfileData {
  userId: string;
  nickname: string;
  photoUrl: string;
  backgroundUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletType {
  id: string;
  address: string;
}

export interface UserType {
  id: string;
  roleId: string;
  createAt: string;
  profile: ProfileData;
  isVerified: boolean;
  emailCredentials: [
    {
      id: string;
      email: string;
    }
  ];
  wallets: WalletType[];
}
