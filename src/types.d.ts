/* eslint-disable camelcase */
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
