import React, { useEffect, useState, useMemo, useContext } from 'react';
import { useNFTBalances, useMoralisWeb3Api } from "react-moralis";
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import NFTInfo from '../components/NFTInfo';
import useAuth from '../hooks/useAuth';

const NFTDiv = styled('div')(({ theme }) => ({
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
			})).filter(item => item.metadata);
			setNFTs(data);
		});
	}, []);


	return (
		<div >
			<NFTInfo address={user.ethAddress} />
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