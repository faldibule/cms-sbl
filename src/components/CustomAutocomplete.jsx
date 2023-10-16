import { Autocomplete, TextField } from "@mui/material";

const CustomAutocomplete = ({ label, errors, options, getOptionLabel, selectedValue, inputValue, setInputValue, setSelectedValue, size = "medium", isAutoCompleteItem = false }) => {
    return (
        <Autocomplete
            fullWidth
            freeSolo
            options={options}
            getOptionLabel={getOptionLabel}
            value={selectedValue || null} 
            inputValue={inputValue}
            onInputChange={(e, value, reason) => {
                if(isAutoCompleteItem){
                    setInputValue(reason === 'reset' ? '' : value)
                }else{
                    setInputValue(value)
                }
            }}
            onChange={(event, newValue) => {
                setSelectedValue(newValue);
            }}
            renderInput={(params) => (
                <TextField 
                    {...params} 
                    size={size}
                    required={!isAutoCompleteItem}
                    fullWidth
                    label={label}
                    error={!!errors}
                    helperText={!!errors && errors[0]}
                />
            )}
        />
    )
}

export default CustomAutocomplete