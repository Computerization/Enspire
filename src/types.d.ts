type ClubInfo = {
  readonly id: number;
  readonly chnName: string;
  readonly engName: string;
  readonly chnDesc: string;
  readonly engDesc: string;
  readonly services?: {
    readonly website?: string;
  };
};
