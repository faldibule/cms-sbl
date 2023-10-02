import { IconButton, InputAdornment, TextField } from '@mui/material';
import React from 'react'
import Iconify from './Iconify';

const CustomSearchComponent = ({ search = "", setParams = () => {}, params = {} }) => {
  return (
        <TextField
            name="search"
            variant="outlined"
            label="Search"
            autoComplete="off"
            onChange={(e) => setParams({ ...params, search: e.target.value }) }
            value={search}
            fullWidth
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Iconify icon='mdi:search' />
                    </InputAdornment>
                ),
                endAdornment: search !== "" && (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setParams({ ...params, search: "" })}>
                            <Iconify icon='mdi:search' />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
  )
}

export default CustomSearchComponent;