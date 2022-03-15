/* eslint-disable import/no-unresolved */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNFTBalances } from "react-moralis";
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
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

	useEffect(() => {
		getNFTBalances().then(({result}) => {
			const data = result?.map(item => ({
				...item, 
				metadata: JSON.parse(item.metadata)
			}))
			.filter(item => item.metadata)
			.filter(item => item.token_address === ADMIN_WALLET);
			setNFTs(data);
		});
	}, []);


	return (
		<div >
			<Box mb={2}>
				<NFTInfo address={user.ethAddress} />
			</Box>
			{
				nfts.length > 0 ? (
					<NFTDiv>
						{
							nfts.filter(item => item.metadata).map((item, index) => (
								<Card key={index}>
									<CardMedia
										component="img"
										alt="green iguana"
										height="350"
										image={item.metadata.image}
									/>
									<CardContent>
										<Typography gutterBottom variant="h5" component="div">
											{ item.metadata.name }
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{ item.metadata.description }
										</Typography>
									</CardContent>
								</Card>
							))
						}
					</NFTDiv>
				) : <Typography variant='h5'>No NFTs</Typography>
			}
		</div>
	);
}

export default MyNFTs;