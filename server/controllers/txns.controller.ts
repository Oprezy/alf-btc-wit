// import { Txn } from '../entities/txns.entity';
import { Hash } from '../entities/hash.entity';
import { Address } from '../entities/address.entity';
import { Exchange } from '../entities/exchange.entity';
import { AppDataSource } from '../index';
import { Request, Response } from 'express';
import axios from 'axios';
import { Txn } from '../entities/txns.entity';
import { log } from 'console';
// import { instanceToPlain } from 'class-transformer';

class TxnController {
  // // FRONTEND
  getTxn = async (req: Request, res: Response) => {
    const hash = req.body.hash;
    // console.log(hash);

    const outputTxns = await AppDataSource.getRepository(Txn)
      .createQueryBuilder('txn')
      .where({ hash: hash })
      .andWhere({ type: 'output' })
      .orderBy('txn.amount', 'DESC')
      .getRawMany();

    const inputTxns = await AppDataSource.getRepository(Txn)
      .createQueryBuilder('txn')
      .where({ hash: hash })
      .andWhere({ type: 'input' })
      .orderBy('txn.amount', 'DESC')
      .getRawMany();

    if (!outputTxns && !inputTxns) return;

    const addresses = await this.getAddresses();
    // console.log(addresses);
    console.log(inputTxns.length);

    if (!addresses) return;

    const attachedInputs = inputTxns.map((input) => {
      const addressFound = addresses.find(
        (address) => address.address_address === input.txn_address,
      );
      if (addressFound) {
        const alias = addressFound.address_alias;
        return { ...input, alias };
      } else {
        return { ...input, alias: 'unknown' };
      }
    });
    return res.send([attachedInputs, outputTxns]);
  };

  // helper - getTxn
  getAddresses = async () => {
    const addresses = await AppDataSource.getRepository(Address)
      .createQueryBuilder('address')
      .select(['address', 'alias'])
      .getRawMany();

    if (addresses) {
      return addresses;
    } else {
      return;
    }
  };

  getRecentTxns = async (req: Request, res: Response) => {
    const subQuery = AppDataSource.getRepository(Txn)
      .createQueryBuilder('txn')
      .select('MIN(txn.id)', 'id') // Assuming `id` is a unique, auto-increment column
      .where('txn.type = :type', { type: 'output' })
      .groupBy('txn.hash');

    const uniqueHashes = await AppDataSource.getRepository(Txn)
      .createQueryBuilder('txn')
      .where(`txn.id IN (${subQuery.getQuery()})`)
      .setParameters(subQuery.getParameters())
      .orderBy('txn.time', 'DESC')
      .take(50)
      .getMany();

    if (!uniqueHashes) {
      return res.send('No txns found');
    }

    const allExchanges = await this.getAllExchangesFull();
    if (!allExchanges) return;
    // console.log(allExchanges);

    const attachedExchange = uniqueHashes.map((hash) => {
      const exchangeAddress = hash.address;
      const exchange = allExchanges.find(
        (exchange) => exchange.address === exchangeAddress,
      );
      if (exchange) {
        // console.log(exchange.name);
        const exchangeName = exchange.name;
        return { ...hash, exchangeName };
      } else {
        return { ...hash, exchangeName: 'unknown' };
      }
    });

    return res.send(attachedExchange);
  };
 
  // get address input and output txns
  getAddressInputOutputTxns = async (req: Request, res: Response) => {
    const address = req.body.address;
    console.log(address);

    const outputTxns = await AppDataSource.getRepository(Txn)
      .createQueryBuilder('txn')
      .where({ address: address })
      .andWhere({ type: 'output' })
      .orderBy('txn.unixTimestamp', 'DESC')
      .getRawMany();

    const inputTxns = await AppDataSource.getRepository(Txn)
      .createQueryBuilder('txn')
      .where({ address: address })
      .andWhere({ type: 'input' })
      .orderBy('txn.unixTimestamp', 'DESC')
      .getRawMany();

    if (!outputTxns && !inputTxns) return;

    return res.send([inputTxns, outputTxns]);
  };

