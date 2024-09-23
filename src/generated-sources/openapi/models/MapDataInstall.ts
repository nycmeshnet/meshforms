/* tslint:disable */
/* eslint-disable */
/**
 * MeshDB Data API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface MapDataInstall
 */
export interface MapDataInstall {
    /**
     * 
     * @type {number}
     * @memberof MapDataInstall
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof MapDataInstall
     */
    readonly name: string | null;
    /**
     * 
     * @type {string}
     * @memberof MapDataInstall
     */
    readonly status: string | null;
    /**
     * 
     * @type {Array<number>}
     * @memberof MapDataInstall
     */
    readonly coordinates: Array<number>;
    /**
     * 
     * @type {number}
     * @memberof MapDataInstall
     */
    requestDate: number;
    /**
     * 
     * @type {number}
     * @memberof MapDataInstall
     */
    installDate: number;
    /**
     * 
     * @type {boolean}
     * @memberof MapDataInstall
     */
    roofAccess: boolean;
    /**
     * 
     * @type {string}
     * @memberof MapDataInstall
     */
    readonly notes: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof MapDataInstall
     */
    readonly panoramas: Array<string>;
}

/**
 * Check if a given object implements the MapDataInstall interface.
 */
export function instanceOfMapDataInstall(value: object): value is MapDataInstall {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('status' in value) || value['status'] === undefined) return false;
    if (!('coordinates' in value) || value['coordinates'] === undefined) return false;
    if (!('requestDate' in value) || value['requestDate'] === undefined) return false;
    if (!('installDate' in value) || value['installDate'] === undefined) return false;
    if (!('roofAccess' in value) || value['roofAccess'] === undefined) return false;
    if (!('notes' in value) || value['notes'] === undefined) return false;
    if (!('panoramas' in value) || value['panoramas'] === undefined) return false;
    return true;
}

export function MapDataInstallFromJSON(json: any): MapDataInstall {
    return MapDataInstallFromJSONTyped(json, false);
}

export function MapDataInstallFromJSONTyped(json: any, ignoreDiscriminator: boolean): MapDataInstall {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
        'status': json['status'],
        'coordinates': json['coordinates'],
        'requestDate': json['requestDate'],
        'installDate': json['installDate'],
        'roofAccess': json['roofAccess'],
        'notes': json['notes'],
        'panoramas': json['panoramas'],
    };
}

export function MapDataInstallToJSON(value?: Omit<MapDataInstall, 'name'|'status'|'coordinates'|'notes'|'panoramas'> | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'id': value['id'],
        'requestDate': value['requestDate'],
        'installDate': value['installDate'],
        'roofAccess': value['roofAccess'],
    };
}

