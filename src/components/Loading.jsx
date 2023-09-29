import React from "react";
import { Box, CircularProgress } from "@mui/material";

function Loading(props) {
   return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
         <CircularProgress />
      </Box>
   );
}

export default Loading;