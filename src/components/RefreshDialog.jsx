import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export default function RefreshDialog({ open, handleClose, handleRefresh, loading }) {
   return (
      <Dialog
         fullWidth
         maxWidth="xs"
         open={open}
         onClose={handleClose}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description"
      >
         <DialogTitle>Refresh</DialogTitle>
         <DialogContent>
            <DialogContentText>Are you sure want to refresh this data?</DialogContentText>
         </DialogContent>
         <DialogActions>
            <Button variant="text" onClick={handleClose}>
               Cancel
            </Button>
            <LoadingButton loading={loading} variant="text" color="secondary" onClick={handleRefresh} autoFocus>
               Refresh
            </LoadingButton>
         </DialogActions>
      </Dialog>
   );
}