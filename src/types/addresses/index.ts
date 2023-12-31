import { IUsersAddress, IWorker } from '../@autogenerated';

export interface IUserAddressGeoqueryItem extends IUsersAddress {
  worker?: IWorker;
  workerId?: string;
  distanceInKm: number;
}
