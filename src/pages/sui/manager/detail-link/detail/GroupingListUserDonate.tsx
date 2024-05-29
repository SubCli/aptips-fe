// @mui
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  Stack,
  Avatar,
  Box,
  Typography,
  styled,
} from '@mui/material';
// hooks
import useTable from '../../../../../hooks/useTable';
// components
import Scrollbar from '../../../../../components/Scrollbar';
import Label from 'src/components/Label';
import Iconify from 'src/components/Iconify';
import { useContext, useEffect, useMemo, useState } from 'react';
import LinksServices from 'src/services/LinksServices';

import EmptyData from 'src/components/EmptyData';
import MyAvatar from 'src/components/MyAvatar';
import createAvatar from 'src/utils/createAvatar';
import { LinkDonateContext } from 'src/contexts/ManagerLinkProvider';
import { UserLinkDonateModel } from 'src/@types/link-donation';


// ----------------------------------------------------------------------

const EmptyDataContainerStyle = styled(Stack)(({ theme }) => ({
  left: 0,
  top: 0,
  zIndex: 10,
  position: 'absolute',
  width: '100%',
  height: '100%',
  paddingY: theme.spacing(5)
}));

interface Column {
  id: 'id' | 'name' | 'amount' | 'note' | 'timeStamp' | 'sourceId';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'right' | 'left';
  format?: (value: number) => string;
}

const COLUMNS: Column[] = [
  { id: 'id', label: 'NO.', minWidth: 10, },
  { id: 'name', label: 'Name', minWidth: 100},
  {
    id: 'amount',
    label: 'Amount',
    minWidth: 100,
    align: "left",
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'note',
    label: 'Note',
    minWidth: 100,
    align: "left",
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'timeStamp',
    label: 'Time stamp',
    minWidth: 100,
    align: "left",
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'sourceId',
    label: 'Source',
    minWidth: 100,
    align: "left",
    format: (value) => value.toLocaleString('en-US'),
  },
];

// ----------------------------------------------------------------------

export default function GroupingListUserDonate() {

  const {
    listUserDonate,
    setListUserDonates,
  } = useContext(LinkDonateContext);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const avataURl = (user?: any) =>
  {
    const template = (
      <Avatar
        src={user?.photoURL || ''}
        alt={user?.userAddr}
        color={user?.photoURL ? 'default' : createAvatar(user?.ephemeralPrivateKey || user?.userAddr || '').color}
      >
        {createAvatar(user?.ephemeralPrivateKey || user?.userAddr || '').name}
      </Avatar>
    )
    return template;
  }

  const listUserTable = useMemo(() =>
  {
      if (listUserDonate?.length > 0)
      {
          const temp =  (rowsPerPage > 0  ? listUserDonate.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage): listUserDonate).map((row: UserLinkDonateModel) =>
          {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.sourceId}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                          {avataURl} <Label sx={{ ml: 1 }}>{row.name} </Label>
                      </Stack>
                    </TableCell>
                    <TableCell align="justify">
                        <Label color='info'>
                          {row.amount} $
                        </Label>
                    </TableCell>
                    <TableCell><Label color='default'>
                          {row.note}
                        </Label>
                    </TableCell>
                    <TableCell>{row.timeStamp}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Label 
                          sx={{ ml: 1, minWidth: 70 }}
                          color={
                            (row.sourceId === 0 && 'warning') ||
                            (row.sourceId === 1 && 'success') ||
                            'info'
                          }
                        >{row.sourceId}</Label>
                      </Stack>
                    </TableCell>
                </TableRow>
            );
          })

          return temp;
      }
      else
      {
        const temp = (
          <Box sx={{ height: 300 }}>
              <EmptyDataContainerStyle justifyContent={'center'} alignContent={'center'} alignItems={"center"}>
                  <Box className={'background'} sx={{ opacity: 0.7, background: (theme) => theme.palette.background.default }} width={'100%'} height={'100%'}></Box>
                  <Stack sx={{ position: 'absolute' }} justifyContent={'center'} alignContent={'center'} alignItems={"center"} spacing={2}>
                      <Typography variant="h5">No user donate </Typography>
                  </Stack>
              </EmptyDataContainerStyle>
          </Box>
            // <EmptyData  />
        )

        return temp;
      };
  }, [listUserDonate]);

  useEffect(() =>
  {
  }, []);

  return (
    <>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800, maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead sx={{ mb: 20 }}>
              <TableRow>
                {COLUMNS.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
                {listUserTable}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={listUserDonate.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
