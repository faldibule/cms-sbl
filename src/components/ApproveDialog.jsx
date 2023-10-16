import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export default function ApproveDialog({ open, handleClose, handleApprove, loading }) {
   return (
      <Dialog
         fullWidth
         maxWidth="xs"
         open={open}
         onClose={handleClose}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description"
      >
         <DialogTitle>Update Status</DialogTitle>
         <DialogContent>
            <DialogContentText>Are you sure want to update status?</DialogContentText>
         </DialogContent>
         <DialogActions>
            <Button variant="text" onClick={handleClose}>
               Cancel
            </Button>
            <LoadingButton loading={loading} variant="text" color="success" onClick={handleApprove} autoFocus>
               Yes
            </LoadingButton>
         </DialogActions>
      </Dialog>
   );
}