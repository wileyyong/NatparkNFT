/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useNFTBalances } from "react-moralis";
import { Card, CardContent, CardMedia, Typography, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import NFTInfo from '../components/NFTInfo';
import { ADMIN_WALLET } from '../config';

const NFTDiv = styled('div')(() => ({
  display: 'grid',
	gap: '20px',
	gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
}));

function MyNFTs() {
	const { getNFTBalances } = useNFTBalances();
	const routeParams = useParams();

	const [nfts, setNFTs] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const params = {
			address: routeParams.id,
		};
		getNFTBalances({params}).then(async ({result}) => {
			const promises = result.filter(item => item.metadata).filter(item => item.token_address === ADMIN_WALLET).map((item) => new Promise( resolve => {
				getRealData(item.token_address, item.token_id).then(value => {
					resolve({
						...item,
						metadata: JSON.parse(item.metadata),
						data: value,
					});
				}).catch((e) => resolve(e));
			}));
			setLoading(true);
			const data = await Promise.all(promises);
			setNFTs(data);
			setLoading(false);
		});
	}, [routeParams.id]);

	const getRealData = async (address, tokenId) => {
		const { data } = await axios.get(`/contracts/${address}/${tokenId}`);
		return data;
	}

	return (
		<div>
			<Box mb={2}>
				<NFTInfo address={routeParams.id} items={nfts} />
			</Box>
			{
				loading ? <Box display="flex" justifyContent='center' alignItems='center' height="50vh"><CircularProgress color="success" /></Box> : <>
					{
						nfts.length > 0 ? (
							<NFTDiv>
								{
									nfts.map((item, index) => (
										<Card key={index}>
											<CardMedia
												component="img"
												alt="green iguana"
												height="350"
												image={(item.data && item.data.image) || item.metadata.image}
											/>
											<CardContent>
												<Typography gutterBottom variant="h5" component="div">
													{ item.data.name || item.metadata.description }
												</Typography>
												<Typography variant="body2" color="text.secondary">
													{ item.data.description || item.metadata.description }
												</Typography>
											</CardContent>
										</Card>
									))
								}
							</NFTDiv>
						) : !loading && <Typography variant='h5' textAlign='center'>No NFTs</Typography>
					}
				</>
			}
		</div>
	);
}

export default MyNFTs;