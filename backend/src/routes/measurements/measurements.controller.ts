import {
    NOT_FOUND,
    SERVER_ERROR,
    SUCCESS,
    BAD_REQUEST
} from '../../utils/httpCodeResponses/messages';
import { Request, Response } from 'express';
import { getMeasurementsByGatewayId, getMeasurementsByNodeId } from './measurements.service';
import { getGatewayById } from '../gateway/gateway.service';
import { getNodeById } from '../gateway/node.service';


export const GetMeasurementsHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const path = req.route.path;
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (req.query.startDate) {
        startDate = new Date(req.query.startDate as string);
    }
    if (req.query.endDate) {
        endDate = new Date(req.query.endDate as string);
    }

    try {
        if (path.includes('node')) {
            const node = await getNodeById(id);
            if (!node) {
                NOT_FOUND(res, `Node ID: ${id} not found`);
                return;
            }
            const measurements = await getMeasurementsByNodeId(id, startDate, endDate);
            if (measurements) {
                SUCCESS(res, `Measurements for Node ID: ${id}`, { measurements });
            } else {
                NOT_FOUND(res, `No measurements found for Node ID: ${id}`);
            }
        } else if (path.includes('gateway')) {
            const gateway = await getGatewayById(id);
            if (!gateway) {
                NOT_FOUND(res, `Gateway ID: ${id} not found`);
                return;
            }
            const measurements = await getMeasurementsByGatewayId(id, startDate, endDate);
            if (measurements) {
                SUCCESS(res, `Measurements for Gateway ID: ${id}`, { measurements });
            } else {
                NOT_FOUND(res, `No measurements found for Gateway ID: ${id}`);
            }
        } else {
            BAD_REQUEST(res, 'Invalid request path');
        }
    } catch (error) {
        console.error(`Error retrieving measurements: ${error}`);
        SERVER_ERROR(res);
    }
};

