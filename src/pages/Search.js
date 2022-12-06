/* eslint-disable prefer-regex-literals */
import { debounce } from 'lodash';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import * as filterXSS from 'xss';

// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Link,
} from '@mui/material';
// components

import { Box } from '@mui/system';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListToolbar } from '../sections/@dashboard/user';

const textStyle = {
  maxWidth: '100%',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

export const _getText = (text, filterName, keyword) =>
  filterName ? _getTextWithHighlights(text, filterName, keyword) : text;

export const doStringFormatting = (str = '') => {
  const regex2 = new RegExp("\\[\\'", 'gi');
  const regex3 = /']/gi;
  const regex4 = /"]/gi;
  const regex5 = new RegExp('\\[\\"', 'gi');
  str = str.replace(regex2, '');
  str = str.replace(regex3, '');
  str = str.replace(regex4, '');
  str = str.replace(regex5, '');
  return str;
};

const markWikiStyling = (text, keyword) => {
  return keyword.reduce((sum, acc) => {
    const { term, url } = acc;
    const regex1 = new RegExp(term, 'gi');
    const sTerm = sum !== '' ? sum : text;
    sum = sTerm?.replace(regex1, `<a href="${url}" target="_blank"><span class="hovercard">$&</span></a>`);
    return sum;
  }, '');
};

export const _getTextWithHighlights = (text, searchText = '', keyword = []) => {
  let newText = text;
  if (searchText) {
    const regex1 = new RegExp(searchText, 'gi');
    newText = text?.replace(regex1, `<mark class="highlight">$&</mark>`);
  }

  newText = doStringFormatting(newText);

  newText = keyword.length > 0 ? markWikiStyling(newText, keyword) : newText;
  return <span dangerouslySetInnerHTML={{ __html: newText }} />;
};

export default function Search({ isLoggedIn , setIsLoggedIn }) {
  const [page, setPage] = useState(0);

  const [library, setLibrary] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [count, setCount] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  const searchQueryTerm = searchParams.get('search');

  const navigate = useNavigate();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const makeSearchAPI = async (searchVal) => {

    const value = filterXSS(searchVal, {
      whiteList: {},
      stripIgnoreTag: true,
    });
    try {
      const result = await axios.get(
        `http://localhost:3001/api/search?search=${value}&key=${localStorage.getItem('uuidv4')}`
      );
      setSearchParams({ search: value });

      console.log({ result });

      setLibrary(result?.data.results);

      setCount(result?.data.count);
    } catch (error) {
      console.error({ error });
    }
  };

  const debouncedChangeHandler = useCallback(debounce(makeSearchAPI, 300), []);

  const handleFilterByName = (event) => {
    setSearchPressed(false);

    setFilterName(event.target.value);

    // debouncedChangeHandler(event.target.value);
  };

  const handleSearchPress = () => {
    makeSearchAPI(filterName);
    setSearchPressed(true);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - library.length) : 0;
  const isUserNotFound = library.length === 0;

  const [searchPressed, setSearchPressed] = useState(false);

  const [displayETD, setDisplayETD] = useState({});

  const handleClickOpen = (rowItem) => {
    if (rowItem) {
      localStorage.setItem('displayETD', JSON.stringify(rowItem?._source));

      setDisplayETD(rowItem?._source);

      navigate(`/summary?search=${filterName}`);
    }
  };

  useEffect(() => {
    if (searchQueryTerm) {
      setSearchPressed(true);
      makeSearchAPI(searchQueryTerm);
      setFilterName(searchQueryTerm);
    }
  }, [searchQueryTerm]);

  return (
    <Container maxWidth="xl" sx={{ margin: 0 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Search for Electronic Thesis And Disertation (ETDs)
        </Typography>
      </Stack>

      <Card>
        <UserListToolbar
          filterName={filterName}
          handleSearchPress={handleSearchPress}
          onFilterName={handleFilterByName}
          isLoggedIn={isLoggedIn}
        />
        {searchPressed && count && count >= 1 ? (
          <>
            <Box
              sx={{
                ml: 4,
                fontSize: '18px',
                fontStyle: 'italic',
              }}
            >
              Showing result for :-{' '}
              <em>
                <strong>
                  {filterXSS(filterName, {
                    whiteList: {},
                    stripIgnoreTag: true,
                  })}
                </strong>
              </em>
            </Box>

            <Box
              sx={{
                ml: 4,
                fontSize: '18px',
              }}
            >
              Number of results :- <strong>{count}</strong>
            </Box>
          </>
        ) : (
          ''
        )}
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <TableBody>
                {library.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const {
                    _id,
                    _source: { author, title, text, university, year },
                  } = row;

                  return (
                    <TableRow hover key={_id} tabIndex={-1}>
                      <TableCell colSpan={6}>
                        <Stack direction="column" alignItems="flex-start" ml={2} spacing={2}>
                          <Link underline="hover" onClick={() => handleClickOpen(row)} sx={{ cursor: 'pointer' }}>
                            <Typography variant="h5" noWrap>
                              {_getText(title, filterName)}
                            </Typography>
                          </Link>
                          <Box display="flex">
                            <Typography variant="subtitle2" noWrap mr={2}>
                              Author(s):
                            </Typography>
                            <Typography variant="body2" noWrap>
                              {author}
                            </Typography>
                          </Box>
                          <Box
                            display="flex"
                            sx={{
                              marginTop: '0 !important',
                            }}
                          >
                            <Typography variant="subtitle2" noWrap mr={2}>
                              University:
                            </Typography>
                            <Typography variant="body2" noWrap>
                              {university}
                            </Typography>
                          </Box>
                          <Box
                            display="flex"
                            sx={{
                              marginTop: '0 !important',
                            }}
                          >
                            <Typography variant="subtitle2" noWrap mr={2}>
                              Year:
                            </Typography>
                            <Typography variant="body2" noWrap>
                              {year}
                            </Typography>
                          </Box>

                          <AbstractSection filterName={filterName} text={text} />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>

              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[25, 50, 75]}
          component="div"
          count={library.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* <SearchResultPage open={open} handleClose={handleClose} displayETD={displayETD} /> */}
    </Container>
  );
}

const AbstractSection = ({ text, filterName }) => {
  const [fullAbstract, setFullAbstract] = useState(false);

  const showMore = () => {
    setFullAbstract(!fullAbstract);
  };

  return (
    <>
      <Typography variant="body2" flexWrap sx={fullAbstract ? {} : textStyle}>
        {_getText(text, filterName)}
      </Typography>
      <Link underline="hover" onClick={showMore} sx={{ cursor: 'pointer' }}>
        {fullAbstract ? 'Show less' : 'Show more'}
      </Link>
    </>
  );
};
