import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import React from 'react'
import Iconify from './Iconify';

const CustomMenuComponent = ({ anchorEl, open, handleMenu, actionDelete = true, actionEdit = true, handleEdit = () => {}, handleModalDelete = () => {} }) => {
    
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenu}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
            {actionEdit ? (
                <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                        <Iconify icon='material-symbols:edit' sx={{ color: 'green' }} />
                    </ListItemIcon>
                    Edit
                </MenuItem>
            ) : null}
            {actionDelete ? (
                <MenuItem onClick={handleModalDelete}>
                    <ListItemIcon>
                        <Iconify icon='material-symbols:delete' sx={{ color: 'red' }} />
                    </ListItemIcon>
                    Delete
                </MenuItem>
            ) : null}
        </Menu>
    );
}

export default CustomMenuComponent