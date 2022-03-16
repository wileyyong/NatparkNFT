/* eslint-disable import/no-unresolved */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, useMemo } from 'react';
import { useMoralisWeb3Api } from "react-moralis";
import { styled } from '@mui/material/styles';

import { ADMIN_WALLET } from 'src/config';
import NFTInfoCard from '../sections/NFTInfoCard';

const NFTInfoDiv = styled('div')(() => ({
  '&': {
    display: 'flex',
    gap: '20px',
  },
  '& .item': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '50%',
    borderRadius: '16px',
    backgroundColor: '#005249',
    color: '#FFFFFF',
    padding: '20px',
    marginBottom: '20px',
  }
}));

export default function NFTInfo({ user, address, items }) {
	const {
		token: { getNFTOwners },
	} = useMoralisWeb3Api();
	
	const [nfts, setNFTs] = useState([]);
	const [users, setUsers] = useState(0);
	const [total, setTotal] = useState(-1);
	const [loading, setLoading] = useState(false);
    
  useEffect(() => {
    fetchAll();
  }, [nfts, setNFTs]);

  useEffect(() => {
    if(!loading) {
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

      const uArr = (Object.keys(uObj) || [])
        .map(key => uObj[key])
        .sort((a, b) => b.count - a.count);
      setUsers(uArr);
    } else if(nfts.length === total) {
      setLoading(false);
    }
  }, [nfts, loading]);

  const collectedItems = useMemo(() => {
    let result = [];
    if (items.length > 0) {
      result = items.filter(item => item.owner_of === address);
    }
    return result;
  }, [items]);

  const collectedParks = useMemo(() => {
    const result = [];

    if (items.length > 0) {
      items.forEach(item => {
        if(item.data && item.data.attributes) {
          const trait = item.data.attributes.find(attr => attr.trait_type === 'Parks');
          if(trait) {
            result.push(trait.value);
          }
        }
      });
    }
    return result;
  }, [items]);

  const fetchAll = () => {
    const options = {
      address: ADMIN_WALLET,
      offset: nfts.length,
    };
    getNFTOwners(options).then((data) => {
      if(data?.result?.length) {
        setNFTs(prev => [
          ...prev, 
          ...data.result
        ]);
      }
      setTotal(data.total);
    });
  };

  return (
    <NFTInfoDiv>
      <NFTInfoCard
        logoText={user ? user.username : ''}
        address={address}
        firstTitle="Items Collected" 
        firstTotal={collectedItems.length}
        secondTitle="Parks Collected"
        secondTotal={collectedParks.length || 0} 
      />
      <NFTInfoCard
        logoText="NPNFT"
        address=""
        firstTitle="Items" 
        firstTotal={nfts.length}
        secondTitle="Owners"
        secondTotal={users.length || 0}
      />
    </NFTInfoDiv>
  )
}