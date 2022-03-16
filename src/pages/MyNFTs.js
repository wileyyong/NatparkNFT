/* eslint-disable consistent-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNFTBalances } from "react-moralis";
import { Card, CardContent, CardMedia, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { ADMIN_WALLET } from 'src/config';
import { styled } from '@mui/material/styles';

import NFTInfo from '../components/NFTInfo';
import useAuth from '../hooks/useAuth';

const NFTDiv = styled('div')(() => ({
  display: 'grid',
	gap: '20px',
	gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
}));

function MyNFTs() {
	const { getNFTBalances } = useNFTBalances();
  const { user } = useAuth();

	const [nfts, setNFTs] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getNFTBalances().then(async ({result}) => {
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
	}, []);

	const getRealData = async (address, tokenId) => {
		const { data } = await axios.get(`/contracts/${address}/${tokenId}`);
		return data;
	}

	const getParksName = (attributes) => {
		const park = attributes.find(attr => attr.trait_type === 'Parks');
		if (park && park.value) {
			return park.value;
		}
	}

	return (
		<div >
			<Box mb={2}>
				<NFTInfo address={user.ethAddress} items={nfts} />
			</Box>
			{
				loading ? <Box display="flex" justifyContent='center' alignItems='center' height="50vh"><CircularProgress color="success" /></Box> : <>
				{
					nfts.length > 0 ? (
						<NFTDiv style={{ paddingTop: 20, paddingBottom: 20 }}>
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
												{ item.data.name || item.metadata.name }
											</Typography>
											<Typography variant="body1" color="text.secondary">
												{ getParksName(item.data.attributes) }
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