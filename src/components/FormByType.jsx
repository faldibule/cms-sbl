import { FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

const FormByType = ({ v }) => {

    if(v.type === 'text-uncontrolled'){
        return (
            <Stack key={v.name}>
                <TextField 
                    name={v.name}
                    label={v.label}
                    defaultValue={v.defaultValue}
                    type={v.typeInput}
                    fullWidth
                />
            </Stack>
        ) 
    }
    if(v.type === 'select-uncontrolled'){
        return (
            <Stack>
                <TextField 
                    select
                    name={v.name}
                    label={v.label}
                    defaultValue={v.defaultValue}
                    fullWidth
                >
                    {v?.data.map((item, i) => {
                        return (
                            <MenuItem key={i} value={item.id}>{item.label}</MenuItem>
                        )
                    })}
                </TextField>
            </Stack>
        ) 
    }
    if(v.type === 'textarea-uncontrolled'){
        return (
            <Stack>
                <TextField 
                    name={v.name}
                    label={v.label}
                    defaultValue={v.defaultValue}
                    type={v.typeInput}
                    fullWidth
                    multiline
                    rows={3}
                />
            </Stack>
        )
    }
    if(v.type === 'radio-uncontrolled'){
        return (
            <Stack>
                <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">{v.label}</FormLabel>
                    <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name={v.name} defaultValue={v.defaultValue}>
                        <FormControlLabel value="1" control={<Radio />} label="Active" />
                        <FormControlLabel value="0" control={<Radio />} label="Not Active" />
                    </RadioGroup>
                </FormControl>
            </Stack>
        )
    }
    return `${v.type} not found`
   
}

export default FormByType