  getGroupedAddressTxns = async (req: Request, res: Response) => {
    const address = req.body.address;
    // console.log('address', req.body);

    const outputTxns = await AppDataSource.getRepository(Txn)
      .createQueryBuilder('txn')
      .where({ address: address })
      .andWhere({ type: 'output' })
      .select(
        'txn.hash, SUM(txn.amount) as txn_amount, MAX(txn.unixTimestamp) as latest_timestamp',
      )
      .groupBy('txn.hash')
      .orderBy('latest_timestamp', 'DESC')
      .getRawMany();

    // console.log(outputTxns);

    const inputTxns = await AppDataSource.getRepository(Txn)
      .createQueryBuilder('txn')
      .where({ address: address })
      .andWhere({ type: 'input' })
      .select(
        'txn.hash, SUM(txn.amount) as txn_amount, MAX(txn.unixTimestamp) as latest_timestamp',
      )
      .groupBy('txn.hash')
      .orderBy('latest_timestamp', 'DESC')
      .getRawMany();

    if (!outputTxns && !inputTxns) return;

    return res.send([inputTxns, outputTxns]);
  };

  // getExchangeStats

  getExchangeStats = async (req: Request, res: Response) => {
    // const exchangeName = req.body.exchangeName;
    // console.log(exchangeName);

    // const exchange = await AppDataSource.getRepository(Exchange)
    //   .createQueryBuilder('exchange')
    //   .where({ name: exchangeName })
    //   .getOne();

    // if (!exchange) return;

    const exchanges = await AppDataSource.getRepository(Exchange)
      .createQueryBuilder('exchange')
      .leftJoinAndSelect('exchange.addresses', 'addresses')
      .getMany();

    if (!exchanges) return;

    const exchangeStats = [];

    for (const exchange of exchanges) {
      const addressCount = exchange.addresses.length;
      const exchangeAddressesInfo = exchange.addresses.map(async (address) => {
        const exchangeAddress = address.address;
        const addressInfo = await AppDataSource.getRepository(Txn)
          .createQueryBuilder('txn')
          .where({ address: exchangeAddress })
          .andWhere({ type: 'input' })
          .getRawMany();

        // log(addressInfo.length);

        const addressInputAmount = addressInfo.reduce(
          (acc, curr) => acc + curr.txn_amount,
          0,
        );

        return {
          exchangeAddress,
          addressInputAmount,
          addressTxnCount: addressInfo.length,
        };
      });

      const result = await Promise.all(exchangeAddressesInfo);
      // log(result);

      const totalInputAmount = result.reduce(
        (acc, curr) => acc + curr.addressInputAmount,
        0,
      );

      const txnCount = result.reduce(
        (acc, curr) => acc + curr.addressTxnCount,
        0,
      );

      const stat = {
        exchangeName: exchange.name,
        exchangeAddress: exchange.address,
        exchangeUrl: exchange.url,
        addressCount,
        txnCount,
        totalInputAmount,
      };
      exchangeStats.push(stat);
    }

    log(exchangeStats);
    return res.send(exchangeStats);
  };
  // // FRONTEND ENDPOINTS END HERE

