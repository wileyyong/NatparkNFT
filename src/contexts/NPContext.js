/* eslint-disable import/no-unresolved */
/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import { useMoralisWeb3Api } from "react-moralis";
import { ADMIN_WALLET } from 'src/config';

// ----------------------------------------------------------------------

const initialState = {
  nfts: [],
  users: [],
  fetch: () => {},
};

const NPContext = createContext(initialState);

// ----------------------------------------------------------------------

NPProvider.propTypes = {
  children: PropTypes.node,
};

function NPProvider({ children }) {
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

  // const refresh = () => {
  //   setTotal(0);
  //   setNFTs([]);
  //   setLoading(true);
  // }

  return (
    <NPContext.Provider
      value={{
        nfts,
        users,
        fetchAll,
      }}
    >
      {children}
    </NPContext.Provider>
  );
}

export { NPProvider, NPContext };
