
import { useState, useEffect, useMemo } from 'react';
import { useMoralisWeb3Api } from "react-moralis";
import { styled } from '@mui/material/styles';

const NFTInfoDiv = styled('div')(({theme}) => ({
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

export default function NFTInfo({address}) {
	const {
		token: { getNFTOwners },
	} = useMoralisWeb3Api();
	
	const [nfts, setNFTs] = useState([]);
	const [users, setUsers] = useState([]);
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
      setUsers(
        Object.keys(uObj)
        .map(key => uObj[key])
        .sort((a, b) => b.count - a.count)
      );
    } else if(nfts.length === total) {
      setLoading(false);
    }
  }, [nfts, loading]);

  const collectedItems = useMemo(() => {
    let result = [];
    result = nfts.filter(item => item.owner_of === address);
    return result;
  }, [nfts]);

  const collectedParks = useMemo(() => {
    let result = [];
    result = nfts.filter(item => item.owner_of === '0x00');
    return result;
  }, [nfts]);

  const fetchAll = () => {
    const options = {
      address: '0x64dc7f3624a1456a7ba52025fcfddf428fff92e0',
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
      <div className={'item'}>
        <div>
          <div>{ collectedItems.length }</div>
          <div>Items Collected</div>
        </div>
        <div>
          <div>{ collectedParks.length }</div>
          <div>Parks Collected</div>
        </div>
      </div>
      <div className={'item'}>
        <div>
          NPNFT
        </div>
        <div>
          <div>{ nfts.length }</div>
          <div>Items</div>
        </div>
        <div>
          <div>{ users.length }</div>
          <div>Owners</div>
        </div>
      </div>
    </NFTInfoDiv>
  )
}