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
import type { LOS } from './LOS';
import {
    LOSFromJSON,
    LOSFromJSONTyped,
    LOSToJSON,
} from './LOS';

/**
 * 
 * @export
 * @interface PaginatedLOSList
 */
export interface PaginatedLOSList {
    /**
     * 
     * @type {number}
     * @memberof PaginatedLOSList
     */
    count: number;
    /**
     * 
     * @type {string}
     * @memberof PaginatedLOSList
     */
    next?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PaginatedLOSList
     */
    previous?: string | null;
    /**
     * 
     * @type {Array<LOS>}
     * @memberof PaginatedLOSList
     */
    results: Array<LOS>;
}

/**
 * Check if a given object implements the PaginatedLOSList interface.
 */
export function instanceOfPaginatedLOSList(value: object): value is PaginatedLOSList {
    if (!('count' in value) || value['count'] === undefined) return false;
    if (!('results' in value) || value['results'] === undefined) return false;
    return true;
}

export function PaginatedLOSListFromJSON(json: any): PaginatedLOSList {
    return PaginatedLOSListFromJSONTyped(json, false);
}

export function PaginatedLOSListFromJSONTyped(json: any, ignoreDiscriminator: boolean): PaginatedLOSList {
    if (json == null) {
        return json;
    }
    return {
        
        'count': json['count'],
        'next': json['next'] == null ? undefined : json['next'],
        'previous': json['previous'] == null ? undefined : json['previous'],
        'results': ((json['results'] as Array<any>).map(LOSFromJSON)),
    };
}

export function PaginatedLOSListToJSON(value?: PaginatedLOSList | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'count': value['count'],
        'next': value['next'],
        'previous': value['previous'],
        'results': ((value['results'] as Array<any>).map(LOSToJSON)),
    };
}

