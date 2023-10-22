import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export default function UpdateStatusDialog({ open, handleClose, value, handleSubmit, handleReject, loading, handleUpdateStatusApproval, form, handleChange }) {
   const { status } = value

   const handleClick = () => {
      if(form.status === 'reject'){
         handleReject(form.note)
         return
      }
      if(form.status === 'submit'){
         handleSubmit()
         return
      }
      if(form.status === 'approve'){
         handleUpdateStatusApproval()
         return
      }
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
         <DialogTitle>Update Status</DialogTitle>
         <DialogContent>
            <Grid container spacing={3} mt={1}>
               <Grid item xs={12} md={12}>
                  <TextField 
                     fullWidth
                     required
                     label='Status'
                     name='status'
                     value={form.status}
                     onChange={handleChange}
                     select
                  >
                     {status === 'submit' ?
                        <MenuItem value='approve'>Approve</MenuItem>
                        :
                        <MenuItem value='submit'>Submit</MenuItem>
                     }
                     {status !== 'reject' && status !== 'draft' ?
                        <MenuItem value='reject'>Reject</MenuItem>
                     : null
                     }
                  </TextField>
               </Grid>
               {form.status === 'reject' ?
               <Grid item xs={12} md={12}>
                  <TextField 
                     fullWidth
                     label='Note'
                     name='note'
                     required
                     value={form.note}
                     onChange={handleChange}
                     multiline
                     rows={3}
                  />
               </Grid>
               : null}
            </Grid>
         </DialogContent>
         <DialogActions>
            <Button color="error" variant="text" onClick={handleClose}>
               Cancel
            </Button>
            <LoadingButton loading={loading} variant="text" onClick={handleClick}>
               Yes
            </LoadingButton>
         </DialogActions>
      </Dialog>
   );
}