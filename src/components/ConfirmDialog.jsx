import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Iconify from "./Iconify";

export default function ConfirmDialog({ open, handleClose, title, handleClick }) {
   return (
      <Dialog
         fullWidth
         maxWidth="xs"
         open={open}
         onClose={handleClose}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description"
      >
         <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}> 
            <Iconify icon='emojione-v1:warning' /> Confirm
        </DialogTitle>
         <DialogContent>
            <DialogContentText>Are you sure want to {title} this data?</DialogContentText>
         </DialogContent>
         <DialogActions>
            <Button variant="text" color="error" onClick={handleClose}>
               Cancel
            </Button>
            <LoadingButton variant="text" color="primary" onClick={handleClick} autoFocus>
               Yes
            </LoadingButton>
         </DialogActions>
      </Dialog>
   );
}