  // helper
  countAddressesForExchange = async (exchangeId: string) => {
    let result;
    try {
      result = await AppDataSource.getRepository(Address)
        .createQueryBuilder('address')
        .where('address.exchangeId = :exchangeId', { exchangeId })
        .getCount();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
    return result;
  };

  // helper function - saveHashFromAddress
  getAllExchanges = async () => {
    let allExchanges;
    try {
      allExchanges = await AppDataSource.getRepository(Exchange)
        .createQueryBuilder('exchanges')
        .select('address')
        .getRawMany();
    } catch (error) {
      console.error(error);
    }
    return allExchanges;
  };

  // helper-not used
  getAllExchangesFull = async () => {
    let allExchanges;
    try {
      allExchanges = await AppDataSource.getRepository(Exchange)
        .createQueryBuilder('exchanges')
        .select(['address', 'name'])
        .getRawMany();
    } catch (error) {
      console.error(error);
    }

    return allExchanges;
  };

  // helper- get all txns
  getAllHashes = async () => {
    const hashes = await AppDataSource.getRepository(Hash)
      .createQueryBuilder('hash')
      .leftJoinAndSelect('hash.exchange', 'exchange')
      .select(['hash', 'name', 'address'])
      .getRawMany();

    if (hashes) {
      // console.log(hashes);
      return hashes;
    } else {
      return;
    }
  };

  // helper - saveAddressFromHash
  saveAddress = async (name: string, address: string) => {
    // console.log('address and name from save', name, address);

    let exchange;
    try {
      exchange = await AppDataSource.getRepository(Exchange).findOne({
        where: {
          name,
        },
      });
    } catch (error) {
      console.error(error);
    }
    // console.log(exchange);

    if (!exchange) return;

    const addressFound = await AppDataSource.getRepository(Address).findOne({
      where: {
        address: address,
      },
    });
    if (addressFound)  return;

    const exchangeCustomersCount = await this.countAddressesForExchange(
      exchange.id,
    );

    const newAddress = AppDataSource.getRepository(Address).create();
    newAddress.address = address;
    newAddress.exchange = exchange;
    newAddress.alias = name + exchangeCustomersCount;
    try {
      const savedAddress = await AppDataSource.getRepository(Address).save(newAddress);
      console.log('saved new address...', savedAddress);
    } catch (error) {
      log(error);
      // console.error('error: possible duplicate address');
    }
  };

  saveAddressFromHash = async () => {
    console.log('here');
    
    const exchangeAndHash = await this.getAllHashes();
    if (!exchangeAndHash) return;
    for (const component of exchangeAndHash) {
      const name = component.name;
      const hash = component.hash_hash;
      const exchangeAddress = component.address;
      // log(exchangeAddress, name);
      // get all addresses ass with hash
      const hashAddresses = await AppDataSource.getRepository(Txn)
        .createQueryBuilder('txn')
        .select('address')
        .where({ hash: hash })
        .andWhere({ type: 'input' })
        .getRawMany();

      if (hashAddresses.length == 0) {
        console.log('no hashes+addresses found while trying to save addresses');
        
        return;
      }
      const foundExchangeAddress = hashAddresses.find(
        (address) => address.address == exchangeAddress,
      );
      // console.log(foundExchangeAddress);
      
      if (foundExchangeAddress) {
        // console.log('found exchange address', foundExchangeAddress);
        continue;
      } 

      const realAddresses = hashAddresses.filter(
        (address) => address.address !== exchangeAddress,
      );
      // console.log(realAddresses);
      
      // console.log('saving addresses for new hash now', hash);

      for (const address of realAddresses) {
        // console.log('saving', address.address, 'for', name);
        await this.saveAddress(name, address.address);
      }
    }
  };

  // helper - saveAddressTxns (save address hashes)
  saveHash = async (hash: string, exchangeAddress: string) => {
    const hashFound = await AppDataSource.getRepository(Hash).findOne({
      where: {
        hash: hash,
      },
    });
    if (hashFound) return;

    let exchange;
    try {
      exchange = await AppDataSource.getRepository(Exchange).findOne({
        where: { address: exchangeAddress },
      });
    } catch (error) {
      console.log(error);
    }
    if (exchange) {
      // console.log('yes, there is an exchange!');
      
      const newHash = AppDataSource.getRepository(Hash).create();
      newHash.hash = hash;
      const timestamp = Date.now();
      newHash.saved = timestamp;
      const date = new Date(timestamp);
      const readableDate = date.toUTCString() ;
      newHash.savedLiteral = readableDate;
      newHash.exchange = exchange;
      try {
        const savedHash = await AppDataSource.getRepository(Hash).save(newHash);
        console.log('savedHash...', savedHash);
      } catch (error) {
        // console.error('error: duplicate hash', hash, error);
        console.log(error);
        
      }
    } else {
      console.log('Exchange not found');
    }
  };

  // helper1 - saveHashFromAddress
  saveHashGivenAddress = async (address: string) => {
    const url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}`;
    await axios
      .get(url)
      .then( async (response) => {
        const txns = response.data.txrefs;
        // console.log(txns);
        for (const txn of txns) {
          // console.log(txn.tx_hash, txn.confirmed);
          await this.saveHash(txn.tx_hash, address);
        }
      })
      .catch((error) => {
        console.error(error);
      }
      );
  }; 

  receiveAddressSaveHashes = async (req: Request, res: Response) => {
    const address = req.body.address;

    let isExchange;
    try {
      isExchange = await AppDataSource.getRepository(Exchange).findOneOrFail({
        where: { address: address },
      });
    } catch (error) {
      console.error('error: Exchange not found');
    }
    if (!isExchange) {
      return res.send('This is not an exchange address');
    } else {
      // console.log('saving individual address hash');

      this.saveHashGivenAddress(address);
      return res.send('ok.... saving hashes for address');
    }
  };

  saveHashFromAddress = async () => {
    const exchangeAddresses = await this.getAllExchanges();

    if (!exchangeAddresses) {
      return;
    }
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    for (const address of exchangeAddresses) {
      console.log(address.address);
      await delay(5000);
      console.log('address.address', address.address);
      
      this.saveHashGivenAddress(address.address);
    }
  };

  // helper1 - getTxnsByHash
  getHashes = async () => {
    let hashes;
    try {
      hashes = await AppDataSource.getRepository(Hash)
        .createQueryBuilder('hash')
        .select('hash')
        .take(10000)
        .getRawMany();
    } catch (error) {
      console.error(error);
    }

    if (hashes) {
      const hashPromises = hashes.map(async (hash) => {
        const realHash = hash.hash_hash;
        // console.log(realHash);

        const exists = await AppDataSource.getRepository(Txn).findOne({
          where: { hash: realHash },
        });
        if (exists) {
          // console.log(exists);
          return null;
        } else {
          return realHash;
        }
      });
      const realHashes = await Promise.all(hashPromises);
      // console.log(realHashes);

      const filteredHashes = realHashes.filter((hash) => hash !== null);
      // console.log('saving these', filteredHashes);

      return filteredHashes;
    } else {
      console.log('No hashes found');
      return;
    }
  };
  // helper2 - getTxnsByHash
  saveTxns = async (
    hash: string,
    address: string,
    time: string,
    type: string,
    amount: number,
    confirmations: number,
  ) => {
    const dateObj = new Date(time);
    const unixTimestampMilliseconds = dateObj.getTime();
    const unixTimestamp = Math.floor(unixTimestampMilliseconds / 1000);
    try {
      const newTxn = AppDataSource.getRepository(Txn).create();
      newTxn.hash = hash;
      newTxn.time = time;
      newTxn.type = type;
      newTxn.address = address;
      newTxn.amount = amount * 10 ** -8;
      newTxn.unique = amount + address + hash;
      newTxn.unixTimestamp = unixTimestamp;
      newTxn.confirmations = confirmations;

      await AppDataSource.getRepository(Txn).save(newTxn);
      console.log('saved new txn...');
    } catch (error) {
      console.error('error');
    }
  }; 
  // helper3 - getTxnsByHash
  getOneHashTxns = async (hash: string) => {
    console.log('checking if hash is saved...');
    
    // check if hash is saved...
    const hashFoundInTxn = await AppDataSource.getRepository(Txn)
      .createQueryBuilder('txn')
      .select('hash')
      .where({ hash: hash })
      .getRawMany(); 

    if (hashFoundInTxn.length > 0) {
      console.log(hash, ' is already registered!');
      // log(hashFoundInTxn);
      return;
    }else {
      console.log('saving this hash now...', hash);
      
    }

    console.log('saving', hash);

    const url = `https://api.blockcypher.com/v1/btc/main/txs/${hash}?limit=500`;
    axios
      .get(url)
      .then(async (response) => {
        const allTxns = response.data;
        const outputs = allTxns.outputs;
        const inputs = allTxns.inputs;
        const time = allTxns.confirmed;
        const confirmations = allTxns.confirmations;
        console.log('saving', hash);

        // save outputs
        for (const output of outputs) {
          const amount = output.value;
          const address = output.addresses[0];
          const type = 'output';

          await this.saveTxns(hash, address, time, type, amount, confirmations);
        }

        // save inputs
        for (const input of inputs) {
          const amount = input.output_value;
          const address = input.addresses[0];
          const type = 'input';
          // console.log(hash, address, time, type, amount, confirmations);

          await this.saveTxns(hash, address, time, type, amount, confirmations);
        }
      })
      .catch((error) => console.log(error));
  };

