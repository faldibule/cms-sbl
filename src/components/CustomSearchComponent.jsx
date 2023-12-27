import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import Iconify from './Iconify';

const CustomSearchComponent = ({ search = "", setParams = () => {}, params = {} }) => {
    const [text, setText] = useState('');
    const [value] = useDebounce(text, 500);
    useEffect(() => {
        let mounted = true
        if(mounted){
            setParams({
                ...params,
                search: value
            })
        }
        return () => mounted = false
    }, [value])
    return (
        <TextField
            name="search"
            variant="outlined"
            label="Search"
            autoComplete="off"
            onChange={(e) => setText(e.target.value)}
            value={text}
            fullWidth
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Iconify icon='mdi:search' />
                    </InputAdornment>
                ),
                endAdornment: text !== "" && (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setText('')}>
                            <Iconify icon='mdi:close' />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    )
}

export default CustomSearchComponent;