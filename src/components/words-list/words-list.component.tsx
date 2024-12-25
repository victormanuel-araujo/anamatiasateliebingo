import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { WordsListProps } from "./words-list.types";
import { Delete } from "@mui/icons-material";

export const WordsList = ({ words, onDelete }: WordsListProps) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      columnGap="12px"
      rowGap="12px"
      alignItems="center"
      justifyContent="center"
    >
      {words.map((value, index) => (
        <Box
          key={index}
          border="1px solid"
          paddingY="4px"
          paddingX="12px"
          borderColor="lightgray"
          color="grey"
          borderRadius="4px"
          height="max-content"
          columnGap="8px"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <Box position="relative" top={1}>
            <Typography>{value}</Typography>
          </Box>

          {onDelete && (
            <IconButton onClick={() => onDelete(index)} style={{ padding: 0 }}>
              <Delete fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}
    </Box>
  );
};
