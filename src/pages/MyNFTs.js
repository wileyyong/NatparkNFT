import React, { useEffect, useState } from 'react';
import { useNFTBalances, useChain } from "react-moralis";
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import Page from '../components/Page';

const NFTDiv = styled('div')(({ theme }) => ({
  display: 'grid',
	gap: '20px',
	gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
}));

const NFTInfo = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	width: '50%',
	borderRadius: '16px',
	backgroundColor: '#005249',
	color: '#FFFFFF',
	padding: '20px',
	marginBottom: '20px'
}));

function MyNFTs() {
	const { getNFTBalances, data, error, isLoading, isFetching } = useNFTBalances();
	const { chainId } = useChain();

	const [nfts, setNFTs] = useState([]);

	useEffect(() => {
		getNFTBalances({ params: { chain: chainId || "0x4" }}).then(({result}) => {
			setNFTs(
				result
				.map(item => ({
					...item, 
					metadata: JSON.parse(item.metadata)
				})))
				.filter(item => item.metadata);
		});
	}, []);

	return (
		<Page title="Connect">
			<NFTInfo>
				<div>
					<div>Collected</div>
					<div>{ nfts.length }</div>
				</div>
			</NFTInfo>
			{
				nfts.length > 0 ? (
					<NFTDiv>
						{
							nfts.filter(item => item.metadata).map((item) => (
								<Card sx={{ maxWidth: 345 }}>
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
		</Page>
	);
}

export default MyNFTs;