  getTxnsByHash = async () => {
    console.log('getting all Txns by hash...');
    
    const hashes = await this.getHashes();
    if (!hashes) return;
    // console.log(hashes);

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // pls trim only what you need
    for (const hash of hashes) {
      await delay(5000);
      // console.log('getting txns for this..', hash);
      await this.getOneHashTxns(hash);
    }
  }; 

  //  stand alone. edit all Txns and Update Address Alias
  updateAddressAliasInTxns = async () => {
    const addresses = await AppDataSource.getRepository(Address)
      .createQueryBuilder('address')
      .select('address')
      .getRawMany();

    if (!addresses) return;

    for (const address of addresses) {
      const alias = address.address_alias;
      const address_address = address.address_address;
      // console.log(alias, address_address);

      await AppDataSource.getRepository(Txn)
        .createQueryBuilder('txn')
        .update(Txn)
        .set({ alias: alias })
        .where({ address: address_address })
        .execute();
      // console.log(txns);
    }
  };

  runAllJobs = async () => {
    console.log('running all jobs...');
    
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await this.saveHashFromAddress();
    await delay(5000);
    await this.getTxnsByHash();
    await delay(5000);
    await this.saveAddressFromHash();
    await delay(5000);
    await this.updateAddressAliasInTxns();
    await delay(5000);
  }

  // Abstract
  getFees =async () => {
    axios.get('https://mempool.space/api/v1/fees/recommended')
    .then((response) => {
      const data = response.data;
      console.log(data.fastestFee);
      
    })
  }
}

export const txnController = new TxnController();
