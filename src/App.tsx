/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import axios from 'axios';
import Header from 'components/Header';
import Market from 'contracts/Market.json';
import { BigNumber, Contract, ethers, providers } from 'ethers';
import { Fragment, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Accessories from 'screens/Accessories';
import AddProduct from 'screens/AddProduct';
import Calls from 'screens/Calls';
import Home from 'screens/Home';
import Negotiation from 'screens/Negotiation';
import Orders from 'screens/Orders';
import Products from 'screens/Products';
import Profile from 'screens/Profile';
import Register from 'screens/Register';
import ReqNegotiation from 'screens/ReqNegotiation';
import Sales from 'screens/Sales';
import YourProducts from 'screens/YourProducts';
import { useMetamask } from 'use-metamask';

const contract = "0xbB8cd90b52a4FdAd0Ad9760b0686A407D043b68D";
const apiSecret = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkMDBlZmE5Ni1hNWRhLTQzNWEtOTU3NC00MWY5NDlhODIwZGIiLCJlbWFpbCI6InN1YnJhbWFueWFnOTExMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOGMwYzlhNjJiNjcwOTNiZDZlNTAiLCJzY29wZWRLZXlTZWNyZXQiOiJiNTViM2FlMjg0MGNhOGZmNjI3NmEyYjRlNWRjMjVkODkyMWUxZmJkNjE0ZDk1ZTM3NmVkNGVhODlmOTYxOTNkIiwiaWF0IjoxNzA0MzYyNzEwfQ.at_NdZ8I0K-X-6sn4ccROETDMcfxpfz5hPDtdoLlrWU';
const gatewayToken = '3-umrJt-rl8gsulwKSCWv2oKWCbAqBTnn6nwfUI5xqO8OVzc2OCX8svAgiTlG2fh';

function App() {
  const { connect, metaState } = useMetamask();
  const [userRegistered, setUserRegistered] = useState(false);
  const [isFarmer, setIsFarmer] = useState(false);
  const [myDetails, setMyDetails] = useState({});

  const web3 = metaState.web3 as providers.Web3Provider;
  const account = metaState.account[0];

  function connectWallet() {
    try {
      connect && connect(providers.Web3Provider);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    async function loadUser() {
      try {
        let data = await new Contract(contract, Market.abi, web3.getSigner())
          .functions
          .getMyDetails();

        setMyDetails(data[0]);
        if (data[0].userAddr !== "0x0000000000000000000000000000000000000000") {
          setUserRegistered(true);
          setIsFarmer(data[0].userType === 'Farmer');
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (metaState.isConnected && web3 && account) {
      loadUser();
    }
  }, [metaState.isConnected, web3, account, setUserRegistered]);

  const uploadToIPFS = async (uploadData: any) => {
    let data = await axios.request({
      method: 'POST',
      url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${apiSecret}`,
      },
      data: { pinataContent: uploadData }
    });
    return data.data;
  }

  const getFileFromIPFS = (hash: string) => {
    return `https://salmon-magnificent-minnow-10.mypinata.cloud/ipfs/${hash}?pinataGatewayToken=${gatewayToken}`
  }

  async function saveProduct(
    productName: string,
    productDescription: string,
    productCategory: string,
    productImage: string | null,
    productPrice: number,
    productMinQuantity: number,
    productMaxQuantity: number,
    productTotalQuantity: number,
  ) {
    let imageData = await axios.get(productImage as string, { responseType: 'blob' })

    const fileReader = new FileReader();
    fileReader.onloadend = async () => {
      const buffer = Buffer.from(fileReader.result as ArrayBuffer);
      const ipfsHash = await uploadToIPFS({
        image: buffer,
      });

      new Contract(contract, Market.abi, web3.getSigner())
        .functions
        .addProduct(
          productName,
          productDescription,
          productCategory,
          ipfsHash.IpfsHash,
          productPrice,
          productMinQuantity,
          productMaxQuantity,
          productTotalQuantity,
        );
    };
    fileReader.readAsArrayBuffer(imageData.data);
  }

  async function register(account: string, name: string, email: string, address: string, phone: string, userType: string): Promise<void> {
    try {
      await new Contract(contract, Market.abi, web3.getSigner())
        .functions
        .addUser(name, email, address, phone, userType);
    } catch (error) {
      console.log(error);
    }
  }

  async function getProducts(account: string): Promise<[]> {
    try {
      const products = await new Contract(contract, Market.abi, web3.getSigner())
        .functions
        .getProducts();

      return products[0];
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  async function getMyProducts(account: string): Promise<[]> {
    try {
      const products = await new Contract(contract, Market.abi, web3.getSigner())
        .functions
        .getMyProducts();

      return products[0];
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  async function purchaseProduct(
    account: string,
    productId: number,
    quantity: number,
    amount: number,
    accessoriesId1: number,
    accessoriesId2: number,
    accessoriesId3: number,
  ): Promise<void> {
    try {
      await new Contract(contract, Market.abi, web3.getSigner())
        .functions
        .purchaseProduct(BigNumber.from(productId), BigNumber.from(quantity), accessoriesId1, accessoriesId2, accessoriesId3, {
          value: ethers.utils.parseEther(amount.toString()).div(BigNumber.from(1000000000)).div(BigNumber.from(1000000000))
        });
    } catch (error) {
      console.log(error);
    }
  }

  async function getUser(account: string, user: string): Promise<any> {
    try {
      return await new Contract(contract, Market.abi, web3.getSigner())
        .functions
        .getUser(user);
    } catch (error) {
      console.log(error);
    }
  }

  async function getMySales(account: string): Promise<[]> {
    try {
      const sales = await new Contract(contract, Market.abi, web3.getSigner())
        .functions
        .getMySales();

      return sales[0];
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  async function getMyOrders(account: string): Promise<[]> {
    try {
      const orders = await new Contract(contract, Market.abi, web3.getSigner())
        .functions
        .getMyPurchases();

      return orders[0];
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  async function addNegotiation(account: string, productId: number, quantity: number, price: number): Promise<void> {
    try {
      await new Contract(contract, Market.abi, web3.getSigner())
        .functions
        .addNegotiation(BigNumber.from(productId), BigNumber.from(quantity), BigNumber.from(price));
    } catch (error) {
      console.log(error);
    }
  }

  async function getNegotiations(account: string): Promise<[]> {
    try {
      const negotiations = await new Contract(contract, Market.abi, web3.getSigner())
        .functions
        .getNegotiations();

      return negotiations[0];
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  async function acceptNegotiation(account: string, negotiationId: number): Promise<void> {
    try {
      await new Contract(contract, Market.abi, web3.getSigner())
        .functions
        .acceptNegotiation(BigNumber.from(negotiationId));
    } catch (error) {
      console.log(error);
    }
  }

  async function rejectNegotiation(account: string, negotiationId: number): Promise<void> {
    try {
      await new Contract(contract, Market.abi, web3.getSigner())
        .functions
        .rejectNegotiation(BigNumber.from(negotiationId));
    } catch (error) {
      console.log(error);
    }
  }

  async function addAccessories(account: string, accessoriesName: string, accessoriesPricePerKg: number): Promise<void> {
    try {
      await new Contract(contract, Market.abi, web3.getSigner())
        .functions
        .addAccessories(accessoriesName, accessoriesPricePerKg);
    } catch (error) {
      console.log(error);
    }
  }

  async function getAccessories(account: string): Promise<[]> {
    try {
      const accessories = await new Contract(contract, Market.abi, web3.getSigner())
        .functions
        .getAccessories();

      return accessories[0];
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  async function addCall(account: string, owner: string, roomId: string, description: string, dateTime: string): Promise<void> {
    try {
      await new Contract(contract, Market.abi, web3.getSigner())
        .functions
        .addCall(owner, roomId, description, dateTime);
    } catch (error) {
      console.log(error);
    }
  }

  async function getCalls(account: string): Promise<[]> {
    try {
      const calls = await new Contract(contract, Market.abi, web3.getSigner())
        .functions
        .getAllMyCalls();

      return calls[0];
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  async function getAllMyAccessoriesSales(account: string): Promise<[]> {
    try {
      const sales = await new Contract(contract, Market.abi, web3.getSigner())
        .functions
        .getAllMyAccessorySales();

      return sales[0];
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  return (
    <Fragment>
      <Header
        connect={connectWallet}
        isConnected={!(!metaState.isConnected || !web3 || !account)}
        userRegistered={userRegistered}
        farmer={isFarmer}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register
          account={account}
          onRegister={register}
        />} />
        <Route path="/products" element={<Products
          account={account}
          getProducts={getProducts}
          purchaseProduct={purchaseProduct}
          getUser={getUser}
          getFileFromIPFS={getFileFromIPFS}
          getAccessories={getAccessories}
          addNegotiation={addNegotiation}
          addCall={addCall}
        />} />
        <Route path="/myproducts" element={<YourProducts
          account={account}
          getMyProducts={getMyProducts}
          getFileFromIPFS={getFileFromIPFS}
        />} />
        <Route path="/negotiations" element={<Negotiation
          account={account}
          getNegotiations={getNegotiations}
          acceptNegotiation={acceptNegotiation}
          rejectNegotiation={rejectNegotiation}
          purchaseProduct={purchaseProduct}
          getUser={getUser}
        />} />
        <Route path="/addProduct" element={<AddProduct
          account={account}
          saveProduct={saveProduct}
        />} />
        <Route path="/sales" element={<Sales
          account={account}
          getUser={getUser}
          getSales={getMySales}
          getAccessories={getAccessories}
          getAccessoriesSales={getAllMyAccessoriesSales}
          getFileFromIPFS={getFileFromIPFS}
        />} />
        <Route path="/intermediaries" element={<Accessories
          account={account}
          getUser={getUser}
          getAccessories={getAccessories}
          addAccessories={addAccessories}
        />} />
        <Route path="/calls" element={<Calls
          account={account}
          getCalls={getCalls}
          getUser={getUser}
        />} />
        <Route path="/orders" element={<Orders
          account={account}
          getOrders={getMyOrders}
          getFileFromIPFS={getFileFromIPFS}
        />} />
        <Route path="/profile" element={<Profile
          account={account}
          getProfile={(account: string) => {
            if (Object.keys(myDetails).length === 0) {
              return {
                userName: '',
                userAddress: '',
                userEmail: '',
                userPhone: '',
              };
            }
            return {
              // @ts-ignore
              userName: myDetails.userName,
              // @ts-ignore
              userAddress: myDetails.userAddress,
              // @ts-ignore
              userEmail: myDetails.userEmail,
              // @ts-ignore
              userPhone: myDetails.userPhone,
            };
          }}
        />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </Fragment>
  );
}

export default App;
