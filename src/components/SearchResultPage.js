import { forwardRef, useEffect } from 'react';

import Hovercard from 'hovercard';

import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import { Button, Link } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doStringFormatting, _getText, _getTextWithHighlights } from '../pages/Search';
import Iconify from './Iconify';

export default function SearchResultPage({}) {
  const displayETD = JSON.parse(localStorage.getItem('displayETD'));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterName = searchParams.get('search');

  const handleClose = () => {
    navigate(`/dashboard/search?search=${filterName}`);
  };
  const {
    author,
    title,
    text,
    university,
    year,
    pdf,
    etd_file_id: fileID,
    abstract,
    wikifier_terms: wikifierTerms,
  } = displayETD;

  useEffect(() => {
    const cards = new Hovercard({
      lang: 'en',
      getFetchEndpoint: (word) => {
        console.log({ word });
        return `https://en.wikipedia.org/api/rest_v1/page/summary/${word?.toLowerCase()}`;
      },
      getHeading: (result) => {
        console.log({ result });
        return result.title;
      },
      template: (wikiResult) => {
        return `<div class="hovercard-card ${wikiResult?.image ? 'hovercard-has-image' : ''}">
        <h3 class="hovercard-title"><span class="mw-page-title-main">${wikiResult?.heading}</span></h3>
        <a href="https://en.wikipedia.org/wiki/${wikiResult?.heading}">${wikiResult?.heading}</a>
    <p class="hovercard-description">${wikiResult?.body}</p>
    <div class="hovercard-image" style="background-image: url(${wikiResult?.image})"></div>
    </div>
      `;
      },
    });
  }, [displayETD]);

  return (
    <div>
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
            secondary={_getTextWithHighlights(text || abstract, '', wikifierTerms)}
            primaryTypographyProps={{
              variant: 'subtitle1',
            }}
            secondaryTypographyProps={{
              variant: 'subtitle1',
            }}
          />
        </ListItem>
      </List>
    </div>
  );
}
