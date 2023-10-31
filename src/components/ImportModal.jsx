import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Iconify from "./Iconify";
import useImport from "@hooks/import/useImport";

const ErrorModal = (props) => {
   return (
      <Dialog
         fullWidth
         maxWidth="md"
         open={props.open}
         onClose={props.handleClose}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description"
      >
         <DialogTitle>Error Import</DialogTitle>
         <DialogContent>
            <Stack>
               {props.data?.map((v, i) => {
                  return (
                     <Typography fontWeight='bold' color='red' key={i} py={2} fontStyle="italic">{`${i +1}. ${v}`}</Typography>
                  )
               })}
            </Stack>
         </DialogContent>
         <DialogActions>
            <Button variant="text" onClick={props.handleClose}>
               Ok
            </Button>
         </DialogActions>
      </Dialog>
   )
}

const ImportModal = ({ open, handleClose, url, title, refreshData = () => {}, onSuccessImport = () => {} }) => {
    const [openModalError, setOpenModalError] = useState(false);
    const [dataError, setDataError] = useState([]);
    const [document, setDocument] = useState({
        file: "",
        file_url: "",
    });
    const { mutate: upload, isLoading: loadingImport, error } = useImport({
        onSuccess: (res) => {
            setDocument({
                file: "",
                file_url: "",
            })
            handleClose()
            refreshData()
            onSuccessImport(res)
        },
        onError: (err) => {
            if (err.response) {
                if (
                    err.response.status == 422
                ) {
                    setDocument({
                        file: "",
                        file_url: "",
                    });
                    setOpenModalError(true);
                    setDataError([...err.response.data.errors]);
                } else {
                    setDocument({
                        file: "",
                        file_url: "",
                    });
                    handleClose();
                }
            }
        }
    });

    const onSubmit = () => {
        const formData = new FormData();
        formData.append("file", document.file);
        upload({ 
            formData,
            url,
            title
         })
    };

    const handleErrorModalClose = () => {
        setOpenModalError(!openModalError)
    }

    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle>Import</DialogTitle>
            <DialogContent>
                {document.file_url !== "" ? (
                    <TextField
                        sx={{ mt: 1 }}
                        variant="outlined"
                        label="Document *"
                        value={document.file_url}
                        disabled
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="uil:import" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="Delete">
                                        <IconButton
                                            onClick={() =>
                                                setDocument({
                                                    file: "",
                                                    file_url: "",
                                                })
                                            }
                                        >
                                            <Iconify
                                                icon="material-symbols:delete"
                                                sx={{
                                                    color: "red",
                                                    fontSize: 23,
                                                }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                        fullWidth
                    />
                ) : (
                    <Button
                        size="large"
                        variant="outlined"
                        component="label"
                        fullWidth
                        startIcon={<Iconify icon="uil:import" />}
                    >
                        Import {title}
                        <input
                            name="document"
                            type="file"
                            onChange={(e) => {
                                let file = e.target.files[0];
                                let file_url = file.name;
                                setDocument({
                                    file,
                                    file_url,
                                });
                            }}
                            hidden
                            required
                        />
                    </Button>
                )}
                <ErrorModal
                    data={dataError}
                    open={openModalError}
                    handleClose={handleErrorModalClose}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="text" onClick={handleClose}>
                    Cancel
                </Button>
                <LoadingButton
                    loading={loadingImport}
                    variant="text"
                    color="success"
                    onClick={onSubmit}
                    autoFocus
                >
                    Submit
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default ImportModal