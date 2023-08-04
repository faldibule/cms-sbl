import { Typography } from '@mui/material';
import React from 'react'

const CustomStatusLabelComponent = ({ bgcolor = 'green', color = 'white', title = 'default' }) => {
  return (
      <Typography
          sx={{
              bgcolor,
              color,
              px: 1,
              borderRadius: 1,
          }}
      >
          {title}
      </Typography>
  );
}

export default CustomStatusLabelComponent