// ** React Imports
import { useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// ** Icon Imports
import Icon from 'src/@core/components/icon';
import { handleError } from 'src/@core/coreHelper';
import { removeUser, updateUser } from 'src/services/usersServices';
import { IUser } from 'src/types/users';

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  user: IUser;
};

const UserSuspendDialog = (props: Props) => {
  // ** Props
  const { user, open, setOpen } = props;

  // ** States
  const [userInput, setUserInput] = useState<boolean>(false);
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClose = () => setOpen(false);

  const handleSecondDialogClose = () => setSecondDialogOpen(false);

  const handleConfirmation = async (value: boolean) => {
    try {
      setLoading(true);
      setUserInput(value);

      await removeUser(user.id);

      handleClose();

      setSecondDialogOpen(true);
      setLoading(false);
    } catch (e) {
      handleError(e);
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog fullWidth open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
        <DialogContent
          sx={{
            px: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: (theme) => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
          }}
        >
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              '& svg': { mb: 8, color: 'warning.main' },
            }}
          >
            <Icon icon='tabler:alert-circle' fontSize='5.5rem' />
            <Typography variant='h4' sx={{ mb: 5, color: 'text.secondary' }}>
              Are you sure?
            </Typography>
            <Typography>You won't be able to revert user!</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: (theme) => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleConfirmation(true)}>
            Yes, Suspend user!
          </Button>
          <Button variant='tonal' color='secondary' onClick={() => handleConfirmation(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        open={secondDialogOpen}
        onClose={handleSecondDialogClose}
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              '& svg': {
                mb: 14,
                color: userInput ? 'success.main' : 'error.main',
              },
            }}
          >
            <Icon fontSize='5.5rem' icon={userInput ? 'tabler:circle-check' : 'tabler:circle-x'} />
            <Typography variant='h4' sx={{ mb: 8 }}>
              {userInput ? 'Suspended!' : 'Cancelled'}
            </Typography>
            <Typography>{userInput ? 'User has been suspended.' : 'Cancelled Suspension :)'}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserSuspendDialog;
