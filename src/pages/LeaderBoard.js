/* eslint-disable import/no-unresolved */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMoralisWeb3Api } from "react-moralis";
import axios from 'axios';
import { ADMIN_WALLET } from 'src/config'; 
import {
	TableContainer, Table, TableHead, TableRow, 
	TableCell, TableBody, Paper, TablePagination, TableFooter,
	Link, CircularProgress, Box
} from '@mui/material';

export default function LeaderBoard() {
    const {
			token: { getNFTOwners },
    } = useMoralisWeb3Api();

    const [nfts, setNFTs] = useState([]);
    const [users, setUsers] = useState([]);
		const [page, setPage] = useState(0);
		const [rowsPerPage, setRowsPerPage] = useState(10);
		const [total, setTotal] = useState(0);
		const [loading, setLoading] = useState(false);

		useEffect(async() => {
			await fetchAll();
		}, [nfts, setNFTs]);

		useEffect(() => {
			users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(async(user) => {
				if (!user.parks) {
					const promises = user.nfts.map((item) => new Promise( resolve => {
						getRealData(item.token_address, item.token_id).then(value => {
							resolve({
								...item,
								data: value,
							});
						}).catch((e) => resolve(e));
					}));
					const list = await Promise.all(promises);
					const result = [];
					await list.forEach(item => {
						if(item.data && item.data.attributes) {
							const trait = item.data.attributes.find(attr => attr.trait_type === 'Parks');
							if(trait && !result.includes(trait.value)) {
								result.push(trait.value);
							}
						}
					});
					user.parks = result.length;
					setUsers([...users]);
				}
			});
		}, [page, users.length, rowsPerPage]);

		const handleChangePage = (event, newPage) => {
			setPage(newPage);
		};

		const handleChangeRowsPerPage = (event) => {
			setRowsPerPage(parseInt(event.target.value, 10));
			setPage(0);
		};

		const fetchAll = () => {
			const options = {
				address: ADMIN_WALLET,
				offset: nfts.length,
			};
			setLoading(true);
			getNFTOwners(options).then(async (data) => {
				if(data?.result?.length) {
					setNFTs(prev => [
						...prev, 
						...data.result
					]);
					setTotal(data.total);
				}
			});
		};

		const getRealData = async (address, tokenId) => {
			const { data } = await axios.get(`/contracts/${address}/${tokenId}`);
			return data;
		}

    useEffect(() => {
			const uObj = {};
			nfts.forEach(item => {
				if(uObj[item.owner_of]) {
					uObj[item.owner_of] = {
						...uObj[item.owner_of],
						items: uObj[item.owner_of].items + 1,
						nfts: [...uObj[item.owner_of].nfts, item]
					};
				} else {
					uObj[item.owner_of] = {
						address: item.owner_of,
						items: 1,
						nfts: [item]
					};
				}
			});
			if (nfts.length === total) {
				setUsers(
					Object.keys(uObj)
					.map(key => uObj[key])
					.sort((a, b) => b.items - a.items)
				);
				setLoading(false);
			}
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
								loading ? <TableRow>
										<TableCell component="th" scope="row" colSpan={4}>
											<Box display="flex" justifyContent='center' alignItems='center' height="50vh">
												<CircularProgress color="success" />
											</Box>
										</TableCell>
									</TableRow> : <>
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
												<TableCell>{row.items}</TableCell>
												<TableCell>{row.parks || <CircularProgress size={20} color="success" />}</TableCell>
											</TableRow>
									))}
								</>
							}
						</TableBody>
						<TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={4}
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