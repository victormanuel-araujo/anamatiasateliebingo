"use client";

import { LabeledInput } from "@/components/labeled-input";
import { WordsList } from "@/components/words-list";
import { WordsListDrawer } from "@/components/words-list-drawer";
import { bootLocalStorage } from "@/config/words-lists";
import { Delete } from "@mui/icons-material";
import {
  Typography,
  Box,
  Divider,
  List,
  Button,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const printArtsLookup = useRef<Record<number, Record<string, boolean>>>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [wordsList, setWordsList] = useState<string[]>([]);

  const [amountToGenerate, setAmountToGenerate] = useState(1);
  const [fileToGenerate, setFileToGenerate] = useState<File | null>(null);
  const [artsToGenerateList, setArtsToGenerateList] = useState<
    { file: File; amount: number }[]
  >([]);

  const clearForm = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.files = null;
    }
    setFileToGenerate(null);
    setAmountToGenerate(1);
  };

  const generateTextsToAddOnArt = useCallback(
    (artIndex: number) => {
      if (!wordsList || !wordsList.length) return [];

      const wordsArray = [];
      const usedIndexLookup: Record<number, boolean> = {};

      for (let i = 0; i < 11; i++) {
        if (i === 5) wordsArray.push("");

        let iteration = 0;
        let randomIndex;
        do {
          iteration++;
          randomIndex = Math.floor(Math.random() * wordsList.length);
        } while (usedIndexLookup[randomIndex] && iteration < wordsList.length);

        usedIndexLookup[randomIndex] = true;
        wordsArray.push(wordsList[randomIndex]);
      }

      const sortedList = [...wordsArray].sort();
      if (printArtsLookup.current[artIndex]?.[sortedList.sort().join(",")])
        return generateTextsToAddOnArt(artIndex);

      if (!printArtsLookup.current[artIndex])
        printArtsLookup.current[artIndex] = {};
      printArtsLookup.current[artIndex][sortedList.sort().join(",")] = true;

      return wordsArray;
    },
    [wordsList]
  );

  const addArtAndAmountToList = () => {
    if (!fileToGenerate || amountToGenerate === 0) return;
    setArtsToGenerateList((prev) => [
      ...prev,
      { amount: amountToGenerate, file: fileToGenerate as File },
    ]);
    clearForm();
  };

  const changeWordsList = (wordsList: string[]) => {
    setWordsList(wordsList);
    setIsDrawerOpen(false);
  };

  const removeItemFromList = (index: number) => {
    setArtsToGenerateList((prev) => {
      return prev.filter((_, filterIndex) => filterIndex !== index);
    });
  };

  useLayoutEffect(() => {
    bootLocalStorage();
  }, []);

  return (
    <div>
      <main
        style={{ width: "100vw", height: "100vh", padding: "32px 24px" }}
        className="prevent-print"
      >
        <Box width="100%">
          <Typography component="h1" fontSize={32} fontWeight={500}>
            Gerador de bingos
          </Typography>
          <Divider />

          <Box display="flex" flexDirection="row" columnGap="24px" mt="16px">
            <Box
              display="flex"
              flexDirection="column"
              mt="24px"
              rowGap="16px"
              flex={1}
            >
              <LabeledInput
                type="file"
                inputRef={fileInputRef}
                title="Selecione a arte para as cartelas:"
                onChange={(ev) =>
                  setFileToGenerate(
                    (ev.target as HTMLInputElement)?.files?.[0] || null
                  )
                }
              />

              <LabeledInput
                title="Quantas cartelas devem ser geradas para essa arte:"
                value={amountToGenerate}
                onChange={(ev) =>
                  setAmountToGenerate(
                    Number((ev.target.value || "").replace(/\D/g, ""))
                  )
                }
                type="text"
              />

              <Box
                display="flex"
                columnGap="16px"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Button variant="contained" onClick={addArtAndAmountToList}>
                  Adicionar
                </Button>

                <Button onClick={clearForm}>Limpar</Button>
              </Box>

              <Divider />

              <List>
                {artsToGenerateList.map(({ amount, file }, index) => (
                  <ListItem
                    secondaryAction={
                      <IconButton
                        aria-label="comment"
                        onClick={() => removeItemFromList(index)}
                      >
                        <Delete />
                      </IconButton>
                    }
                    disableGutters
                    key={index}
                  >
                    <ListItemText
                      primary={`Aquivo: ${file.name}, quantidade: ${amount}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box flex={1}>
              <Typography>Lista de palavras para o bingo</Typography>

              <Box height={250} maxHeight={250} overflow="scroll" mt="16px">
                {wordsList.length ? (
                  <WordsList words={wordsList} />
                ) : (
                  <Box
                    width="100%"
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                    display="flex"
                  >
                    <Typography color="grey">
                      Nenhuma lista selecionada
                    </Typography>
                  </Box>
                )}
              </Box>

              <Button variant="contained" onClick={() => setIsDrawerOpen(true)}>
                Alterar lista
              </Button>
            </Box>
          </Box>
        </Box>

        <WordsListDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          selectList={changeWordsList}
        />
      </main>

      <div className="print-generated-arts">
        <Box
          width="100vw"
          display="flex"
          flexWrap="wrap"
          columnGap="2px"
          rowGap="11px"
        >
          {artsToGenerateList.map(({ amount, file }, artIndex) =>
            Array(amount)
              .fill(0)
              .map((_, index) => (
                <Box
                  key={index}
                  position="relative"
                  width="calc(50vw - 2px)"
                  height="calc(50vw - 2px)"
                >
                  <img alt="" src={URL.createObjectURL(file)} />

                  <Box
                    position="absolute"
                    width="80%"
                    height="49.5%"
                    bottom="14%"
                    left="9.5%"
                    display="flex"
                    flexDirection="row"
                    flexWrap="wrap"
                    justifyContent="space-between"
                    rowGap="5.5%"
                  >
                    {generateTextsToAddOnArt(artIndex).map((value, index) => (
                      <Box
                        key={index}
                        width="calc(25% - 2px)"
                        height="calc(33% - 8px)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <span
                          className={`print-text-inside-ballon ${
                            value.length >= 22 ? "small" : ""
                          }`}
                        >
                          {value}
                        </span>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))
          )}
        </Box>
      </div>
    </div>
  );
}
