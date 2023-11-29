import AWS from 'aws-sdk';
import axios from 'axios';
import { Fee } from '../entities/fee.entity';
import { AppDataSource } from '../index';

class FeeController {
  getFees = async () => {
    const recentLow = await this.fetchFees() || 100;

    axios
      .get('https://mempool.space/api/v1/fees/recommended')
      .then(async (response) => {
        const data = response.data;

        const fast = data.fastestFee;
        const normal = data.halfHourFee;
        const slow = data.hourFee;

        const fee = new Fee();
        fee.fast = fast;
        fee.normal = normal;
        fee.slow = slow;
        fee.timestamp = new Date().toLocaleString();
        fee.unixTimeStamp = Date.now();

        const newFee = await AppDataSource.getRepository(Fee).save(fee);
        console.log(newFee);
        if (slow < recentLow) {
          this.sendEmail(slow);
        } else {
            console.log('fees are still high');
        }
      }).catch((err) => { console.log(err) });
  };

  fetchFees = async () => {
    const fees = await AppDataSource.getRepository(Fee)
      .createQueryBuilder('fee')
      .orderBy('fee.unixTimeStamp', 'DESC')
      .limit(144)
      .getRawMany();

    // console.log(fees);

    // add all fees to an array
    const slowFees = fees.map((fee) => fee.fee_slow);
    const minNumber = Math.min(...slowFees);

    // console.log(minNumber);
    return minNumber;
  };

  sendEmail = async (fee: string) => {
    // doing some aws stuff here

    AWS.config.update({
      accessKeyId: 'AKIAV46S6RV5G4OAQ6EV',
      secretAccessKey: 'MZ0e58eFeBmU7LDtAU49D41SRwy0ieTgqpjiGLD1',
      region: 'eu-west-2', // change to your region
    });

    const ses = new AWS.SES();
    const params = {
      Source: 'prezdevo@gmail.com',
      Destination: {
        ToAddresses: ['prezdevo@gmail.com'],
      },
      Message: {
        Body: {
          Text: { Data: `Hello Fees are as low as ${fee} now!!! Lowest in 24 hours` },
        },
        Subject: { Data: `(${fee}) - Low FEES Prezzy` },
      },
    };

    ses.sendEmail(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data); // successful response
    });
  };
}

export const feeController = new FeeController();
