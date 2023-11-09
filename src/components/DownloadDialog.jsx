import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export default function DownloadDialog({ open, handleClose, handleDownload, loading }) {
   return (
      <Dialog
         fullWidth
         maxWidth="xs"
         open={open}
         onClose={handleClose}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description"
      >
         <DialogTitle>Download</DialogTitle>
         <DialogContent>
            <DialogContentText>Are you sure want to download this data?</DialogContentText>
         </DialogContent>
         <DialogActions>
            <Button variant="text" onClick={handleClose}>
               Cancel
            </Button>
            <LoadingButton loading={loading} variant="text" color="secondary" onClick={handleDownload} autoFocus>
               Download
            </LoadingButton>
         </DialogActions>
      </Dialog>
   );
}