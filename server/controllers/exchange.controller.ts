import { Exchange } from "../entities/exchange.entity";
import { AppDataSource } from "../index";
import { Request, Response } from "express";

class ExchangeController {
    getAllExchanges =async (req: Request, res: Response) => {
        let allExchanges;
        try {
            allExchanges = await AppDataSource.getRepository(Exchange)
            .createQueryBuilder('exchanges')
            .leftJoinAndSelect('exchanges.addresses', 'address')
            .getMany();
        } catch (error) {
            console.error(error);
        }
        return res.send(allExchanges);
    }

    createExchange = async (req: Request, res: Response): Promise<Response> => {
        const { name, url, address } = req.body;
        try {
            const newExchange = AppDataSource.getRepository(Exchange).create();
            newExchange.url = url;
            newExchange.name = name;
            newExchange.address = address;

            const createdExchange = await AppDataSource.getRepository(Exchange).save(newExchange);
            return res.send(createdExchange);
        } catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
    };

}

export const exchangeController = new ExchangeController();