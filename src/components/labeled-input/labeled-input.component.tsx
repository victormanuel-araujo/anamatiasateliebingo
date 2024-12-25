import { Box, TextField } from "@mui/material";
import React from "react";
import { LabeledInputProps } from "./labeled-input.types";

export const LabeledInput = (props: LabeledInputProps) => {
  return (
    <Box display="flex" flexDirection="column" rowGap="4px" component="label">
      {props.title}
      <TextField {...props} />
    </Box>
  );
};
