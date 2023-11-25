import { Address } from '../entities/address.entity';
import { Exchange } from '../entities/exchange.entity';
import { AppDataSource } from '../index';
import { Request, Response } from 'express';
import axios from 'axios';
import { Txn } from '../entities/txns.entity';

class AddressController {
  getAllAddresses = async (req: Request, res: Response) => {
    let allAddresses;
    try {
      allAddresses = await AppDataSource.getRepository(Address)
        .createQueryBuilder('addresses')
        .leftJoinAndSelect('addresses.exchange', 'exchange')
        .getMany();
    } catch (error) {
      console.error(error);
    }
    return res.send(allAddresses);
  };

  createAddress = async (address: string, exchangeId: string) => {
    // const { address, exchangeId } = req.body;
    const exchangeInfo = await this.exchangeAddressCount(exchangeId);
    if (exchangeInfo === undefined) {
      // return res.status(400).send('Exchange not found');
      return;
    }
    const exchangeName = exchangeInfo.exchangeName;
    const addressCount = exchangeInfo.addressCount;
    // console.log(addressCount);

    let exchange;
    try {
      exchange = await AppDataSource.getRepository(Exchange).findOneOrFail({
        where: {
          id: exchangeId,
        },
      });
    } catch (error) {
      console.error(error);
      return;
    }
    try {
      const newAddress = AppDataSource.getRepository(Address).create();
      newAddress.address = address;
      newAddress.exchange = exchange;
      newAddress.alias = exchangeName + addressCount;
      await AppDataSource.getRepository(Address).save(newAddress);
      return;
    } catch (error) {
      // console.error(error);
      return;
    }
  };

  getAddressBalance = async () => {
    // const address = '37xpfzwJyhNiJ47Y7ty7MKDKaxQLULkC2G';
    axios
      .get(
        'https://api.blockcypher.com/v1/btc/main/addrs/bc1q4wy2ngvmqwvj6666v806vzq6mhvpxh5jxylxcz/balance',
      )
      .then((response) => console.log(response.data));
  };
  // res.status(200).send(response);

  exchangeAddressCount = async (exchangeId: string) => {
    // const exchangeId = "3cbc345e-3971-40ac-8782-78b646d49d04"
    let result;
    try {
      result = await AppDataSource.getRepository(Exchange)
        .createQueryBuilder('exchange')
        .leftJoin('exchange.addresses', 'addresses') // Assuming the relation name is 'addresses'
        .select('exchange.name', 'exchangeName') // Replace 'columnName' with the actual column name you're interested in
        .addSelect('COUNT(addresses.id)', 'addressCount') // Count of addresses
        .where('exchange.id = :exchangeId', { exchangeId })
        .groupBy('exchange.id') // Group by to use aggregate function
        .cache(false)
        .getRawOne(); // Use getRawOne() since you're expecting only one result
      // console.log(result);
    } catch (error) {
      console.error(error);
    }
    console.log(result);

    return result;
  };

  saveAllAddresses = async () => {
    let allExchanges;
    try {
      allExchanges = await AppDataSource.getRepository(Exchange)
        .createQueryBuilder('exchange')
        .select('exchange.address', 'address')
        .addSelect('exchange.id', 'exchangeId')
        .getRawMany();
    } catch (error) {
      console.error(error);
    }
    console.log(allExchanges);
    if (allExchanges === undefined) {
      return;
    }

    for (const exchange of allExchanges) {
      console.log(exchange);
      const exchangeId = exchange.exchangeId;
      const exchangeAddress = exchange.address;
      let unsavedAddresses;
      try {
        unsavedAddresses = await AppDataSource.getRepository(Txn)
          .createQueryBuilder('txn')
          .select('txn.from', 'address')
          .where('txn.to = :exchangeAddress', { exchangeAddress })
          .getRawMany();
      } catch (error) {
        console.error(error);
      }
      // console.log('NEW EXCHANGE!!!!!!!', exchangeAddress);
      if(unsavedAddresses){
      for (const address of unsavedAddresses) {
        // console.log('saving', address.address, exchangeId);
        await this.createAddress(address.address, exchangeId);
      };} 
    } 
  };
}

export const addressController = new AddressController();
