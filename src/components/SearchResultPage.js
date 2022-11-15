import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import { Button, Link } from '@mui/material';
import { doStringFormatting } from '../pages/Search';
import Iconify from './Iconify';

// eslint-disable-next-line react/display-name
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function SearchResultPage({ open, handleClose, displayETD }) {
  const { author, title, text, university, year, pdf, etd_file_id: fileID, abstract } = displayETD;
  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative', backgroundColor: 'transparent', boxShadow: 'none' }}>
          <Toolbar sx={{ paddingLeft: '10px !important' }}>
            <Button onClick={handleClose} variant="text" startIcon={<Iconify icon="eva:arrow-back-outline" />}>
              Back to Results
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem>
            <Typography variant="h5" noWrap>
              {title}
            </Typography>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Link to document"
              primaryTypographyProps={{
                variant: 'subtitle1',
              }}
              secondary={
                <Link href={pdf} download={fileID} target="_blank" variant="subtitle2" underline="hover" noWrap>
                  Download
                </Link>
              }
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Author(s)"
              secondary={author}
              secondaryTypographyProps={{
                variant: 'subtitle1',
              }}
              primaryTypographyProps={{
                variant: 'subtitle1',
              }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="University"
              secondary={university}
              secondaryTypographyProps={{
                variant: 'subtitle1',
              }}
              primaryTypographyProps={{
                variant: 'subtitle1',
              }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Year Issued"
              secondary={year}
              secondaryTypographyProps={{
                variant: 'subtitle1',
              }}
              primaryTypographyProps={{
                variant: 'subtitle1',
              }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Abstract"
              secondary={doStringFormatting(text || abstract)}
              primaryTypographyProps={{
                variant: 'subtitle1',
              }}
              secondaryTypographyProps={{
                variant: 'subtitle1',
              }}
            />
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
}
