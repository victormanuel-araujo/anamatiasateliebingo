import React, { useCallback, useState } from "react";
import {
  VISUALIZATION_LIST,
  WordsListDrawerProps,
} from "./words-list-drawer.types";
import { addToWordsList, getWordsList, IWordsList } from "@/config/words-lists";
import { Add, ExpandMore } from "@mui/icons-material";
import {
  Drawer,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Button,
  Divider,
  TextField,
  InputAdornment,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { WordsList } from "../words-list/words-list.component";

export const WordsListDrawer = (props: WordsListDrawerProps) => {
  const [visualizationMode, setVisualizationMode] =
    useState<VISUALIZATION_LIST>(VISUALIZATION_LIST.SELECT_WORDS);

  const [accordionsList, setAccordionsList] = useState<IWordsList[]>(
    getWordsList()
  );
  const [shoulSaveList, setShouldSaveList] = useState<boolean>(false);

  const [listTitle, setListTitle] = useState<string>("");
  const [listWords, setListWords] = useState<string>("");
  const [createListsWords, setCreateListsWords] = useState<string[]>([]);

  const useCreatedListToGenerate = () => {
    if (shoulSaveList) {
      setAccordionsList(addToWordsList(listTitle, createListsWords));
    }

    props.selectList(createListsWords);
    setVisualizationMode(VISUALIZATION_LIST.SELECT_WORDS);
  };

  const addWordToList = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.code !== "Enter") return;
    if (createListsWords.includes(listWords)) return setListWords("");
    setCreateListsWords((prev) => [...prev, listWords.trim()]);
    setListWords("");
  };

  function renderAccordionsList() {
    return (
      <Box margin="16px" flex={1} maxWidth={540} width={540}>
        <Typography variant="h6" mb="24px">
          Selecionar uma lista de palavras:
        </Typography>

        <Box rowGap="16px" display="flex" flexDirection="column">
          {accordionsList.map(({ title, words }, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography component="span">{title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <WordsList words={words} />
              </AccordionDetails>

              <AccordionActions>
                <Button onClick={() => props.selectList(words)}>
                  Selecionar
                </Button>
              </AccordionActions>
            </Accordion>
          ))}
        </Box>
      </Box>
    );
  }

  const shouldDisableListButton = useCallback(() => {
    if (createListsWords.length < 30) return true;
    if (shoulSaveList && listTitle.length < 3) return true;
    return false;
  }, [createListsWords, shoulSaveList, listTitle]);

  function renderCreateList() {
    return (
      <Box margin="16px" flex={1} width={540} maxWidth={540}>
        <Typography variant="h6" mb="24px">
          Criação de lista de palavras
        </Typography>

        <Box display="flex" width="100%" rowGap="24px" flexDirection="column">
          {shoulSaveList && (
            <TextField
              fullWidth
              size="small"
              value={listTitle}
              label="Título da lista"
              onChange={(ev) => setListTitle(ev.target.value)}
            />
          )}

          <TextField
            fullWidth
            helperText={`Palavras adicionadas: ${createListsWords.length}`}
            size="small"
            label="Palavras"
            value={listWords}
            onChange={(ev) => setListWords(ev.target.value)}
            onKeyDown={addWordToList}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Add />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box mt="32px">
          <WordsList
            words={createListsWords}
            onDelete={(index) =>
              setCreateListsWords((prev) =>
                prev.filter((_, filterIndex) => index !== filterIndex)
              )
            }
          />
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
          mt="32px"
          rowGap="16px"
        >
          <FormControlLabel
            control={
              <Switch
                size="small"
                value={shoulSaveList}
                onChange={(ev) => setShouldSaveList(ev.target.checked)}
              />
            }
            label={
              <Typography fontSize="12px" color="grey">
                Salvar lista para usar no futuro
              </Typography>
            }
            labelPlacement="start"
            color="grey"
          />

          <Button
            disabled={shouldDisableListButton()}
            onClick={useCreatedListToGenerate}
          >
            Usar lista criada
          </Button>
        </Box>
      </Box>
    );
  }

  function changeVisualization() {
    if (visualizationMode === VISUALIZATION_LIST.CREATE_LIST)
      return setVisualizationMode(VISUALIZATION_LIST.SELECT_WORDS);
    setVisualizationMode(VISUALIZATION_LIST.CREATE_LIST);
  }

  return (
    <Drawer anchor="right" open={props.open} onClose={props.onClose}>
      {visualizationMode === VISUALIZATION_LIST.SELECT_WORDS
        ? renderAccordionsList()
        : renderCreateList()}

      <Box width="100%">
        <Divider />
        <Box
          padding="16px"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-end"
          columnGap="24px"
        >
          <Button variant="contained" onClick={changeVisualization}>
            {visualizationMode === VISUALIZATION_LIST.SELECT_WORDS
              ? "Criar lista"
              : "Selecionar da lista"}
          </Button>
          <Button onClick={props.onClose}>Cancelar</Button>
        </Box>
      </Box>
    </Drawer>
  );
};
