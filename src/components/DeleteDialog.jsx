import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export default function DeleteDialog({ open, handleClose, handleDelete, loading }) {
   return (
      <Dialog
         fullWidth
         maxWidth="xs"
         open={open}
         onClose={handleClose}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description"
      >
         <DialogTitle>Delete</DialogTitle>
         <DialogContent>
            <DialogContentText>Are you sure want to delete this data?</DialogContentText>
         </DialogContent>
         <DialogActions>
            <Button variant="text" onClick={handleClose}>
               Cancel
            </Button>
            <LoadingButton loading={loading} variant="text" color="error" onClick={handleDelete} autoFocus>
               Delete
            </LoadingButton>
         </DialogActions>
      </Dialog>
   );
}