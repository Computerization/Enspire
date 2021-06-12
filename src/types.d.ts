type Club = {
  readonly id: number;
  readonly category_id: number;
  readonly zh_name: string;
  readonly en_name: string;
  readonly pinyin_name: string;
  readonly zh_desc: string;
  readonly en_desc: string;
  readonly services?: {
    readonly website?: string;
  };
};

type application = {
  readonly period: number;
  readonly date: Date;
  readonly submissionDate: Date;
  readonly reason: string;
  readonly teacher: string;
  readonly status: "approved" | "pending" | "rejected";
};
