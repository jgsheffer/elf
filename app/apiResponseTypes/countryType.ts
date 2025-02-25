import { Translation } from "./translationType";
import { Asset } from "./assetType";
import { Coordinates } from "./coordinatesType";

export interface Country {
    code: string;
    id: string;
    name: Translation;
    assets: Asset[];
    coordinates: Coordinates;
  }