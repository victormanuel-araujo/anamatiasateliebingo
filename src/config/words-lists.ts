export const DEFAULT_WORDS_LISTS = [
  {
    title: "Chá de bebê / revelação",
    words: [
      "ALGODÃO",
      "ALMOFADA P/ AMAMENTAÇÃO",
      "ASPIRADOR NASAL",
      "BABADOR",
      "BABÁ ELETRÔNICA",
      "BANHEIRA",
      "BEBÊ CONFORTO",
      "BERÇO",
      "BODY",
      "CALÇA/MIJÃO",
      "CARRINHO",
      "CANGURU/ SLING",
      "CORTADOR DE UNHAS",
      "COTONETE",
      "CHUPETA",
      "CREME PARA ASSADURAS",
      "ESCOVA",
      "FRALDA",
      "JOGO DE LENÇOL",
      "LEITE",
      "LENÇO UMEDECIDO",
      "LUVAS",
      "MACACÃO",
      "MAMADEIRA",
      "MANTA",
      "MEIAS",
      "MÓBILE",
      "MORDEDOR",
      "PANO DE BOCA",
      "PENTE",
      "SAPATINHOS",
      "SABONETE",
      "SHAMPOO",
      "TALCO",
      "TERMÔMETRO",
      "TOALHA",
      "TOUQUINHA",
      "TRAVESSEIRO",
      "TROCADOR",
    ]
  },
  {
    title: "Chá de panela",
    words: [
      "Abridor de latas",
      "Afiador de facas",
      "Assadeiras",
      "Avental ",
      "Batedor de ovos ",
      "Coador ",
      "Colher de pau",
      "Concha",
      "Copo medidor",
      "Descanso de panelas",
      "Escorredor de macarrão",
      "Escorredor de louças",
      "Espremedor de alho",
      "Espremedor de limão",
      "Faqueiro",
      "Forma de gelo",
      "Funil",
      "Frigideira",
      "Garrafa térmica",
      "Jarra",
      "Jogo de copos",
      "Jogo de panelas",
      "Jogo de xícaras",
      "Leiteira ",
      "Luva térmica",
      "Panela de pressão",
      "Pano de prato",
      "Pegador de macarrão",
      "Peneiras",
      "Porta temperos",
      "Porta talheres",
      "Potes de armazenamento",
      "Ralador",
      "Rolo de massas",
      "Saladeira",
      "Tábua de corte",
      "Talheres",
      "Taças",
      "Tesoura de cozinha",
      "Vassoura",
    ],
  },
];

const WORDS_LIST_STORAGE_KEY = '@anamatiasatelie/words_list'

export interface IWordsList {
  title: string;
  words: string[];
}

export function bootLocalStorage() {
  if (typeof window === "undefined") return;
  const wordsListString = window?.localStorage?.getItem(WORDS_LIST_STORAGE_KEY);
  if (!!wordsListString) return;

  window?.localStorage?.setItem(WORDS_LIST_STORAGE_KEY, JSON.stringify(DEFAULT_WORDS_LISTS));
}

export function getWordsList() {
  if (typeof window === "undefined") return [];
  const wordsListString = window?.localStorage?.getItem(WORDS_LIST_STORAGE_KEY);
  if (!wordsListString) return DEFAULT_WORDS_LISTS;

  return JSON.parse(wordsListString);
}

export function addToWordsList(title: string, words: string[]): IWordsList[] {
  if (typeof window === "undefined") return [];
  const wordsListString = window?.localStorage?.getItem(WORDS_LIST_STORAGE_KEY);
  if (!wordsListString) return [];

  const parsedWordsList = JSON.parse(wordsListString);
  parsedWordsList.push({ title, words });

  window?.localStorage?.setItem(WORDS_LIST_STORAGE_KEY, JSON.stringify(parsedWordsList));
  return parsedWordsList;
}
