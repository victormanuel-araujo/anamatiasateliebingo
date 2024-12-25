export enum VISUALIZATION_LIST {
  SELECT_WORDS,
  CREATE_LIST,
}

export interface WordsListDrawerProps {
  open: boolean;
  onClose(): void;
  selectList(words: string[]): void;
}
