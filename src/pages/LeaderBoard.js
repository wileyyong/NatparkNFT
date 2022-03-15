/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMoralisWeb3Api } from "react-moralis";
import { 
	TableContainer, Table, TableHead, TableRow, 
	TableCell, TableBody, Paper, TablePagination, TableFooter,
	Link,
} from '@mui/material';

export default function LeaderBoard() {
    const {
			token: { getNFTOwners },
    } = useMoralisWeb3Api();

    const [nfts, setNFTs] = useState([]);
    const [users, setUsers] = useState([]);
		const [page, setPage] = useState(0);
		const [rowsPerPage, setRowsPerPage] = useState(5);

		// const emptyRows =
		// 	page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

		const handleChangePage = (event, newPage) => {
			setPage(newPage);
		};

		const handleChangeRowsPerPage = (event) => {
			setRowsPerPage(parseInt(event.target.value, 10));
			setPage(0);
		};

    useEffect(() => {
			const options = {
				address: '0x64dc7f3624a1456a7ba52025fcfddf428fff92e0',
			};
			getNFTOwners(options).then((data) => {
				setNFTs(data.result);
			});
    }, []);

    useEffect(() => {
			const uObj = {};
			nfts.forEach(item => {
				if(uObj[item.owner_of]) {
					uObj[item.owner_of] = {
						...uObj[item.owner_of],
						count: uObj[item.owner_of].count + 1
					};
				} else {
					uObj[item.owner_of] = {
						address: item.owner_of,
						count: 1
					};
				}
			});
			setUsers(
				Object.keys(uObj)
				.map(key => uObj[key])
				.sort((a, b) => b.count - a.count)
			);
    }, [nfts]);

    return (
			<div>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Owner</TableCell>
								<TableCell>Address</TableCell>
								<TableCell>Items</TableCell>
								<TableCell>Parks</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								(rowsPerPage > 0
									? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									: users
								).map((row) => (
									<TableRow
										key={row.address}
										sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
									>
										<TableCell component="th" scope="row">
											<Link href={`/owners/${row.address}`}>{row.address}</Link>
										</TableCell>
										<TableCell>{row.address}</TableCell>
										<TableCell>{row.count}</TableCell>
										<TableCell>{row.count}</TableCell>
									</TableRow>
							))}
						</TableBody>
						<TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              // ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
					</Table>
				</TableContainer>
			</div>
    );
}